var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var gcal = require('google-calendar');
var Rivent = require('../models/rivent');
var User = require('../models/user');
var passport = require('passport');
var moment = require('moment');

// Connect to the DB
mongoose.connect('mongodb://ricallme:ricall@ds123182.mlab.com:23182/ricallmedb');

// bodyParser Middleware
var urlencodedparse = (bodyParser.urlencoded({ extended: false }));

router.get('/', function(req, res){

	if(!req.session.token) return res.redirect('/dashboard/auth');

	var accessToken		= req.session.token;
	var calendarId		= req.session.email;
	var options	= {
		timeMin: moment().add(-7, 'day').format("YYYY-MM-DDTHH:mm:ssZ"),
		timeMax: moment().add(7, 'day').format("YYYY-MM-DDTHH:mm:ssZ")
	};

	gcal(accessToken).events.list(calendarId, options, function(err, data) {
		if(err) return (console.log(err));
		var rivent = data.items;
		var i = -1;
		while(++i < (rivent.length)){
			let j = i;
			Rivent.findOneAndUpdate({event_id : rivent[j].id}, {new : true}, function (err, event){
				if (err)
				{
					console.log("ERROR :) ", err);
				};
				if (event){
					console.log('Already in the DB', j);
				}
				else{
					let newRivent = {
						'user_id': rivent[j].creator.email,
						'event_id': rivent[j].id,
						'ricall_time': rivent[j].reminders,
						'leave_time': moment().set(rivent[j].start.dateTime).add(-30, 'minutes').format("YYYY-MM-DDTHH:mm:ssZ"),
						'start_date': rivent[j].start.dateTime,
						'end_date': rivent[j].end.dateTime,
						'location': rivent[j].location,
						'current_address': rivent[j].location,
						'event_address': rivent[j].location,
						'title': rivent[j].summary,
						'category': "Health",
						'category_id': "1",
						'urgency': "5",
						'reminded': false,
						'confirmation': rivent[j].status,
						'active' : true
					};
					Rivent.create(newRivent, function (err, data){
						if (err) throw err;
						console.log(data);
					});
				}
			})
		}
		res.redirect('/dashboard');
	});
});

router.all('/add', function(req, res){
	if(!req.session.token) return res.redirect('/dashboard/auth');

	var accessToken = req.session.token;
	var calendarId  = req.session.email;

	var gcalrivent = {
		'summary': 'This is just a test!',
		'location': '8 Rue du Delta, Paris, 75009',
		'start': {
			'dateTime': '2017-06-18T18:00:00-07:00',
			'timeZone': 'America/Los_Angeles',
		},
		'end': {
			'dateTime': '2017-06-18T20:00:00-07:00',
			'timeZone': 'America/Los_Angeles',
		},
		'reminders': {
			'useDefault': false,
			'overrides': [
				{'method': 'popup', 'minutes': 30},
			],
		},
	};

	gcal(accessToken).events.insert(calendarId, gcalrivent, function(err, data){
		if(err) return res.status(500).send('CALENDAR ERROR');
		createNewRivent(data);
		return res.redirect('/dashboard');
		});

	function createNewRivent(rivent){
		var newRivent = {
			'user_id': rivent.creator.email,
			'event_id': rivent.id,
			'ricall_time': rivent.reminders,
			'leave_time': moment().set(rivent.start.dateTime).add(-30, 'minutes').format("YYYY-MM-DDTHH:mm:ssZ"),
			'start_date': rivent.start.dateTime,
			'end_date': rivent.end.dateTime,
			'location': rivent.location,
			'current_address': rivent.location,
			'event_address': rivent.location,
			'title': rivent.summary,
			'category': "Health",
			'category_id': "1",
			'urgency': "5",
			'reminded': false,
			'confirmation': rivent.status,
			'active' : true
		};
		Rivent.create(newRivent, function (err, data){
			if (err) throw err;
			console.log(data);
		});
	};
});

router.all('/:eventId/remove', function(req, res){

  if(!req.session.access_token) return res.redirect('/dashboard/auth');

  var accessToken     = req.session.token;
  var calendarId      = req.session.email;
  var eventId         = req.params.eventId;

  gcal(accessToken).events.delete(calendarId, eventId, function(err, data) {
    if(err) return res.send(500,err);
    return res.redirect('/');
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
