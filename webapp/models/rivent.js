var mongoose = require('mongoose');

// Rivent Schema
var RiventSchema = mongoose.Schema({
  'user_id': String,
  'event_id': String,
  'ricall_time': String,
  'leave_time': String,
  'start_date': String,
  'end_date': String,
  'location': String,
  'current_address': String,
  'event_address': String,
  'title': String,
  'category': String,
  'category_id': String,
  'urgency': String,
  'reminded': Boolean,
  'confirmation': Boolean,
  'active' : Boolean
});

// Event Modules
var Rivent = module.exports = mongoose.model('Rivent', RiventSchema);


module.exports.createRivent = function(newRivent, callback){
	        newRivent.save(callback);
}

module.exports.getRiventByRiventname = function(eventname, callback){
	var query = {title: eventname};
	Rivent.findOne(query, callback);
}

module.exports.getRiventById = function(event_id, callback){
  var query = {event_id : event_id};
	Rivent.findOne(querry, callback);
}
