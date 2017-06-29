const expect = require("expect");

const {Users} = require("./users");

describe("Users", () => {

	// set up seed data
	var users;
	beforeEach(() => {
		users = new Users();
		users.users = [{
			id: "1",
			name: "Mike",
			room: "Node Course"
		}, {
			id: "2",
			name: "Paul",
			room: "React Course"
		}, {
			id: "3",
			name: "Georgina",
			room: "Node Course"
		}];
	});

	it("should add new user", () => {
		var users = new Users();
		var user = {
			id: "123",
			name: "Will",
			room: "LOTR fans"
		};
		var resUser = users.addUser(user.id, user.name, user.room);

		expect(users.users).toEqual([user]);

	});

	it("should remove a user", () => {
		var user = users.removeUser("1");

		expect(user.id).toBe("1");
		expect(users.users.length).toBe(2);
	});

	it("should not remove user", () => {
		var user = users.removeUser("99");

		expect(user).toNotExist();
		expect(users.users.length).toBe(3);
	});

	it("should find user", () => {
		var foundUser = users.getUser("1");

		expect(foundUser).toEqual({
			id: "1",
			name: "Mike",
			room: "Node Course"
		})
	});

	it("should not find user", () => {
		var foundUser = users.getUser("99");

		expect(foundUser).toNotExist();
	})

	it("should return names for node course", () => {
		var userList = users.getUserList("Node Course");

		expect(userList).toEqual(["Mike", "Georgina"]);
	});
	it("should return names for react course", () => {
		var userList = users.getUserList("React Course");

		expect(userList).toEqual(["Paul"]);
	});


});