var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var User = require('../models/user');
var configAuth = require('./auth.js');

/*
	===========================================================================
					Routes
	===========================================================================
*/


// Register
router.get('/register', function(req, res){
	var errors ;
	res.render('register', { errors:errors});
});

// Login page
router.get('/login', function(req, res){
	res.render('login');
});

router.post('/login',
passport.authenticate('local', {successRedirect:'/dashboard', failureRedirect:'/users/login',failureFlash: true}),
	function(req, res) {
		res.redirect('/dashboard');
 });

// Google
router.get('/google',
		passport.authenticate('google', {scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']}));

router.get('/google/callback',
		passport.authenticate('google', { successRedirect: '/dashboard', failureRedirect: '/login'})
	);

// Logout Process

router.get('/logout', function(req, res){
req.logout();

req.flash('success_msg', 'You are logged out');

res.redirect('/');
});

// Configuration of Passport authenticated session persistence

		passport.serializeUser(function(user, done) {
		  done(null, user.id);
		});

		passport.deserializeUser(function(id, done) {
		  User.getUserById(id, function(err, user) {
		    done(err, user);
		  });
		});

/*
	===========================================================================
						Setup LocalStrategy
	===========================================================================
*/

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}
   	User.comparePassword(password, user.local.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

	// Register User
	router.post('/register', function(req, res){
		var email = req.body.email;
		var username = req.body.username;
		var password = req.body.password;
		var password2 = req.body.password2;

		// Validation
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('username', 'Username is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


		var errors = req.validationErrors();

		if(errors){
			res.render('register',{
				errors:errors
			});
		} else {
			var newUser = new User();
				newUser.local.email = email;
				newUser.local.username = username;
				newUser.local.password = password;

			User.createUser(newUser, function(err, user){
				if(err) throw err;
				console.log(user);
			});

			req.flash('success_msg', 'You are registered and can now login');

			res.redirect('/users/login');
		}
	});

	/*
	  ===========================================================================
	            Setup GoogleStrategy
	  ===========================================================================
	*/
	passport.use(new GoogleStrategy({
	    clientID: configAuth.googleAuth.clientID,
	    clientSecret: configAuth.googleAuth.consumer_secret,
	    callbackURL: configAuth.googleAuth.callbackURL,
	  },
		function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		User.findOneAndUpdate({'google.id': profile.id}, {$set:{'google.token': accessToken}}, {new : true}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user){
						console.log(accessToken);
						return done(null, user);
					}

	    			else {
	    				var newUser = new User();
	    				newUser.google.id = profile.id;
	    				newUser.google.token = accessToken;
	    				newUser.google.name = profile.displayName;
	    				newUser.google.email = profile.emails[0].value;

	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})
	    				console.log(profile);
	    			}
	    		});
	    	});
	    }

	));

module.exports = router;
