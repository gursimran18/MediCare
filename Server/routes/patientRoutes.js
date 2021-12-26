const express = require('express');
var alert=require('alert');
const router = express.Router();
const Schedule = require("../models/scheduleModel");
const doctors = require("../models/doctorModel");
const lockedSchedule = require("../models/bookedModel");
router.get('',(req,res) =>{
    res.render('patients/dashboardPatient',{
        name: req.user.firstname
    });
})

router.get('/backto_dash',(req,res) =>{
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

 router.get('/book_appoint',(req,res, next)=>{
    Schedule.aggregate([
        {
            "$lookup":{
                "let": { "docObjId": { "$toObjectId": "$doctor_id" } },
          "from":"doctors",
          "pipeline":[
            {"$match":{"$expr":{"$eq":[ "$_id","$$docObjId"]}}},
            {"$project":{"firstname":1,"lastname":1, "degree":1, "speciality":1}}
          ],
          "as":"DoctorData"
        }}
    ]).exec((err,result) => {
        if(err){
            res.send(err)
        }
        if(result){
            res.render('patients/book_appoint',{
               scheduleList: result
            }) 
        }
    })
}) 

    router.get('/lock_appoint/:schedule_id',(req,res) =>{
        Schedule.findById(req.params.schedule_id.toString(),function(err,doc1){
            if (err){
                console.log(err);
            }
            else{
                doctors.findById(doc1.doctor_id,function(err,doc2){
                    if (err){
                        console.log(err);
                    }
                    else{
                    res.render('patients/lockAppoint',{
                        d_id:doc2._id.toString(),
                        d_fname:doc2.firstname,
                        d_lname:doc2.lastname,
                        p_fname: req.user.firstname,
                        p_lname: req.user.lastname,
                        p_gender: req.user.gender,
                        p_age: req.user.age,
                        p_email: req.user.email,
                        p_phone:req.user.phone,
                        s_id:doc1._id.toString(),
                        s_date:doc1.date,
                        s_stime:doc1.start_time,
                        s_etime:doc1.end_time,
                        s_mode:doc1.mode
                     });
                    }
                });
            }
        });
       
    })
    

    router.post('/lockAppoint',async(req,res) => {
       const p_id= req.user.id;
       const{symptom, height, weight, d_id,s_id} = req.body;
        lockedschedule = new lockedSchedule({
            patient_id: p_id,
            patient_symptoms: symptom,
            patient_height: height, 
            patient_weight: weight,
            doctor_id: d_id,
            schedule_id:s_id, 
              
        });
        lockedschedule
              .save()
              .then(user => {
                alert("Your appointment has been confirmed")
                res.redirect('/P_dashboard/book_appoint');
              })
              .catch(err => console.log(err));   
      
    })

    router.get('/joinCall',(req,res) =>{
        res.render('patients/joinCall')
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