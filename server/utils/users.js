[{
	id: "568347296584",
	name: "Will",
	room: "LOTR fans"
}]

// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

// To create a user array and its methods we are going to use ES6 classes

class Users {
	constructor () {
		this.users = [];
	}
	addUser (id, name, room) {
		var user = {id, name, room};
		this.users.push(user);
		return user;
	}
	removeUser (id) {
		var user = this.users.filter((user) => user.id === id)[0];
		if(user){
			this.users = this.users.filter((user) => user.id !== id);
		}

		return user;
		
		
	}
	getUser (id) {
		// return user
		return this.users.filter((user) => user.id === id)[0];
		
	}
	getUserList (room) {
		// will return an array for all the users in the specified room.
		// filter the users array for all those that are in the 
		// room provided in the arguments.
		var users = this.users.filter((user) => user.room === room);
		// create an array from users but only including the user.name
		// property
		var namesArray = users.map((user) => user.name)

		return namesArray;
	}
}

module.exports = {Users};

// create a class called Person (uppercase P is convention). We can then
// make instances of the class
// class Person {
// 	// classes can be given constructor functions to customise them when
// 	// created. It gets called automatically with the speciifed args
// 	constructor (name) {
// 		// this refers to the instance of the Person
// 		// we give the instance properties based on the arguments
// 		this.name = name

// 	}
// 	// to add methods we write them after the constructor WITHOUT using
// 	// a comma
// 	getUserDescription() {
// 		// function
// 	}
// }