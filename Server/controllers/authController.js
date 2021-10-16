const Doctor = require("../models/doctorModel");
const Patient=require("../models/patientModel");
const bcrypt = require("bcryptjs");
const locations = require('../utilities/location');
const passport = require('passport');

//doctor signup request
exports.docsignUp = async(req,res) => {

    const { firstname, lastname, gender, age, email, phone, pincode, degree, speciality, password, password2}=
    req.body;

    let errors=[];

    if(!firstname||!lastname||!gender||!age||!email||!phone||!pincode||!degree||!speciality||!password||!password2){
        errors.push({msg: 'Please fill in all details.'})
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
      }
    
      if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
      }

      if (errors.length > 0) {
        res.render('Dsignup', {errors,firstname,lastname,gender,age,email,phone,pincode,degree,speciality
        });
      }else{
        const emailExist = await Doctor.findOne({ email: req.body.email });
        if (emailExist){
            errors.push({msg: 'Email already exists'});
            res.render('Dsignup',{errors,firstname,lastname,gender,age,email,phone,pincode,degree,speciality});
        }else{
            const curLocation = locations[req.body.pincode];
            //hash the password
            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(req.body.password, salt);
            const doctor = new Doctor({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender: req.body.gender,
                age: req.body.age,
                email: req.body.email,
                phone: req.body.phone,
                pincode: req.body.pincode,
                location: curLocation,
                password: hashPass,
                degree: req.body.degree,
                speciality: req.body.speciality,
                userType: "1",
            });
            doctor
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/Dlogin');
              })
              .catch(err => console.log(err));
        }
      }
}

//patient signup request
exports.patientsignUp = async(req,res) => {

    const { firstname, lastname, gender, age, email, phone, pincode, password, password2}=
    req.body;

    let errors=[];

    if(!firstname||!lastname||!gender||!age||!email||!phone||!pincode||!password||!password2){
        errors.push({msg: 'Please fill in all details.'})
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
      }
    
      if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
      }

      if (errors.length > 0) {
        res.render('Psignup', {errors,firstname,lastname,gender,age,email,phone,pincode
        });
      }else{
        const emailExist = await Patient.findOne({ email: req.body.email });
        if (emailExist){
            errors.push({msg: 'Email already exists'});
            res.render('Psignup',{errors,firstname,lastname,gender,age,email,phone,pincode});
        }else{
            const curLocation = locations[req.body.pincode];
            //hash the password
            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(req.body.password, salt);
            const patient = new Patient({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender: req.body.gender,
                age: req.body.age,
                email: req.body.email,
                phone: req.body.phone,
                pincode: req.body.pincode,
                location: curLocation,
                password: hashPass,
                userType: "2",
            });
            patient
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/Plogin');
              })
              .catch(err => console.log(err));
        }
      }
}

// doctor login
exports.Dlogin = function(req,res,next) {
        passport.authenticate('doctor-local',{
          successRedirect: '/D_dashboard',
          failureRedirect: '/Dlogin',
          failureFlash: true
        })(req,res,next);
}


// patient login
exports.Plogin = function(req,res,next) {
  passport.authenticate('patient-local',{
    successRedirect: '/P_dashboard',
    failureRedirect: '/Plogin',
    failureFlash: true
  })(req,res,next);
}





//const email = req.body.email;
    //const password = req.body.password;
    //const profile=req.body.profile;


    /*if (!email || !password) {
        return res
            .status(400)
            .send({ error: "Provide email and password" });
    }
    var user;
    if(profile=="1"){
        user = await Doctor.findOne({ email: req.body.email });
    }
    else
    user = await Patient.findOne({ email: req.body.email }); 
    if (!user)
        return res
            .status(400)
            .render('login',{ error: "No such user exists" });
        

    //hash
    const ValidPass = await bcrypt.compare(req.body.password, user.password);
    if (!ValidPass)
    return res
        .status(400)
        .render('login',{ error: "Password incorrect" });
    return res
        .status(200)
        .send({ error: null, profile, firstname: user.firstname, lastname: user.lastname, email: user.email, _id: user._id });
        */
