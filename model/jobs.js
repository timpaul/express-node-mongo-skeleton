var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    jobId : Number,
    jobTitle : String,
    jobPoints : Number,
    userId : Number,
  	jobDate: Date
});

var UserSchema = new mongoose.Schema({
    userId : Number,
    userName : String,
    userPoints : Number,
    userAdmin : Boolean
});

mongoose.model('events', EventSchema);
mongoose.model('users', UserSchema);