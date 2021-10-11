const mongoose = require("mongoose");
// Required for performing necessary data validations
const validator = require('validator');
const userSchema = new mongoose.Schema({

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
    isDoctor: {
        type: Boolean,
        default : false
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
},{ timestamps: true });

module.exports = mongoose.model("User", userSchema);