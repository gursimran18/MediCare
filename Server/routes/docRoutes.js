const express = require('express');
var alert=require('alert');
const router = express.Router();
const Schedule = require("../models/scheduleModel");
const lockedSchedule = require("../models/bookedModel");

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

router.get('/viewAppointments',async(req,res) => {
    const doc_id=req.user.id;
    lockedSchedule.aggregate([
        {
            "$match":{
                "doctor_id": doc_id
            }
        },
        {
            "$lookup":{
                "let": { "patientObjId": { "$toObjectId": "$patient_id" } },
          "from":"patients",
          "pipeline":[
            {"$match":{"$expr":{"$eq":[ "$_id","$$patientObjId"]}}},
            {"$project":{"firstname":1,"lastname":1, "email":1, "gender":1,"age":1}}
          ],
          "as":"PatientData"
        }},
        {
            "$lookup":{
                "let": { "schedObjId": { "$toObjectId": "$schedule_id" } },
          "from":"schedules",
          "pipeline":[
            {"$match":{"$expr":{"$eq":[ "$_id","$$schedObjId"]}}},
            {"$project":{"date":1,"start_time":1, "end_time":1, "mode":1}}
          ],
          "as":"ScheduleData"
        }}
    ]).exec((err,result) => {
        if(err){
            res.send(err)
        }
        if(result.size>0){
            res.render('doctors/viewAppointments',{
                appointments: result
             }) 
        }
        else{
            alert("Currently, you dont have any appointments.")
            res.redirect('/D_dashboard')
        }
    })
})

router.get('/cancelAppointment/:_id',async(req,res)=>{
    lockedSchedule.findByIdAndDelete(req.params._id.toString(),function(err,docs){
        if(err){
            res.send(err)
        }
        else{
            res.redirect('/D_dashboard/viewAppointments')
        }
    })
})

router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg','You are logged out')
    res.redirect('/Dlogin');
})

module.exports= router;