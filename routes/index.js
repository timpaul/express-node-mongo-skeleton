var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Job = mongoose.model('jobs'),
	_ = require('underscore');


// Data
var data = {
	jobs: [
		{id: 1, points: 1, title: "took the bins out"},
		{id: 2, points: 1, title: "brought the bins in"},
		{id: 3, points: 1, title: "loaded the dishwasher"},
		{id: 4, points: 1, title: "unloaded the dishwasher"},
		{id: 5, points: 1, title: "cooked a meal"},
		{id: 6, points: 1, title: "did the ironing"},
		{id: 7, points: 1, title: "put a load of washing on"},
		{id: 8, points: 1, title: "unloaded the washing"},
		{id: 9, points: 1, title: "hung out the washing"},
		{id: 10, points: 1, title: "mowed the lawn"},
		{id: 11, points: 1, title: "did the gardening"},
		{id: 12, points: 1, title: "did a tip run"},
		{id: 13, points: 1, title: "did the hoovering"},
		{id: 14, points: 1, title: "dropped someone off"},
		{id: 15, points: 1, title: "picked someone up"},
		{id: 16, points: 1, title: "did an online shop"},
		{id: 17, points: 1, title: "did a supermarket shop"},
		{id: 18, points: 1, title: "tidied a room"},
		{id: 19, points: 1, title: "cleaned a room"},
		{id: 20, points: 1, title: "did some homework"},
		{id: 21, points: 1, title: "practiced an instrument"},
		{id: 22, points: 1, title: "fed Boris"},
		{id: 22, points: 1, title: "cleaned Boris's table"}
	],
	users: [
		{id: 1, name: "Tim", points: 0}, 
		{id: 2, name: "Karen", points: 0}, 
		{id: 3, name: "Alice", points: 0}
	]
};


/* GET home page. */
router.get('/', function(req, res, next) {

	var pageData = data;

	res.render('index', pageData);

});


/* GET stats page. */
router.get('/stats', function(req, res, next) {

	var pageData = data;

    // Get job history from database
	Job.find(function(err, jobs){

		// Add job history to page data
    	pageData.history = _.sortBy(jobs, 'dob').reverse();

    	// Create a job history grouped by user
		var jobsByUser = _(jobs).groupBy('userName');


		// For each user in the job history
		_.each(jobsByUser, function(user, key) {

			// Sum the points for that user
			var points = _.reduce(user, function(num, event){
				return event.jobPoints + num; 
			}, 0);

			// Add total points to each user in page data
			_.findWhere(pageData.users, {name: key}).points = points;

		});

		// Sort users by points
    	pageData.users = _.sortBy(pageData.users, 'points').reverse();

	    res.render('stats', pageData);

  	});

});


/* GET user page. */
router.get('/user-:userId', function(req, res, next) {

	var pageData = {};

	// Add user data
  	var userId = parseInt(req.params.userId);
	var user = _.where(data.users, {id: userId});
	pageData.user = user[0];

	// Add jobs data
	pageData.jobs = data.jobs;

  	res.render('user', pageData);
});


/* GET add job page. */
router.get('/user-:userId/job-:jobId', function(req, res, next) {

	var pageData = {};

	// Add user data
  	var userId = parseInt(req.params.userId);
	var user = _.where(data.users, {id: userId});
	pageData.user = user[0];

	// Add job data
  	var jobId = parseInt(req.params.jobId);
	var job = _.where(data.jobs, {id: jobId});
	pageData.job = job[0];

  	res.render('job-add', pageData);

});


/* POST add job. */
router.post('/add-job', function(req, res) {

    // Create new job event and save to db
    new Job({
    	userId : req.body.userId, 
    	userName : req.body.userName, 
    	jobId : req.body.jobId,
    	jobTitle : req.body.jobTitle,
    	jobPoints : req.body.jobPoints   
    })
    .save(function(err, job) {
        console.log(job)
        res.redirect('/');
    });

});

module.exports = router;
