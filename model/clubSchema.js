const mongoose = require('mongoose');


const clubSchema = new mongoose.Schema({

    clubName: {
        type: String,
        required: true
    },

    clubImage:{
        type: String,
        required: true
    },

    clubDescription: {
        type: String,
        required: true
    },

    //Department or University
    clubType: {
        type: String,
        required: true,
    },

    clubHeadName: {
        type: String,
        required: true
    },

    clubHeadContact: {
        // either teacher contact or student contact
        type: Number,
        required: true
    },
    
    clubEventsList:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClubEvent"
    }],
    
    clubMembers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    clubFollowers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]

    // notfications:[
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Notification"
    //     }
    // ]

}, {
    timestamps: true
});


const Club = mongoose.model('Club', clubSchema);

module.exports = Club;