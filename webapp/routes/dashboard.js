var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Rivent = require('../models/rivent');
var User = require('../models/user');
var calendar = require('../routes/calendar');
var gcal = require('google-calendar');
var moment = require('moment');

// Connect to the DB
mongoose.connect('mongodb://ricallme:ricall@ds123182.mlab.com:23182/ricallmedb');

// bodyParser Middleware
var urlencodedparse = (bodyParser.urlencoded({ extended: false }));

// Get Dashboard
router.get('/', ensureAuthenticated, function(req, res){

//Storing user email in session

	User.getUserById(req.session.passport.user, function(err, data){
		if (err) throw err;
		req.session.email = data.google.email;
		req.session.token = data.google.token;
	});

	if(req.session.token){

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
			});
	}
	Rivent.find({user_id : req.session.email}, function(err,data){
		if (err) throw err;
		res.render('dashboard', {rivent : data} );
	});
});

router.post('/', ensureAuthenticated, urlencodedparse,  function (req, res){

	//Verify Acess to Google calendar
	if(!req.session.token) return res.redirect('/dashboard/auth');

	var accessToken = req.session.token;
	var calendarId  = req.session.email;

	var gcalrivent = {
		'summary': req.body.title,
		'description': req.body.category_id,
		'location' : '6600 Dumberton Cir., Fremont, CA 94555',
		'start' : {
			'dateTime': moment(req.body.date + ' ' + req.body.time, "MM-DD-YYYY HH:mm A").format("YYYY-MM-DDTHH:mm:ssZ"),
			'timeZone': 'America/Los_Angeles',
		},
		'end': {
			'dateTime': moment(req.body.date + ' ' + req.body.time, "MM-DD-YYYY HH:mm A").add(30, 'minutes').format("YYYY-MM-DDTHH:mm:ssZ"),
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
			'category_id': rivent.description,
			'urgency': "0",
			'reminded': false,
			'confirmation': rivent.status,
			'active' : true
		};
		Rivent.create(newRivent, function (err, data){
			if (err) throw res.status(500).send('DB ERROR');
			console.log(data);
		});
	};
});


router.delete('/:event_id', ensureAuthenticated, function (req, res){

	if(!req.session.access_token) return res.redirect('/dashboard/auth');

	var accessToken     = req.session.token;
	var calendarId      = req.session.email;
	var eventId         = req.params.event_id;

	function deleteFromDB(){
		Rivent.find({event_id: eventId}).remove(function (err, data){
			if (err) throw err;
			console.log(data);
		});
	};
	gcal(accessToken).events.delete(calendarId, eventId, function(err, data) {
		if(err) return res.send(500,err);
		deleteFromDB();
		res.redirect('/dashboard');
	});
});

router.get('/auth', ensureAuthenticated, function(req, res){
	res.render('googleauth');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

//Calendar
router.use('/calendar', calendar);


module.exports = router;
