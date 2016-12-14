var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
    Sugar = require('sugar'),
	_ = require('underscore');

var	Event = mongoose.model('events'),
	Job = mongoose.model('jobs'),
	User = mongoose.model('users');



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

  	// Then get this weeks event data from db
  	.then(function(jobs){

		Event.find(function(err, events){
			pageData.events = events;	    
	  	}).
			where('eventDate').gt(Sugar.Date.create('this Monday')).
			sort('-eventDate').
			exec()

	 })

	// Then get user data from db
  	.then(function(events){

		User.find(function(err, users){

			pageData.users = users;

			// For each user in users
			_.each(users, function(user, key) {

				// Find the job events for that user
				var userEvents = _.where(pageData.events, {userId: user.userId, eventType : "job"});

				// Sum the points from those events
				var userPoints = _.reduce(userEvents, function(num, event){

					// Find the points associated with that job
					var jobPoints = _.find(pageData.jobs, {jobId: parseInt(event.eventId)}).jobPoints

					// Sum the points for that user
					return jobPoints + num;

				}, 0);

				// Add total points to each user in page data
				_.findWhere(pageData.users, {userId: parseInt(user.userId)}).userPoints = userPoints;

			});

	    	res.render('user', pageData);

	  	})

  	})

});


/* GET add job page. */
router.get('/user-:userId/job-:jobId', function(req, res, next) {

  	var pageData = {};

	// Get user data from db
	User.find(function(err, users){

		var userId = parseInt(req.params.userId);
		var user = _.find(users, {userId: userId});

		pageData.user = user;
	    
  	}).exec()

	// Get job data from db
	Job.find(function(err, jobs){
  		var jobId = parseInt(req.params.jobId);
		var job = _.find(jobs, {jobId: jobId})
		pageData.job = job;

		// Render page
		res.render('job-add', pageData);
	    
  	});

});


/* POST add job. */
router.post('/add-job', function(req, res) {

    // Create new job event and save to db
    new Event({
    	eventType : "job",
    	userId : req.body.userId,
    	eventId : req.body.jobId,
    	eventDate : req.body.jobDate  
    })
    .save(function(err, job) {
        res.redirect('/user-' + job.userId);
    });

});


/* GET admin page. */
router.get('/admin', function(req, res, next) {

  	var pageData = {};

	// Get job data from db
	Job.find(function(err, jobs){
		pageData.jobs = jobs;	    
  	}).exec()

  	// Then get event data from db
  	.then(function(jobs){

		Event.find(function(err, events){
			pageData.events = events;	    
	  	}).exec()

	 })

	// Then get user data from db
  	.then(function(events){

		User.find(function(err, users){
			pageData.users = users;
	    	res.render('admin', pageData);
	  	})

  	})

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

	// Load default data
	var	defaultData = require('../data/defaults.json');

	// Delete users from db
	User.remove({}).exec()

	// Create users from data.json
	.then(function(user){
		User.create(defaultData.users, function (err) {
		    if (err) return res.send(500, { error: err });
		});
	});

	// Delete jobs from db
	Job.remove({}).exec()

	// Create jobs from data.json
	.then(function(job){
		Job.create(defaultData.jobs, function (err) {
		    if (err) return res.send(500, { error: err });
	    	res.redirect('/');
		});
	});

});




module.exports = router;
