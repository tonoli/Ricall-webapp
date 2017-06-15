var mongoose = require('mongoose');

// Event Schema
var TodoSchema = mongoose.Schema({
  item : String
});

// Event Modules
var Todo = module.exports = mongoose.model('Todo', TodoSchema);


module.exports.createEvent = function(newEvent, callback){
	        newEvent.save(callback);
}

module.exports.getEventByEventname = function(eventname, callback){
	var query = {eventname: eventname};
	Event.findOne(query, callback);
}

module.exports.getEventById = function(id, callback){
	Event.findById(id, callback);
}
