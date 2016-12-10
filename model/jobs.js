var mongoose = require('mongoose');
var Sugar = require('sugar');

var JobSchema = new mongoose.Schema({
    jobId : Number,
    jobTitle : String,
    jobPoints : Number,
    userId : Number,
    userName : String,

    dob: { type: String, default: Sugar.Date.format(new Date(), "%a %e %b at %R") }
});

mongoose.model('jobs', JobSchema);