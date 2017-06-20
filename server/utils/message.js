
var moment = require("moment");
// create a function that generates a message object based on two arguments,
// from and text.
var generateMessage = (from, text) => {
	return {
		from,
		text,
		// Also supplies a createdAt time stamp for the current time
		createdAt: moment().valueOf()
	};
};

// create a function that takes three arguments
var generateLocationMessage = (from, latitude, longitude) => {
	// return an object with from, createdAt and a url that is set up to work
	// with google maps.
	return {
		from,
		url: `https://www.google.com/maps?q=${latitude},${longitude}`,
		createdAt: moment().valueOf()
	}
}

module.exports = {generateMessage, generateLocationMessage};