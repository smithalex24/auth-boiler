// Modules I need for running this app 
require('dotenv').config(); // Loads the .env
var bodyParser = require('body-parser');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/isLoggedIn');
var mongoose = require('mongoose');
var passport = require('./config/passportConfig');
var session = require('express-session');


//App Variable
var app = express();

// Connect to the database
mongoose.connect('mongodb://localhost/authboiler');

// Set and use statements
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(expressLayouts);
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Just a convenience, but makes life easier...

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.alerts = req.flash();
	next();
});

// Top-level Routes 
app.get('/', function(req, res){
	res.render('home');
});

app.get('/profile', isLoggedIn, function(req, res) {
	res.render('profile');
});

// Include any routes from controllers
app.use('/auth', require('./controllers/auth'));

// Listen

app.listen(process.env.PORT || 3000);