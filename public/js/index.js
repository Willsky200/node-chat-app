// this initiates the request from the server to open a connection
var socket = io();

		// listen for an event called "connect"
socket.on("connect", function () {
	console.log("Connected to server");

	// create a custom event emitter. We do not need a callback function but
	// we can nsupply data to be sent. We do this in an object so send 
	// multiple things
	
	// socket.emit("createEmail", {
	// 	to: "Jim@cok.com",
	// 	text: "Yo, Jim. You smell"
	// });

	// emit a custom event and supply data to be sent in an object to server
	// socket.emit("createMessage", {
	// 	to: "Glen",
	// 	text: "Meet me at the corner in 5."
	// });
});

// listen for a disconnection
socket.on("disconnect", function () {
	console.log("Disconnected from server");
});

// listen for the custom event coming from the server called newEmail
// the argument in the callback function (in this case email) is the object
// // sent my the event emitted by the server

// socket.on("newEmail", function(email) {
// 	console.log("New email", email);
// });

// listen for custom event newMessage and data coming from the server
socket.on("newMessage", function(message) {
	console.log("New message", message);

	// create var li as an empty list item
	var li = jQuery("<li></li>");
	// change the text of li to the from and text values from message
	// that has been sent from the server
	li.text(`${message.from}: ${message.text}`);
	// append the li to the ordered list
	jQuery("#messages").append(li);
});

// socket.emit("createMessage", {
// 	from: "Bill",
// 	text: "Hi there"
// 	// to set up acknowledging events we need to add soemthging in both on the
// 	// client side and the server. We do this with a third argument as a
// 	// callback. data is sent from the server whn callback is called
// }, function (data) {
// 	console.log(data);
// });

// add listener to the submit button on the form
jQuery("#message-form").on("submit", function(e) {
	// prevent the default refresh action of the button
	e.preventDefault();

	// emit to the server
	socket.emit("createMessage", {
		from: "User",
		text: jQuery("[name=message]").val()
		// set up the acknowledgement callback
	}, function () {

	});
})

