const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
var alert=require('alert');
const router = express.Router();
//const upload= require('express-fileupload')
const Schedule = require("../models/scheduleModel");
const doctors = require("../models/doctorModel");
const lockedSchedule = require("../models/bookedModel");
const connectDB = require('../database/connection')
//const conn= connectDB();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
router.use(bodyParser.json());
router.use(methodOverride('_method'));
const mongoURI=process.env.MONGO_URI
const conn = mongoose.createConnection(mongoURI);
const {
  v4: uuidV4
} = require('uuid');
const {
  validate: uuidValidate
} = require('uuid');

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});


// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });
  
  // @route GET /
  // @desc Loads form
  router.get('/uploadFile', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('patients/uploadsView', { files: false });
      } else {
        files.map(file => {
          if (
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('patients/uploadsView', { files: files });
      }
    });
  });
  
  // @route POST /upload
  // @desc  Uploads file to DB
  router.post('/uploadFile/upload', upload.single('file'), (req, res) => {
    // res.json({ file: req.file });
    res.redirect('/P_dashboard/uploadFile');
  });
  
  // @route GET /files
  // @desc  Display all files in JSON
  router.get('/uploadFile/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
  
      // Files exist
      return res.json(files);
    });
  });
  
  // @route GET /files/:filename
  // @desc  Display single file object
  router.get('/uploadFile/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // File exists
      return res.json(file);
    });
  });
  
  // @route GET /image/:filename
  // @desc Display Image
  router.get('/uploadFile/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });
  
  // @route DELETE /files/:id
  // @desc  Delete file
  router.delete('/uploadFile/files/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
  
      res.redirect('/uploadFile');
    });
  })


















router.get('',ensureAuthenticated,(req,res) =>{
    res.render('patients/dashboardPatient',{
        name: req.user.firstname
    });
})

router.get('/backto_dash',ensureAuthenticated,(req,res) =>{
    res.redirect('/P_dashboard');
})


router.get('/profile',ensureAuthenticated,(req,res) =>{
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

router.get('/p_viewAppointments',ensureAuthenticated,async(req,res) => {
    const pat_id=req.user.id;
    lockedSchedule.aggregate([
        {
            "$match":{
                "patient_id": pat_id
            }
        },
        {
            "$lookup":{
                "let": { "docObjId": { "$toObjectId": "$doctor_id" } },
          "from":"doctors",
          "pipeline":[
            {"$match":{"$expr":{"$eq":[ "$_id","$$docObjId"]}}},
            {"$project":{"firstname":1,"lastname":1, "email":1, "gender":1,"phone":1, "degree":1, "speciality":1}}
          ],
          "as":"DocData"
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
            res.render('patients/p_viewAppointments',{
                appointments: result
             }) 
        }
    })
})

 router.get('/book_appoint',ensureAuthenticated,(req,res, next)=>{
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

    router.get('/lock_appoint/:schedule_id',ensureAuthenticated,(req,res) =>{
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

    router.get('/joinCall',ensureAuthenticated,(req,res) =>{
        res.render('patients/joinCall',{
          name: req.user.firstname,
          lastname: req.user.lastname,
          title: "Call | "
        })
    })

    router.get('/p_cancelAppointment/:_id',ensureAuthenticated,async(req,res)=>{
        lockedSchedule.findByIdAndDelete(req.params._id.toString(),function(err,docs){
            if(err){
                res.send(err)
            }
            else{
                res.redirect('/P_dashboard/p_viewAppointments')
            }
        })
    })
   
        /*router.use(upload())

    router.get('/uploadFile',(req,res) =>{
        
        res.render('patients/uploads');
    })


    router.post('/P_dashboard/uploadFilen',async(req,res) => {
       if(req.files){
           console.log(req.files)
       }
    })*/

router.get('/logout',(req,res) =>{
    req.logout();
    req.flash('success_msg','You are logged out')
    res.redirect('/Plogin');
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

router.post('/joinCall',(req,res)=>{
  let meetId=req.body.meetId.toString().toLowerCase();
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
    res.redirect('/P_dashboard/joinCall')
  }
})

/*router.get('/getNearestDoctors',async (req,res)=>{
    const allDoctors = await Doctors.find();
    console.log(allDoctors);
    res.render('patients/ViewDoctor',{
        doctors : allDoctors
    });
})*/

module.exports= router;