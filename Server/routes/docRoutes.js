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
    const{date, start_time, end_time, mode, average_time} = req.body;

    var d = new Date();
    var curr_date=parseInt(d.getDate().toString());
    var curr_month=parseInt(d.getMonth().toString())+1;
    var curr_year=parseInt(d.getFullYear().toString());
    let errors=[];

    var user_year=parseInt(date.toString().substring(0,4));
    var user_month=parseInt(date.toString().substring(5,7));
    var user_date=parseInt(date.toString().substring(8,10));

    

    var flag=0;
    if(user_year<curr_year){
        flag=1;
    }
    if(user_year==curr_year){
        if(user_month<curr_month){
            flag=1;
        }
        if(user_month==curr_month){
            if(user_date<curr_date){
                flag=1;
            }
        }
    }

    if(flag==1){
        console.log('invalid date');
        errors.push({msg: 'Please select a valid date'})
    }

    if(start_time>=end_time){
        //console.log('invalid time');
        errors.push({msg: 'Please enter valid start and end time'})
    }

    if(errors.length > 0) {
        res.render('doctors/scheduleAppointment', {errors, date, start_time, end_time, average_time,
            name:req.user.firstname
        });
    }else{
        const schedule = new Schedule({
            doctor_id: id,
            email: email,
            date: date.toString(),
            start_time: start_time.toString(),
            end_time: end_time.toString(),
            mode: mode,
            average_time: average_time,
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