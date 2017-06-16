var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Rivent = require('../models/rivent');
var User = require('../models/user');
var calendar = require('../routes/calendar');
var gcal = require('google-calendar');

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
		console.log(req.session.token);
	});

  Rivent.find({}, function(err,data){
    if (err) throw err;
    res.render('dashboard', {rivent : data} );
  });
});

router.post('/', ensureAuthenticated, urlencodedparse,  function (req, res){

  var newRivent = Rivent(req.body).save(function(err, data){
    if (err) throw err;
	var title = data.title;
	var ricall_time = data.ricall_time;

    res.json(data);
  });
});


router.delete('/:event_id', ensureAuthenticated, function (req, res){
  Rivent.find({event_id: req.params.event_id}).remove(function (err, data){
    if (err) throw err;
    res.json(data);
    });
});

router.get('/auth', ensureAuthenticated, function(req, res){
	res.send('OH.. I DON\'T RICALL YOU GAVE US PERMISSION FOR GOOGLE CALENDAR');
})

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
