var mongoose = require('mongoose');

// Event Schema
var EventSchema = mongoose.Schema({
	eventname: {
		type: String,
		index:true
	},
	name: {
		type: String
	}
});

// Event Modules
var Event = module.exports = mongoose.model('Event', EventSchema);

module.exports.createEvent = function(newEvent, callback){
	        newEvent.save(callback);
	    });
	});
}

module.exports.getEventByEventname = function(eventname, callback){
	var query = {eventname: eventname};
	Event.findOne(query, callback);
}

module.exports.getEventById = function(id, callback){
	Event.findById(id, callback);
}
