var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	local: {
			username: {
				type: String,
				index:true
			},
			password: String,
			email: String,
		},
	google: {
		id : String,
		username : {
			type: String,
			index: true
		},
		token : String,
		email : String,
		name : String
	}

});

// User Modules
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.local.password, salt, function(err, hash) {
	        newUser.local.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByEmail = function(email, callback){

	var query = {
		$or:[ {'local.email': email}, {'google.email': email}]
	};
	User.findOne(query, callback);
}

module.exports.getUserByUsername = function(username, callback){
	var query = {'local.username': username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
