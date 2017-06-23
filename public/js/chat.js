// this initiates the request from the server to open a connection
var socket = io();

// add a function that scrolls the messages object if the user is near the 
// bottom and a new message is added
function scrollToBottom() {
	// Selectors
	// select the messages object
	var messages = $("#messages");
	// select the most recently sent message
	var newMessage = messages.children("li:last-child");

	// Heights
	// get the height of what the client is viewing of the object
	var clientHeight = messages.prop("clientHeight");
	// get the height of the messages object that is above what the client
	// can see
	var scrollTop = messages.prop("scrollTop");
	// get the height of the whole messages object regardless if it is seen
	// or not
	var scrollHeight = messages.prop("scrollHeight");
	// get the height of the most recent message
	var newMessageHeight = newMessage.innerHeight();
	// get the height of the second most recent message
	var lastMessageHeight = newMessage.prev().innerHeight();

	// Calculation

	// if the client is viewing the bottom part of the messages object
	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		// set the scrollTop to the height of the messages object
		// in other words scroll to the bottom
		messages.scrollTop(scrollHeight);
	}
}

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

// UNUSED CODE=============================================================
// listen for the custom event coming from the server called newEmail
// the argument in the callback function (in this case email) is the object
// // sent my the event emitted by the server

// socket.on("newEmail", function(email) {
// 	console.log("New email", email);
// });
//========================================================================

// listen for custom event newMessage and data coming from the server
socket.on("newMessage", function(message) {
	// console.log("New message", message);

	// THIS IS REDUNDANT CODE USED INITIALLY BUT REPLACED BY TEMPLATES
	//====================================================================
	// // create var li as an empty list item
	// var li = jQuery("<li></li>");
	// // change the text of li to the from and text values from message
	// // that has been sent from the server
	// li.text(`${message.from} ${formattedTime}: ${message.text}`);
	// // append the li to the ordered list
	// jQuery("#messages").append(li);
	//====================================================================

	// // create formatted time variable for the createdAt value
	var formattedTime = moment(message.createdAt).format("h:mm a");

	// select the template script tag from index.html
	var template = $("#message-template").html();

	// create var html and set it to render using the template variable
	// from above (the script in html) and create an object that contains
	// the values to be put in the template
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	// append the html variable to the messages object, thus adding a
	// new message template with correct values.
	$("#messages").append(html);
	// call the scrollToBottom function to scroll down if necessary
	scrollToBottom();
});

// listen for the newLocationMessage
socket.on("newLocationMessage", function(message) {

	// THIS IS REDUNDANT CODE USED INITIALLY BUT REPLACED BY TEMPLATES
	//====================================================================
	// create var li as an empty list item
	// var li = jQuery("<li></li>");
	// create var a as a link with text. The target="_blank" means that the
	// link will open in a new tab.
	// var a = jQuery("<a target='_blank'>My current location</a>");

	// li.text(`${message.from} ${formattedTime}: `);
	// a.attr("href", message.url);

	// li.append(a);
	// jQuery("#messages").append(li);
	//====================================================================

	// create formatted time variable for the createdAt value
	var formattedTime = moment(message.createdAt).format("h:mm a");

	// The following code is almost identical to that in the callback
	// function above in the newMessage listener.
	var template = $("#location-message-template").html();

	var html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});

	$("#messages").append(html);
	scrollToBottom();
});


// UNUSED CODE ==============================================================
// socket.emit("createMessage", {
// 	from: "Bill",
// 	text: "Hi there"
// 	// to set up acknowledging events we need to add soemthging in both on the
// 	// client side and the server. We do this with a third argument as a
// 	// callback. data is sent from the server whn callback is called
// }, function (data) {
// 	console.log(data);
// });
// ==========================================================================


// add listener to the submit button on the form
jQuery("#message-form").on("submit", function(e) {
	// prevent the default refresh action of the button
	e.preventDefault();

	// select the textbox that has name="message"
	var messageTextBox = jQuery("[name=message]");

	// emit to the server, sending data in an object
	socket.emit("createMessage", {
		from: "User",
		text: messageTextBox.val()
		// set up the acknowledgement callback
	}, function () {
		messageTextBox.val("");
	});
});

// select the send location button
var locationButton = jQuery("#send-location");

// create a click listener on the location button
locationButton.on("click", function() {
	// if the browser does not support geolocation then send an alert
	// saying this
	if (!navigator.geolocation){
		return alert("Geolocation is not supported by your browser.");
	}

	// disables the button
	locationButton.attr("disabled", "disabled").text("Sending location...");

	navigator.geolocation.getCurrentPosition(function (position) {
		locationButton.removeAttr("disabled").text("Send location");
		socket.emit("createLocationMessage", {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		})
	}, function () {
		locationButton.removeAttr("disabled").text("Send location");
		alert("Unable to fetch location");
	} );
});

