var express = require('express');
var router = express.Router();


// Data
var data = {
	jobs: [
		{id: 1, points: 1, title: "Take the bins out"},
		{id: 2, points: 1, title: "Bring the bins in"},
		{id: 3, points: 1, title: "Load the dishwasher"},
		{id: 4, points: 1, title: "Unload the dishwasher"},
		{id: 5, points: 1, title: "Cook a meal"},
		{id: 6, points: 1, title: "Do the ironing"},
		{id: 7, points: 1, title: "Put a load of washing on"},
		{id: 8, points: 1, title: "Unload the washing"},
		{id: 9, points: 1, title: "Hang out the washing"},
		{id: 10, points: 1, title: "Mow the lawn"},
		{id: 11, points: 1, title: "Do the gardening"},
		{id: 12, points: 1, title: "Do a tip run"},
		{id: 13, points: 1, title: "Do the hovering"},
		{id: 14, points: 1, title: "Drop someone off"},
		{id: 15, points: 1, title: "Pick someone up"},
		{id: 16, points: 1, title: "Do an online shop"},
		{id: 17, points: 1, title: "Do a supermarket shop"},
		{id: 18, points: 1, title: "Tidy a room"},
		{id: 19, points: 1, title: "Clean a room"},
		{id: 20, points: 1, title: "Do some homework"},
		{id: 21, points: 1, title: "Practice an instrument"},
		{id: 22, points: 1, title: "Feed Boris"},
		{id: 22, points: 1, title: "Clean Boris's table"}
	],
	users: [
		{id: 1, name: "Tim"}, 
		{id: 2, name: "Karen"}, 
		{id: 3, name: "Alice"}
	]
};


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', data);
});

module.exports = router;
