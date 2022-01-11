const express = require('express');
var alert=require('alert');
const router = express.Router();
const Schedule = require("../models/scheduleModel");
const lockedSchedule = require("../models/bookedModel");
const Patient = require("../models/patientModel");
const nodemailer= require('nodemailer');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
//const server= require("../../server")
const {
    v4: uuidV4
  } = require('uuid');
  const {
    validate: uuidValidate
  } = require('uuid');
  
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    //service: "gmail",
    auth: {
        user: 'goyal2000yashashvi@gmail.com', // generated ethereal user
        pass: 'dmbrsnjgippcklvx'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

router.get('',ensureAuthenticated,(req,res) =>{
    res.render('doctors/dashboardDoctor',{
        name: req.user.firstname,
        title: "Dashboard | "
    });
})

router.get('/profile',ensureAuthenticated,(req,res) =>{
    res.render('doctors/D_profile',{
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        gender: req.user.gender,
        age: req.user.age,
        email: req.user.email,
        phone: req.user.phone,
        pincode: req.user.pincode,
        degree: req.user.degree,
        speciality: req.user.speciality,
        title: "Profile | "
    });
})

router.get('/backto_dash',ensureAuthenticated,(req,res) =>{
    res.redirect('/D_dashboard');
})

router.get('/scheduleAppointment',ensureAuthenticated,(req,res) =>{
    res.render('doctors/scheduleAppointment',{
        name:req.user.firstname,
        title: "Add Schedule | "
    });
})

router.get('/viewAppointments',ensureAuthenticated,async(req,res) => {
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
        else{
            res.render('doctors/viewAppointments',{
                appointments: result,
                title: "Appointments | "
             }) 
        }
    })
})


router.get('/cancelAppointment/:_id',ensureAuthenticated,async(req,res)=>{
    lockedSchedule.findByIdAndDelete(req.params._id.toString(),function(err,doc1){
        if(err){
            res.send(err)
        }
        else{
            var p_id=doc1.patient_id;
            patients.findById(p_id,function(err,doc2){
                if(err){
                    res.send(err);
                }
                else{
                    Schedule.findById(doc1.schedule_id,function(err,doc3){
                        if(err){
                            res.send(err)
                        }
                    var doc_name=req.user.firstname+" "+req.user.lastname;
                    const output = `
                    <h1>Appointment Cancelled</h1>
                    <h3>Details</h3>
                    <p>Your appointment with Dr. ${doc_name} on ${doc3.date} has been cancelled.</p>`;
                
                  // setup email data with unicode symbols
                  let mailOptions = {
                     // from: '"Nodemailer Contact" <your@email.com>', // sender address
                      to: doc2.email, // list of receivers
                      subject: 'Appointment Cancellation', // Subject line
                      html: output // html body
                  };
                
                  // send mail with defined transport object
                  transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                          return console.log(error);
                      }
                      console.log('Message sent: %s', info.messageId);   
                      //res.render('contact', {msg:'Email has been sent'});
                  });
                    })
                }
            })
            res.redirect('/D_dashboard/viewAppointments')
        }
    })
})

router.get('/deleteAppointment/:_id',ensureAuthenticated,async(req,res)=>{
    lockedSchedule.findByIdAndDelete(req.params._id.toString(),function(err,docs){
        if(err){
            res.send(err)
        }
        else{
            res.redirect('/D_dashboard/viewAppointments')
        }
    })
})

router.get('/startCall/:s_id',ensureAuthenticated,(req,res)=>{
    res.redirect(`/D_dashboard/startCall/${req.params.s_id}/${uuidV4()}`)
})

router.get('/startCall/:s_id/:m_id',ensureAuthenticated,(req,res)=>{
    if(uuidValidate(req.params.m_id)){
        res.render('doctors/startCall',{
            name:req.user.firstname,
            lastname: req.user.lastname,
            meetId:req.params.m_id,
            s_id:req.params.s_id,
            title: "Start Call | "
        });
    }else{
        res.redirect(`D_dashboard/startcall/${req.params.s_id}/${uuidV4()}`)
    }
})

router.get('/hangup',ensureAuthenticated,(req,res)=>{
    if(req.user.userType=="1"){
        res.redirect('D_dashboard/viewAppointments')
    }else{
        res.redirect('P_dashboard/p_viewAppointments')
    }
  })

router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg','You are logged out')
    res.redirect('/Dlogin');
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

router.post('/startCall/:s_id/:m_id',(req,res)=>{
    let meetId = req.params.m_id;
    let s_id = req.params.s_id;
    lockedSchedule.findById(s_id.toString(),function(err,sched){
        if(err){
            res.send(err)
        }else{
            Patient.findById(sched.patient_id,function(err,patient){
                if(err){
                    res.send(err)
                }else{
                    var doc_name=req.user.firstname+" "+req.user.lastname;
                    const output = `
                    <h1>Video Consultation Started</h1>
                    <h3>Details</h3>
                    <p>Doctor: ${doc_name}<br>
                    Symptoms: ${sched.patient_symptoms}<br>
                    Call ID: ${meetId}</p>`;
                
                  // setup email data with unicode symbols
                  let mailOptions = {
                     // from: '"Nodemailer Contact" <your@email.com>', // sender address
                      to: patient.email, // list of receivers
                      subject: 'Video Consultation', // Subject line
                      html: output // html body
                  };
                
                  // send mail with defined transport object
                  transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                          return console.log(error);
                      }
                  });
                  if (uuidValidate(meetId)) { //validates if used a proper uuidV4
                    let userName = req.body.name;
                    let video = req.body.video;
                    let audio = req.body.audio;
                    if (video == 'on') {
                      video = true;
                    } else {
                      video = false;
                    }
                    if (audio == 'on') {
                      audio = true;
                    } else {
                      audio = false;
                    }
                    if (!userName) {
                      userName = 'Host'
                    }
                    res.render('call', {
                      name: req.user.firstname,
                      roomId: meetId,
                      title: '',
                      chats: [],
                      userName: userName,
                      video: video,
                      audio: audio,
                      title: "Call | ",
                      userType: req.user.userType
                    })
                  } else {
                    res.redirect(`/D_dashboard/startCall/${s_id}`)
                  }
                }
            })
        }
    })
})

module.exports= router;