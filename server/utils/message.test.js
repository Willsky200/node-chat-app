var expect = require("expect");

var {generateMessage} = require("./message");

describe("generateMessage", () => {
	it("should generate the correct message object", () => {
		var message = generateMessage("Peter", "Let's meet at 5");

		
		expect(message.from).toBe("Peter");
		expect(message.text).toBe("Let's meet at 5");
		expect(message.createdAt).toBeA("number");
		
	});
});