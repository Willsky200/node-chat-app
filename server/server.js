// path is a built in node module so does not need to be installed
// it has a function called join which can be used to make path finding easy
const path = require("path");
// http is a built in node module that deals with http requests.
// it is used by express under the hood.
const http = require("http");

const express = require("express");
const socketIO = require("socket.io");

const {generateMessage} = require("./utils/message");


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
	socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));

	// emit a newMessage that goes to all users except the connected
	// informs the others that a new user has joined
	socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined"));

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

	// set up custom event listener to receive data from the client when it 
	// emits a createMessage event.
	socket.on("createMessage", (message) => {
		// log the contents
		// console.log("Create message", message);

		// emit an event to all connected users. socket.emit emits
		// to a single connection, while io.emit sends to all users
		io.emit("newMessage", generateMessage(message.from, message.text));

		// broadcasting is the name for emitting an event to everyone except
		// the emitting user.
		// To do this we have to specify the individual socket so the library
		// knows which user shouldn't get the event.

		// socket.broadcast.emit("newMessage", {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	// listen for a client disconnection e.g. closing the tab
	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
})

// we use server.listen because we are using socket.io
server.listen(port, () => {
	console.log(`Server is up on ${port}`);
});