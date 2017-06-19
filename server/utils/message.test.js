var expect = require("expect");

var {generateMessage, generateLocationMessage} = require("./message");

describe("generateMessage", () => {
	it("should generate the correct message object", () => {
		var message = generateMessage("Peter", "Let's meet at 5");

		expect(message.from).toBe("Peter");
		expect(message.text).toBe("Let's meet at 5");
		expect(message.createdAt).toBeA("number");
		
	});
});

describe("generateLocationMessage", () => {
	it("should generate correct location object", () => {
		var from = "Bob";
		var latitude = 15;
		var longitude = 19;
		var url = "https://www.google.com/maps?q=15,19";
		var message = generateLocationMessage(from, latitude, longitude);

		expect(message.createdAt).toBeA("number");
		expect(message).toInclude({from, url});
	})
})