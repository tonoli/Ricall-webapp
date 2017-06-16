var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var gcal = require('google-calendar');
var Rivent = require('../models/rivent');
var User = require('../models/user');
var passport = require('passport');

// Connect to the DB
mongoose.connect('mongodb://ricallme:ricall@ds123182.mlab.com:23182/ricallmedb');

// bodyParser Middleware
var urlencodedparse = (bodyParser.urlencoded({ extended: false }));

router.get('/', function(req, res){

  if(!req.session.token) return res.redirect('/dashboard/auth');

  var accessToken = req.session.token;
  var calendarId  = req.session.email;

  gcal(accessToken).events.list(calendarId, {maxResults:20}, function(err, data) {
    if(err) return res.send(500,err);

    console.log(data)
    if(data.nextPageToken){
 	 gcal(accessToken).events.list(calendarId, {maxResults:20, pageToken:data.nextPageToken}, function(err, data) {
 	   console.log(data.items)
 	 })
    }

	return res.send(data);
	});
});

router.all('/add', function(req, res){

  if(!req.session.access_token) return res.redirect('/dashboard/auth');

  var accessToken     = req.session.access_token;
  var calendarId      = req.params.calendarId;
  var text            = req.query.text || 'Hello World';

  gcal(accessToken).events.quickAdd(calendarId, text, function(err, data) {
    if(err) return res.send(500,err);
    return res.redirect('/dashboard/calendar');
  });
});

router.all('/:eventId/remove', function(req, res){

  if(!req.session.access_token) return res.redirect('/dashboard/auth');

  var accessToken     = req.session.token;
  var calendarId      = req.session.email;
  var eventId         = req.params.eventId;

  gcal(accessToken).events.delete(calendarId, eventId, function(err, data) {
    if(err) return res.send(500,err);
    return res.redirect('/dashboard/calendar');
  });
});


router.get('/:eventId', function(req, res){

  if(!req.session.access_token) return res.redirect('/dashboard/auth');

  var accessToken     = req.session.token;
  var calendarId      = req.session.email;
  var eventId         = req.params.eventId;

  gcal(accessToken).events.get(calendarId, eventId, function(err, data) {
    if(err) return res.send(500,err);
    return res.send(data);
  });
});

//Verify that the user has allowed Google calendar
function ensureAuthCalendar(req, res, next){
 	if(req.isAuthenticated()){
 		if(req.session.token){
 			return next();
 		}
 	} else {
 		//req.flash('error_msg','You are not logged in');
 		res.redirect('/auth');
 	}
}


module.exports = router;
