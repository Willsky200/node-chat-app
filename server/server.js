// path is a built in node module so does not need to be installed
// it has a function called join which can be used to make path finding easy
const path = require("path")

const express = require("express");


// path.join takes arguments that it joins together. As this file is in
// /server, normally we would have to go out out the /server dir and then
// into the public. But with path it stops us going in then out again.

// this uses the path node-chat-app\server/../public
// console.log(__dirname + "/../public");
// while this uses the path node-chat-app\public
// console.log(publicPath);

const publicPath = path.join(__dirname, "../public")
// set the port variable to be either the heroku port or the local port 3000
const port = process.env.PORT || 3000;

// create new express - configure static middleware and call app.listen

var app = express();

// set the app to use files from the public directory
app.use(express.static(publicPath));

app.get("/", (req, res) => {
	res.render("index");
})



app.listen(port, () => {
	console.log(`Server is up on ${port}`);
});