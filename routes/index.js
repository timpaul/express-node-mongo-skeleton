var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	_ = require('underscore');

var	Event = mongoose.model('events'),
	Job = mongoose.model('jobs'),
	User = mongoose.model('users');

// Load data

var	data = require('../data/data.json');


/* GET home page. */
router.get('/', function(req, res, next) {


	var pageData = data;

	console.log(pageData);

	res.render('index', pageData);
	/*
	User.find(function(err, users){
		console.log(users);
	    res.render('index', users);

  	});
	*/

});


/* GET user job list page. */

router.get('/user-:userId/job-list', function(req, res, next) {

	var pageData = {};

	// Add user data
  	var userId = parseInt(req.params.userId);
	var user = _.where(data.users, {userId: userId});
	pageData.user = user[0];

	// Add jobs data
	pageData.jobs = data.jobs;

  	res.render('job-list', pageData);
});


/* GET user page. */

router.get('/user-:userId', function(req, res, next) {

	var pageData = require('../data/data.json');

	console.log(pageData);

	pageData.currentUserId = parseInt(req.params.userId);

	// Get event history from database
	Event.find(function(err, events){

		// Add event history to page data
    	pageData.history = _.sortBy(events, 'jobDate').reverse();

    	// Create a job history grouped by user
		var jobsByUser = _(events).groupBy('userId');

		// For each user in the job history
		_.each(jobsByUser, function(user, key) {

			// For each job event in their history
			var userPoints = _.reduce(user, function(num, event){

				// Find the points associated with that job
				var jobPoints = _.find(pageData.jobs, {id: parseInt(event.jobId)}).points

				// Sum the points for that user
				return jobPoints + num;

			}, 0);

			// Add total points to each user in page data
			_.findWhere(pageData.users, {userId: parseInt(key)}).userPoints = userPoints;

		});

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
	var user = _.where(data.users, {userId: userId});
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
    new Event({
    	userId : req.body.userId,
    	jobId : req.body.jobId,
    	jobTitle : req.body.jobTitle,
    	jobDate : req.body.jobDate  
    })
    .save(function(err, job) {
        res.redirect('/user-' + job.userId);
    });

});


/* GET admin page. */
router.get('/admin', function(req, res, next) {

	var pageData = data;

    // Get job history from database
	Event.find(function(err, events){

		// Add job history to page data
    	pageData.history = _.sortBy(events, 'jobDate').reverse();

	    res.render('admin', pageData);

  	});

});


/* Delete an event */
router.get('/delete/event-:eventId', function(req, res, next) {

	Event.findByIdAndRemove(req.params.eventId, function (err, job) {
	    res.redirect('/admin');
	});

});


/* Delete all events */
router.get('/delete/all', function(req, res, next) {

	// Remove all events
	Event.remove({}, function (err, job) {
	    res.redirect('/admin');
	});

});


/* Load defaults */
router.get('/load-defaults', function(req, res, next) {

	var users = data.users;

	User.create(users, function (err, userx) {
	    if (err) return res.send(500, { error: err });
	    return res.send("succesfully saved");
	});

});




module.exports = router;
