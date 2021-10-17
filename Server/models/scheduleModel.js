const mongoose = require("mongoose");
// Required for performing necessary data validations
const validator = require('validator');
const scheduleSchema = new mongoose.Schema({

    doctor_id: {
        type: String,
        required: [true, 'Please provide doctor id.'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email.'],
        validate: [validator.isEmail, 'Please provide a valid email address.']
    },
    date: {
        type: String,
        required: [true, 'Please provide date.'],
    },
    start_time: {
        type: String,
        required: true,
    },
    end_time: {
        type: String,
        required: false,
    },
    average_time: {
        type: String,
        required: true,
    },
},{ timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);