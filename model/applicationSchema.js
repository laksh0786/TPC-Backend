const mongoose = require('mongoose');


const applicationSchema = new mongoose.Schema({
    applicationType:{
        //possible values: 0-Internship, 1-job,2-Training,3-Workshop
        type: Number,
        required: true,
        default: 3
    },
    applicationTitle: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    companyAddress: {
        type: String,
        required: true
    },
    companyWebsite: {
        type: String,
        required: true
    },
    companyContact: {
        type: String,
        required: true
    },
    requiredSkills: {
        type: Array,
    },
    applicationDescription: {
        type: String,
    },
    applicationDuration: {
        type: String,
    },
    applicationStartDate: {
        type: Date,
    },
    postedOn: {
        type: Date,
        default: Date.now
    },
    applicationDeadline: {
        type: Date,
    },
    applicationLink: {
        type: String,
    },
    applicationParticipants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

}, {
    timestamps: true
});


const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;