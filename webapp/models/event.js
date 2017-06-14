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
