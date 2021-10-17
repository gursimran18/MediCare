const express = require('express');
const router = express.Router();
const Schedule = require("../models/scheduleModel");
const Doctors = require('../models/doctorModel');
router.get('',(req,res) =>{
    res.render('patients/dashboardPatient',{
        name: req.user.firstname
    });
})

router.get('/backto_dash',(req,res) =>{
    //res.render('patients/dashboardPatients');
    res.redirect('/P_dashboard');
})


router.get('/profile',(req,res) =>{
    res.render('patients/P_profile',{

        firstname: req.user.firstname,
        lastname: req.user.lastname,
        gender: req.user.gender,
        age: req.user.age,
        email: req.user.email,
        phone: req.user.phone,
        pincode: req.user.pincode


    });
})



router.get('/book_appoint',(req,res) =>{
    Schedule.find({}, function(err, schedules) {
        res.render('patients/book_appoint', {
            scheduleList: schedules
        })
    })
})


router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg','You are logged out')
    res.redirect('/Plogin');
})

router.get('/getNearestDoctors',async (req,res)=>{
    const allDoctors = await Doctors.find();
    console.log(allDoctors);
    res.render('patients/ViewDoctor',{
        doctors : allDoctors
    });
})

module.exports= router;