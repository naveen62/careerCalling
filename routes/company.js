var express = require("express")
var router = express.Router();
var mongoose = require("mongoose");
var Student = require("../models/student");
var Company = require("../models/company");
var passport = require("passport");
var Local = require("passport-local");
var nodemailer = require("nodemailer")

// nodemailer config



// auth 
router.get('/signup',isLoggedout, function(req, res) {
    res.render('company/signup')
})

router.post('/signup',isLoggedout, function(req, res) {
    Company.findOne({username: req.body.username}, function(err, check) {
        if(check) {
            req.flash('error', 'Username already taken')
            res.redirect('/company/signup')
        } else {
            var newCompany = new Company({
                name: req.body.name,
                work: req.body.type,
                number: req.body.number,
                address: req.body.address,
                desc: req.body.desc,
                email: req.body.email,
                username: req.body.username,
            })
            newCompany.password = newCompany.hashPassword(req.body.password)
           newCompany.save(function(err, company) {
               if(err) {
                   return err
               }
               res.redirect('/company/signin')
           })   
        }
    })
})
router.get('/signin',isLoggedout, function(req, res) {
    res.render('company/signin')
})
router.post('/signin',isLoggedout, passport.authenticate('company-login', {
    successRedirect: '/company',
    failureRedirect: '/company/signin',
    failureFlash: true
}), function(req, res) {
    
})
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/company/signin')
})

// home page render
router.get('/',isLoggedin,checkCompany, function(req, res) {
    res.render('company/home')
})
// job rquest render
router.get('/request',isLoggedin,checkCompany, function(req, res) {
    Company.findById(req.user._id).populate('applied').exec(function(err, user) {
        if(err) return err
        res.render('company/reqStud', {company: user})
    })
})
// job request accept logic
router.get('/accept/:id',isLoggedin,checkCompany, function(req, res) {
    Company.findById(req.user._id, function(err, company) {
        if(err) {
            console.log(err)
        }else {
            Student.findById(req.params.id, function(err, student) {
                if(err) return err
                student.accepted.push(company);
                student.save(function(err) {
                    if(err) return err
                })
                for(var i=0; i<company.applied.length; i++) {
                    if(company.applied[i] == req.params.id) {
                        company.applied.splice(i, 1)
                    }
                }
                company.save(function(err, result) {
                    if(err) return err;
                    req.flash('success', 'Student accepted a email will be sent to student')
                    res.redirect('/company/request')
                })
                var transporter = nodemailer.createTransport({
                        service : "Gmail",
                        auth: {
                        user: 'navattesting@gmail.com',
                        pass: 'nyg201yy'
                                }
                        })
                var mailOptions = {
                    to: student.email,
                    from: 'navattesting@gmail.com',
                    subject: 'Company accepted',
                    text: 'Congratulations you have been selected for '+company.name,
                    html: "<h3>Congratulations you have been selected for "+company.name+" Click <a href=http://'"+req.headers.host+"/student/signin'> here </a>to login</h3>"
                }
                transporter.sendMail(mailOptions, function(err) {
                    if(err) {
                        console.log(err)
                    }
                })
            })
        }
    })
})
// job request reject logic
router.get('/reject/:id',isLoggedin,checkCompany, function(req, res) {
    Company.findById(req.user._id, function(err, company) {
        if(err) {
            console.log(err)
        }else {
            Student.findById(req.params.id, function(err, student) {
                if(err) return err
                student.rejected.push(company);
                student.save(function(err) {
                    if(err) return err
                })
                for(var i=0; i<company.applied.length; i++) {
                    if(company.applied[i] == req.params.id) {
                        company.applied.splice(i, 1)
                    }
                }
                company.save(function(err, result) {
                    if(err) return err;
                    req.flash('success', 'Student rejected')
                    res.redirect('/company/request')
                })
            })
        }
    })
})


module.exports = router;

function isLoggedin(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please first login as company/student')
    res.redirect('/student/signin')
}
function isLoggedout(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    if(req.user.type == 1) {
        req.flash('success', 'Logout to proceed')
        res.redirect('/student')
    } else if(req.user.type == 2) {
        req.flash('success', 'Logout to proceed');
        res.redirect('/company')
    }
}
function checkCompany(req, res, next) {
    if(req.user.type == 2) {
        return next();
    }
    req.flash('success', 'login as company to proceed');
    res.redirect('/student')
}