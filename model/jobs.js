var mongoose = require('mongoose');

var JobSchema = new mongoose.Schema({
    jobId : Number,
    jobTitle : String,
    jobPoints : Number,
    userId : Number,
    userName : String,
  	jobDate: { type: Date, default: Date.now }
});

mongoose.model('jobs', JobSchema);