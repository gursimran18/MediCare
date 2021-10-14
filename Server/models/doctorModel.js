const mongoose = require("mongoose");
// Required for performing necessary data validations
const validator = require('validator');
const doctorSchema = new mongoose.Schema({

    firstname: {
        type: String,
        required: [true, 'Please provide firstname.'],
        min: 6,
        max: 15
    },
    lastname: {
        type: String,
        required: [true, 'Please provide lastname.'],
        min: 6,
        max: 15
    },

    gender: {
        type: String,
        required: [true, 'Please provide gender.'],
    },

    age:{
        type: String,
        required: [true,'Please provide age'],
    },

    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email.'],
        validate: [validator.isEmail, 'Please provide a valid email address.']
    },
    phone: {
        type: String,
        min: 10,
        max:15,
        required: [true, 'Please provide phone number.'],
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    pincode: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    degree:{
        type: String,
        required: [true, 'Please provide degree qualification'],
    },
    speciality:{
        type: String,
        required: [true, 'Please provide speciality'],
    }
},{ timestamps: true });

module.exports = mongoose.model("Doctors", doctorSchema);