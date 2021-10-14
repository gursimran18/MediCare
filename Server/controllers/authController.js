const Doctor = require("../models/doctorModel");
const Patient=require("../models/patientModel");
const bcrypt = require("bcryptjs");
const locations = require('../utilities/location');

//doctor signup request
exports.docsignUp = async(req,res) => {

    //TODO: add check if any field in body is empty
    const curLocation = locations[req.body.pincode];
    const emailExist = await Doctor.findOne({ email: req.body.email });
    if (emailExist)
        return res
            .status(400)
            .send({ error: "Email already exists" 
    });

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
        speciality: req.body.speciality
    });
    try {
        const savedUser = await doctor.save();
        return res
            .status(200)
            .render('login');
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .send({ error: "Cannot signup at the moment try again later", success: "false" });
    }

}

//patient signup request
exports.patientsignUp = async(req,res) => {

    //TODO: add check if any field in body is empty
    const curLocation = locations[req.body.pincode];
    const emailExist = await Patient.findOne({ email: req.body.email });
    if (emailExist)
        return res
            .status(400)
            .send({ error: "Email already exists" 
    });

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
    });
    try {
        const savedUser = await patient.save();
        return res
            .status(200)
            .render('login');
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .send({ error: "Cannot signup at the moment try again later", success: "false" });
    }

}

//login
exports.login = async(req,res) => {

    const email = req.body.email;
    const password = req.body.password;
    const profile=req.body.profile;


    if (!email || !password) {
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
}