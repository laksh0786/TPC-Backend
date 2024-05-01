const mongoose  = require("mongoose");


//creating the notification schema
const notificationSchema = new mongoose.Schema({

    //type of notification
    type: {
        type: String,
        required: true,
        enum:["Club" , "Events" , "Applications"  , "General"],
    },

    //notification title
    title: {
        type: String,
        required: true
    },

    //notification message
    message: {
        type: String,
        required: true
    },

    //notification link
    link: {
        type: String,
        required: true
    },
    
    
    //notification status
    status: {
        type: Boolean,
        default: true
    },

    //notification timestamp
    timestamp: {
        type: Date,
        default: Date.now
    },

}
, {
    timestamps: true
});


//creating the notification model and exporting it
module.exports = mongoose.model("Notification", notificationSchema);