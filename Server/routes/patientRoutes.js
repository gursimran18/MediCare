const express = require('express');

const router = express.Router();
//var ObjectID = require("mongodb").ObjectID;
const Schedule = require("../models/scheduleModel");
const doctors = require("../models/doctorModel");
const lockedSchedule = require("../models/bookedModel");
//console.log(Doctors.firstname)
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



/*router.get('/book_appoint',(req,res) =>{
    Schedule.aggregate([
        {
$lookup :
{
    from: "Doctors",
    localfield: "doctor_id" ,
    foreignField : "_id",
    as: "D_id"
}


        }], function(err, schedules){
             if(schedules){
            res.send({
                error: false,
                data: schedules
            })
        }
            res.render('patients/book_appoint',{
                scheduleList: schedules
            }) 
           if(err){
                res.send(err)
            }
        }
        )

}) */

 router.get('/book_appoint',(req,res, next)=>{
    Schedule.aggregate([
        //{
            //"$match":ObjectId(doctor_id)},
        {
            "$lookup":{
                "let": { "docObjId": { "$toObjectId": "$doctor_id" } },
          "from":"doctors",
         // "let":{"d_id":"$doctor_id"},
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
           console.log(result)
            res.render('patients/book_appoint',{
               scheduleList: result
            }) 
            //res.send({
                //error: false,
                //data: result
           // })
        }
    })
}) 
   /* .exec((err,result) => {
        if(err){
            res.send(err)
        }
        if(result){
            res.send({
                error: false,
                data: result
            })
        }
    })*/

    router.get('/lock_appoint',(req,res) =>{
        res.render('patients/lockAppoint',{
           p_id: req.user.id,
           p_fname: req.user.firstname,
           p_lname: req.user.lastname,
           p_gender: req.user.gender,
           p_age: req.user.age,
           p_email: req.user.email,
           p_phone:req.user.phone,
        });
       
    })
    

    router.post('/lockAppoint',async(req,res) => {
       
       const patient_id= req.user.id, 
       patient_symptoms= req.body.symptom,
       patient_height= req.body.height, 
       patient_weight= req.body.weight,
        //change
         doctor_id = req.user.id,
    
       
      
             lockedschedule = new lockedSchedule({
                patient_id: patient_id,
                 patient_symptoms: patient_symptoms,
                 patient_height: patient_height, 
                 patient_weight: patient_weight,
                doctor_id: doctor_id, 
                  
            });
            lockedschedule
                  .save()
                  .then(user => {
                    req.flash(
                      'success_msg',
                      'Your appointment has been confirmed'
                    );
                    res.redirect('patients/book_appoint');
                  })
                  .catch(err => console.log(err));
      
    })
    
    router.get('/logout',(req,res) =>{
        req.logout();
        req.flash('success_msg','You are logged out')
        res.redirect('/Dlogin');
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