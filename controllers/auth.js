// Include express 
var express = require('express');
var passport = require('../config/passportConfig');
var router = express.Router();

// Include the user model!
var User = require('../models/user');

// Render the page with the login form
router.get('/login', function(req, res) {
	res.render('auth/login');
});

// Perform the login functionality
router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	successFlash: 'Good work, you logged in!',
	failureRedirect: '/auth/login',
	failureFlash: 'Invalid credentials'
}));

// Render the page with the sign up form
router.get('/signup', function(req, res) {
	res.render('auth/signup');
});

// Perform the signup functionality
router.post('/signup', function(req, res, next) {
	console.log('info from form', req.body);
	

	//First, try to find their email (in case it already exists)
	User.findOne({email: req.body.email}, function(err, user) {
		if(err){
			console.log('bummer, what happened?', err);
			req.flash('error', 'Something went wrong! I dunno why. Check the logs!');
			res.redirect('/auth/signup');
		}
		else if(user) {
			// Don't want to let them sign up multiple times with same email
			req.flash('error', 'You already exist');
			res.redirect('/auth/login');
		}
		else {
			User.create(req.body, function(err, createdUser) {
				if(err) {
					req.flash('error', 'noooooo whyyyyyyy');
					return console.log('err', err);
				}
				console.log('yay, signed up, now let us log in!');
				passport.authenticate('local', {
					successRedirect: '/profile',
					successFlash: 'Successful account creation'
				})(req, res, next);
			});

		}
	
	});
});

// Logout route removes user data from session
// Then it redirects to the home page
router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'You are logged out. Bye-bye now');
	res.redirect('/');
});

// Allow other files to access the routes defined here
module.exports = router;




