const express = require('express');
const router = express.Router();
const Schedule = require("../models/scheduleModel");

router.get('',(req,res) =>{
    res.render('doctors/dashboardDoctor',{
        name: req.user.firstname,
        //speciality: req.user.speciality
    });
})

router.get('/profile',(req,res) =>{
    res.render('doctors/D_profile',{
        firstname: req.user.firstname,
                lastname: req.user.lastname,
                gender: req.user.gender,
                age: req.user.age,
                email: req.user.email,
                phone: req.user.phone,
                pincode: req.user.pincode,
                degree: req.user.degree,
                speciality: req.user.speciality
    });
})

router.get('/backto_dash',(req,res) =>{
    res.redirect('/D_dashboard');
})

router.get('/scheduleAppointment',(req,res) =>{
    res.render('doctors/scheduleAppointment',{
        name:req.user.firstname
    });
})

router.post('/scheduleAppointment',async(req,res) => {
    const id=req.user.id;
    const email=req.user.email;
    const{date, start_time, end_time, average_time} = req.body;

    var d = new Date();
    var curr_date=d.getDate();
    var curr_month=d.getMonth();
    var curr_year=d.getFullYear();
    let errors=[];

    if(start_time>=end_time){
        console.log('invalid time');
    errors.push({msg: 'Please enter valid start and end time'})
    }

    if(errors.length > 0) {
        res.render('doctors/scheduleAppointment', {errors, date, start_time, end_time, average_time
        });
    }else{
        const schedule = new Schedule({
            doctor_id: id,
            email: email,
            date: date.toString(),
            start_time: start_time.toString(),
            end_time: end_time.toString(),
            average_time: average_time
        });
        schedule
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Your schedule has been updated'
                );
                res.redirect('/D_dashboard/scheduleAppointment');
              })
              .catch(err => console.log(err));
    }
})

router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg','You are logged out')
    res.redirect('/Dlogin');
})

module.exports= router;