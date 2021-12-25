const mongoose = require("mongoose");
// Required for performing necessary data validations
//const validator = require('validator');
const lockSchema = new mongoose.Schema({

    patient_id: {
        type: String,
        required: [true, 'Please provide patient id.'],
    },
   
    patient_symptoms: {
        type: String,
        required: true,
    },
    patient_height: {
        type: String,
        required: true,
    },
    patient_weight: {
        type: String,
        required: true,
    },
    doctor_id: {
        type: String,
        required: true,
    },

    
},{ timestamps: true });

module.exports = mongoose.model("lockedSchedule", lockSchema);