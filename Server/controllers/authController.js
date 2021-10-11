const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const locations = require('../utilities/location');

//signup request
exports.signUp = async(req,res) => {

    //TODO: add check if any field in body is empty
    const curLocation = locations[req.body.pincode];
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
        return res
            .status(400)
            .send({ error: "Email already exists" 
    });

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        pincode: req.body.pincode,
        location: curLocation,
        isDoctor: req.body.isDoctor == null ? false : true,
        password: hashPass,
    });
    try {
        const savedUser = await user.save();
        return res
            .status(200)
            .send({error: null, isdoctor: user.isdoctor, firstname: user.firstname, lastname: user.lastname, email: user.email, _id: user._id});
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

    if (!email || !password) {
        return res
            .status(400)
            .send({ error: "Provide email and password" });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return res
            .status(400)
            .send({ error: "Email or Password is incorrect." });

    //hash
    const ValidPass = await bcrypt.compare(req.body.password, user.password);
    if (!ValidPass)
        return res
            .status(400)
            .send({ error: "Password is incorrect." });
    return res
        .status(200)
        .send({ error: null, isdoctor: user.isdoctor, firstname: user.firstname, lastname: user.lastname, email: user.email, _id: user._id });
}