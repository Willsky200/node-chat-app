// path is a built in node module so does not need to be installed
// it has a function called join which can be used to make path finding easy
const path = require("path");
// http is a built in node module that deals with http requests.
// it is used by express under the hood.
const http = require("http");

const express = require("express");
const socketIO = require("socket.io");

const {generateMessage, generateLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation");
const {Users} = require("./utils/users");

// path.join takes arguments that it joins together. As this file is in
// /server, normally we would have to go out out the /server dir and then
// into the public. But with path it stops us going in then out again.

// this uses the path node-chat-app\server/../public
// console.log(__dirname + "/../public");
// while this uses the path node-chat-app\public
// console.log(publicPath);

const publicPath = path.join(__dirname, "../public")
// set the port variable to be either the heroku port or the local port 3000
const port = process.env.PORT || 3000;

var app = express();
// create a server using the http method. We can provide the app (express)
// as the argument because they are closely integrated
var server = http.createServer(app);
// configure the server to use socket.io. io is now our web socket server
var io = socketIO(server);
// create a new array called users which will be the list of users
var users = new Users();

// set the app to use files from the public directory
app.use(express.static(publicPath));

app.get("/", (req, res) => {
	res.render("index");
})

// register an event called connection and do something on the connection
io.on("connection", (socket) => {
	console.log("New user connected");

	// emit a message to the connected user greeting them.
	// use the generateMessage function to create the message object
	// socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));

	// emit a newMessage that goes to all users except the connected
	// informs the others that a new user has joined
	// socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined"));

	// emit a custom event. There is no callback function because this is
	// an emit not a listener
	// But we do want to send some data. We use an object as the second arg
	// and we can specify whatever we like

	// socket.emit("newEmail", {
	// 	from: "jim@boble.com",
	// 	text: "Why don't you get lost.",
	// 	createdAt: 123
	// });

	// emit a custom event to the client and supply data in an object
	// socket.emit("newMessage", {
	// 	from: "Gwyneth",
	// 	text: "I'm ready to go.",
	// 	createdAt: 123123
	// });

	// set up event listener for the custom event emitter from the client
	// the callback function argument (here it is newEmail) is the data sent
	// from the client emitter

	// socket.on("createEmail", (newEmail) => {
	// 	console.log("Create email", newEmail);
	// });

	// set up listener for the join event
	socket.on("join", (params, callback) => {
		// validate using the utils function
		if (!isRealString(params.name) || !isRealString(params.room)){
			//send error back if room and name are not valid
			return callback("Name and room name are required");
		}

		
		// socket.join takes the string of the room name - it is a socket
		// method
		socket.join(params.room)
		// socket.leave("params.room") does the opposite and removes you
		// from the room

		// ways of emitting
		// ioi.emit - send to everyone
		// socket.broadcast.emit - sent to all except the user
		// socket.emit - only sends to the user

		// io.to(params.room) - this sends to everyone in the room specified
		// by params.room

		// socket.broadcast.to(params.room) - broadcas to everyone in the
		// room except the user

		// remove the user from any potential previous rooms
		users.removeUser(socket.id);
		// add a new user using the 3 args, id, name and room
		users.addUser(socket.id, params.name, params.room);
		// send to all users in the specified room the event with the
		// users of their room as an argument.
		io.to(params.room).emit("updateUserList", users.getUserList(params.room));

		// We can stick with the normal socket.emit because it doesn't
		// matter about rooms when it is only going to the user
		socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));

		// We send the new user message to everyone in the room
		socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined`));

		callback();
	});

	// set up custom event listener to receive data from the client when it 
	// emits a createMessage event.

	// callback is used for acknowledging events. It is called later
	// to activate the acknowledgement 
	socket.on("createMessage", (message, callback) => {
		// get the user who sent the message
		var user = users.getUser(socket.id);

		// check that the user exists and the string is valid
		if(user && isRealString(message.text)) {
			// emit a newMessage event to all those in the room and sending
			// the user name.
			io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
		}
		

		// broadcasting is the name for emitting an event to everyone except
		// the emitting user.
		// To do this we have to specify the individual socket so the library
		// knows which user shouldn't get the event.

		// socket.broadcast.emit("newMessage", {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
		// 
		// we can send data back in the callback, for example an error message,
		// or an object
		callback();
	});

	socket.on("createLocationMessage", (coords) => {

		// get the user who sent the message
		var user = users.getUser(socket.id);
		// check the user exists
		if(user){
			// emit a new event type and pass in three value (name, lat and long)
			// to the generateLocationMessage function which will return a url.
			io.to(user.room).emit("newLocationMessage", generateLocationMessage(user.name, coords.latitude, coords.longitude));
		}
		
	});

	// listen for a client disconnection e.g. closing the tab
	socket.on("disconnect", () => {
		console.log("Client disconnected");
		// remove the user from the users list
		var user = users.removeUser(socket.id);

		// if the user was removed then send an event to update the
		// the user list with the list from that room and send a message
		// to the room saying that the user has left.
		if(user) {
			io.to(user.room).emit("updateUserList", users.getUserList(user.room));
			io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} has left.`));
		}
	});
})

// we use server.listen because we are using socket.io
server.listen(port, () => {
	console.log(`Server is up on ${port}`);
});