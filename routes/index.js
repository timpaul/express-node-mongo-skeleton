var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Job = mongoose.model('jobs'),
	_ = require('underscore');

// Load data
var	data = require('../data/data.json');


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
    	pageData.history = _.sortBy(jobs, 'jobDate').reverse();

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


/* GET user job list page. */
router.get('/user-:userId/job-list', function(req, res, next) {

	var pageData = {};

	// Add user data
  	var userId = parseInt(req.params.userId);
	var user = _.where(data.users, {id: userId});
	pageData.user = user[0];

	// Add jobs data
	pageData.jobs = data.jobs;

  	res.render('job-list', pageData);
});


/* GET user page. */
router.get('/user-:userId', function(req, res, next) {

	var pageData = data;

	pageData.currentUserId = parseInt(req.params.userId);

	// Get job history from database
	Job.find(function(err, jobs){

		// Add job history to page data
    	pageData.history = _.sortBy(jobs, 'jobDate').reverse();


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


    	console.log(pageData);

		// Sort users by points
    	pageData.users = _.sortBy(pageData.users, 'points').reverse();

	    res.render('user', pageData);

  	});

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
    	jobPoints : req.body.jobPoints,
    	jobDate : req.body.jobDate  
    })
    .save(function(err, job) {
        console.log(job)
        res.redirect('/user-' + job.userId);
    });

});


/* GET admin page. */
router.get('/admin', function(req, res, next) {

	var pageData = data;

    // Get job history from database
	Job.find(function(err, jobs){

		// Add job history to page data
    	pageData.history = _.sortBy(jobs, 'jobDate').reverse();

	    res.render('admin', pageData);

  	});

});


/* Delete an event. */
router.get('/delete/event-:eventId', function(req, res, next) {

	Job.findByIdAndRemove(req.params.eventId, function (err, job) {
	    res.redirect('/admin');
	});

});


/* Delete ALL events. */
router.get('/delete/all-events', function(req, res, next) {
	var pageData = {};
	Job.remove({}, function (err, job) {
	    res.redirect('/admin');
	});

});

module.exports = router;
