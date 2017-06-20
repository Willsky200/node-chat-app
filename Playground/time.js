// Time stamps are integers - all integers are valid. 
//They are relative to Jan 1st 1970 00:00:00 am
// -1000 goes 1 second into the past from that date.
// 1000 is 1 second into Jan 1st 1970

// to get a time stamp we  call new Date().getTime()

// However we want to form a human readable format, not just a number

// Date inbuilt methods are limited for example getMinutes, getFullYear etc.
// These are unflexible

// create a new date
// var date = new Date();
// print the month (0 indexed). This prints 5 (writing in June).
// This does not format the month to Jun or June and it is even worse 
// with days and relative time strings e.g. sent 3 minutes ago.
// console.log(date.getMonth());

// MOMENT is the go to library for formatting times and dates

var moment = require("moment");

// Create a new moment object that represent sthe current date and time
var date = moment();
// Print out the full formatted date
// 2017-06-19T15:34:36+02:00
console.log(date.format());

// print the shorthand version for the current month (Jun)
// moment takes patterns in the format method
console.log(date.format("MMM"));

// print date and year: Jun 2017
console.log(date.format("MMM YYYY"));

// momentjs.com/docs/#/displaying/ shows all the possible patterns

// print the full date: Jun 19th 2017
console.log(date.format("MMM Do YYYY"));

// print the time in 12 hour clock: 3:45 pm
console.log(date.format("h:mm a"));


// moment can also add and subtract values

// add a year to the current time
date.add(1, "years");
console.log(date.format("MMM Do YYYY"));

// subtract 3 months from the current time
date.subtract(3, "months");
console.log(date.format("MMM Do YYYY"));


// If we pass a time stamp into moment() it saves the time
// default is NOW


// create a new time stamp
var someTimestamp = moment().valueOf();
console.log(someTimestamp)

