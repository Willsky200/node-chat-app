
// create a function that generates a message object based on two arguments,
// from and text.
var generateMessage = (from, text) => {
	return {
		from,
		text,
		// Also supplies a createdAt time stamp for the current time
		createdAt: new Date().getTime()
	};
};

// create a function that takes three arguments
var generateLocationMessage = (from, latitude, longitude) => {
	// return an object with from, createdAt and a url that is set up to work
	// with google maps.
	return {
		from,
		url: `https://www.google.com/maps?q=${latitude},${longitude}`,
		createdAt: new Date().getTime()
	}
}

module.exports = {generateMessage, generateLocationMessage};