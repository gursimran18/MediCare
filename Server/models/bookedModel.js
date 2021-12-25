const mongoose = require("mongoose");
// Required for performing necessary data validations
//const validator = require('validator');
const lockSchema = new mongoose.Schema({

    patient_id: {
        type: String,
        required: [true, 'Please provide patient id.'],
    },
    patient_name: {
        type: String,
        required: [true, 'Please provide patient name.'],
    },
    patient_gender: {
        type: String,
        required: true,
    },
    patient_age: {
        type: String,
        required: true,
    },
    patient_email: {
        type: String,
        required: true,
    },
    patient_phone: {
        type: String,
        required: true,
    },
    doctor_id: {
        type: String,
        required: true,
    },

    doctor_name: {
        type: String,
        required: true,
    },
    date:{
        type: String,
        required: true,
    },
    start_time:{
        type: String,
        required: true,
    },
    end_time:{
        type: String,
        required: true,
    },
    mode: {
        type: String,
        required: true,
    },
},{ timestamps: true });

module.exports = mongoose.model("lockedSchedule", lockSchema);