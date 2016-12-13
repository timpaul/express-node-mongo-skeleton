var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    jobId : Number,
    jobTitle : String,
    userId : Number,
  	jobDate: Date
});

var UserSchema = new mongoose.Schema({
    userId : Number,
    userName : String,
    userPoints : Number,
    userAdmin : Boolean
});

var JobSchema = new mongoose.Schema({
    jobId : Number,
    jobTitle : String,
    jobPoints : Number
});

mongoose.model('events', EventSchema);
mongoose.model('users', UserSchema);
mongoose.model('jobs', JobSchema);