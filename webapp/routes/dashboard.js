var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Rivent = require('../models/rivent');

// Connect to the DB
mongoose.connect('mongodb://ricallme:ricall@ds123182.mlab.com:23182/ricallmedb');

// bodyParser Middleware
var urlencodedparse = (bodyParser.urlencoded({ extended: false }));


// Get Dashboard
router.get('/', ensureAuthenticated, function(req, res){
  Rivent.find({}, function(err,data){
    if (err) throw err;
    res.render('dashboard', {rivent : data} );
  });
});

router.post('/', ensureAuthenticated, urlencodedparse,  function (req, res){
  var newRivent = Rivent(req.body).save(function(err, data){
    if (err) throw err;
    res.json(data);
  });
});


router.delete('/:event_id', ensureAuthenticated, function (req, res){
  Rivent.find({event_id: req.params.event_id}).remove(function (err, data){
    if (err) throw err;
    res.json(data);
    });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
