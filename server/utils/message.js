
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

module.exports = {generateMessage};