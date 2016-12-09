var mongoose = require('mongoose'); 

var JobSchema = new mongoose.Schema({
    jobId : Number,
    userId : Number,
    dob: { type: Date, default: Date.now }
});

mongoose.model('jobs', JobSchema);