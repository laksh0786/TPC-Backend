const mongoose = require('mongoose');


const clubEventSchema = new mongoose.Schema({
    
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    eventDescription: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventTime: {
        type: String,
        required: true
    },
    eventVenue: {
        type: String,
        required: true
    },
    eventHeadName:{
        type: String
    },
    eventHeadContact: {
        type: Number
    },
    eventLink: {
        type: String,
    },
    eventAttendees:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]

}, {
    timestamps: true
});


const clubEvent = mongoose.model('ClubEvent', clubEventSchema);

module.exports = clubEvent;