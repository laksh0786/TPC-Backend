const mongoose = require("mongoose");

const personalInfoSchema = new mongoose.Schema(
    {
        image:{
            type: String,
            required:true,
        },

        batch: {
            type: String
        },

        branch: {
            type: String
        },

        rollNumber: {
            type: Number
        },

        contact: {
            type: Number,
        },

        gender: {
            type: String,
        },

        dateOfBirth: {
            type: Date,
        },
        
        address: {
            type: String,
        },
        
        cvLink: {
            type: String,
        },

        interests: {
            type: Array,
        },
    },
    {
        timestamps: true,
    }
);

const PersonalInfo = mongoose.model("PersonalInfo", personalInfoSchema);

module.exports = PersonalInfo;
