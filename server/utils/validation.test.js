var expect = require("expect");
var {isRealString} = require("./validation.js");

describe("isRealString function", () => {
	it("should reject non-string values", () => {
		var res = isRealString(877);
		expect(res).toBe(false);
	});

	it("should reject string with only spaces", () => {
		var res = isRealString("       ");
		expect(res).toBe(false);
	});

	it("should allow string with non-space characters", () => {
		var res = isRealString("String");
		expect(res).toBe(true);
	})
})