var passport = require("passport");
var Company = require("../models/company");
var Student = require("../models/student")
var Local = require("passport-local");


passport.use('company-login', new Local({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, 
    function(req, username, password, done) {
        Company.findOne({username: username}, function(err, user) {
            if(err) return done(err)
            
            if(!user) {
                return done(null, false, {message: 'No user found'})
            }
            if(!user.checkPassword(password)) {
                return done(null, false, {message: 'password did not match'})
            }
            return done(null, user)
        })
    }
))
passport.use('student-login', new Local({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, 
    function(req, username, password, done) {
        Student.findOne({username: username}, function(err, user) {
            if(err) return done(err)
            
            if(!user) {
                return done(null, false, {message: 'No user found'})
            }
            if(!user.checkPassword(password)) {
                return done(null, false, {message: 'password did not match'})
            }
            return done(null, user)
        })
    }
))

passport.serializeUser(function(user, done) {
    var key;
    if(user.type === 1) {
        key = {
            id: user.id,
            type: 1
        }
    } else {
        key = {
            id: user.id,
            type: 2
        }
    }
    done(null, key)
})
passport.deserializeUser(function(key, done) {
    if(key.type === 1) {
        Student.findById(key.id, function(err, user) {
            done(err, user)
        })
    } else if(key.type === 2) {
        Company.findById(key.id, function(err, user) {
            done(err, user)
        })
    }
})


// function dcompany() {
//     passport.deserializeUser(function(id, done) {
//         Company.findById(id, function(err, user) {
//             done(err, user)
//         }) 
//     })
// }

// passport.serializeUser(function(user, done) {
//     done(null, user.id)
// })
// passport.deserializeUser(function(id, done) {
//         Student.findById(id, function(err, user) {
//             if(err) {
//                 console.log(err)
//                 Company.findById(id, function(err, user) {
//                     if(err) {
//                         console.log(err);
//                     } else {
//                         return done(err, user);
//                     }
                    
//                 })
//             } else {
//                 return done(err, user)
//             }
//         }) 
//     })
