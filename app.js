var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var passportt = require("passport")
var mongoose = require("mongoose");
var flash = require("connect-flash");
var session = require("express-session");
var Student = require("./models/student");
var Company = require("./models/company");

// routes
var companyRoute = require("./routes/company");
var studentRoute = require("./routes/student")

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect('mongodb://naveen:nyg201yy@ds127506.mlab.com:27506/careercalling', {useMongoClient: true});
mongoose.Promise = global.Promise;
require('./config/passport')
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: 'career of students',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());


// 
app.use(flash());
app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user
    res.locals.flash = req.flash();
    next();
})
// index route
app.get('/', function(req, res) {
    res.render('index');
})
app.use('/company', companyRoute);
app.use('/student', studentRoute)

// server 
app.listen(process.env.PORT, process.env.IP, function() {
    console.log('server started');
})