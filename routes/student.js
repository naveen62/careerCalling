var express = require("express");
var router = express.Router();
var Student = require("../models/student");
var Company = require("../models/company")
var passport = require("passport");
var LocalStrategy = require("passport-local");


// auth 
router.get('/signup',isLoggedout, function(req, res) {
    res.render('student/signup')
})
router.post('/signup',isLoggedout, function(req, res) {
    Student.findOne({username: req.body.username}, function(err, check) {
        if(check) {
            req.flash('error', 'Username already taken');
            res.redirect('back')
        } else {
            var newStudent = new Student({
                name: req.body.name,
                gender: req.body.gender,
                age: req.body.age,
                qualification: req.body.qualification,
                Bdate: req.body.Bdate,
                passout: req.body.passout,
                marks: req.body.marks,
                number: req.body.number,
                email: req.body.email,
                address: req.body.address,
                desc: req.body.desc,
                pass: false,
                username: req.body.username
                
            });
           newStudent.password = newStudent.hashPassword(req.body.password);
           
           newStudent.save(function(err, user) {
               if(err) return err
               res.redirect('/student/signin')
           })     
        }
    })
})
router.get('/signin',isLoggedout, function(req, res) {
    res.render('student/signin');
})
router.post('/signin',isLoggedout, passport.authenticate('student-login', {
    successRedirect: '/student',
    failureRedirect: '/student/signin',
    failureFlash: true
}), function(req, res) {
    
})
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/student/signin')
})

// home page
router.get('/',isLoggedin,checkStudent, function(req, res) {
    res.render('student/home')
})
// job page render
router.get('/jobs',isLoggedin,checkStudent, function(req, res) {
    Company.find({}, function(err, companys) {
        if(err) return console.log(err);
        res.render('student/jobs', {companys: companys})
    })
})
// online test render
router.get('/test',isLoggedin,checkStudent, function(req, res) {
    res.render('student/test')
})
//online test logic
router.post('/test', function(req, res) {
    console.log(req.body);
    if(req.body.total >= 60) {
        Student.update({_id: req.body.userid}, {$set: {pass: true}}, function(err, result) {
            if(err) {
                console.log(err)
            } else {
                console.log('working')
            }
        })
    }
})
router.get('/apply/:id',isLoggedin,checkStudent, function(req, res) {
    Company.findById(req.params.id, function(err, company) {
        if(err) {
            console.log(err)
        } else {
            Student.findById(req.user._id, function(err, student) {
                if(err) {
                    console.log(err)
                } else {
                    company.applied.push(student)
                    company.save(function(err, result) {
                        if(err) return err
                        req.flash('success', 'Job applied! email will be sent once company accepted')
                        res.redirect('/student/jobs')
                    })
                }
            })
        }
    })
})
router.get('/status',isLoggedin,checkStudent, function(req, res) {
    Student.findById(req.user._id).populate('accepted').populate('rejected').exec(function(err, students) {
        if(err) return
        res.render('student/statues', {students: students, count: 0})
    })
})
// student marks update render
router.get('/upmarks',isLoggedin,checkStudent, function(req, res) {
    res.render('student/marks')
})
// student marks update logic/post
router.post('/upmarks',isLoggedin,checkStudent, function(req, res) {
    Student.update({_id: req.user._id}, {$set:{marks: req.body.upmarks}}, function(err, result) {
        if(err) return err;
        req.flash('success', 'Marks updated')
        res.redirect('/student')
    })
})

// export
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
function checkStudent(req, res, next) {
    if(req.user.type == 1) {
        return next();
    }
    req.flash('success', 'login as student to proceed');
    res.redirect('/company')
}