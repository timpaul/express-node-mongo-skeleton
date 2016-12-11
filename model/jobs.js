var mongoose = require('mongoose');

var JobSchema = new mongoose.Schema({
    jobId : Number,
    jobTitle : String,
    jobPoints : Number,
    userId : Number,
    userName : String,
  	jobDate: Date
});

mongoose.model('jobs', JobSchema);