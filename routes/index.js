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

	var pageData = {};

	// Get user data from db
	User.find(function(err, users){

		pageData.users = users;

		// Render page
	    res.render('index', pageData);

  	});

});




/* GET user job list page. */

router.get('/user-:userId/job-list', function(req, res, next) {

	var pageData = {};


	// Get user data from db
	User.find(function(err, users){

		var userId = parseInt(req.params.userId);
		var user = _.find(users, {userId: userId});

		pageData.user = user;
	    
  	}).exec()

	// Get job data from db
	Job.find(function(err, jobs){

		pageData.jobs = jobs;

		// Render page
		res.render('job-list', pageData);
	    
  	});

});


/* GET user page. */

router.get('/user-:userId', function(req, res, next) {

	var pageData = {};

	pageData.currentUserId = parseInt(req.params.userId);

	// Get job data from db
	Job.find(function(err, jobs){

		pageData.jobs = jobs;
	    
  	}).exec()

	// Get user data from db
  	.then(function(user){

		User.find(function(err, users){

			pageData.users = users;
		    
	  	})

  	})

	// Get event history from database

  	.then(function(){

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
					var jobPoints = _.find(pageData.jobs, {jobId: parseInt(event.jobId)}).jobPoints

					// Sum the points for that user
					return jobPoints + num;

				}, 0);

				// Add total points to each user in page data
				_.findWhere(pageData.users, {userId: parseInt(key)}).userPoints = userPoints;

			});

		    res.render('user', pageData);

	  	});

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
	var job = _.where(data.jobs, {jobId: jobId});
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

	Event.findByIdAndRemove(req.params.eventId, function (err) {
	    res.redirect('/admin');
	});

});


/* Delete all events */
router.get('/delete/all', function(req, res, next) {

	// Remove all events
	Event.remove({}, function (err) {
		if (err) return res.send(500, { error: err });
	    res.redirect('/admin');
	});

});


/* Load defaults */
router.get('/load-defaults', function(req, res, next) {

	// Delete users from db
	User.remove({}).exec()

	// Create users from data.json
	.then(function(user){
		User.create(data.users, function (err) {
		    if (err) return res.send(500, { error: err });
		});
	});

	// Delete jobs from db
	Job.remove({}).exec()

	// Create jobs from data.json
	.then(function(job){
		Job.create(data.jobs, function (err) {
		    if (err) return res.send(500, { error: err });
	    	res.redirect('/');
		});
	});

});




module.exports = router;
