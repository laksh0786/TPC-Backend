const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        email: {

            type: String,
            required: [true, "Email address is required"],
            unique: true,
            lowercase: true,

            //we can use the validate property to validate the email address.
            //validate property takes an array of two elements, first element is a function that takes the value to be validated and returns a boolean value, second element is the error message to be displayed if the validation fails.

            //1. First method we can create the function and check the validity using the regular expression.
            //2. Second method we can use the validator module (third party module) to check the validity of the email address.

            // validate: [isEmail , "Please enter a valid email address"]  //done in the controller

        },

        password: {

            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be atleast 8 characters long"],

        },

        role: {
            // possible-student - 0, teacher-1, admin-2, superAdmin-3
            type: Number,
            default: 0,
            required: true,
            enum:[0,1,2,3]
        },

        personalInfo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PersonalInfo",
        },

        //club Events Participated
        clubEvents: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "ClubEvent",
        }],

        //club Members
        clubMembership: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club",
        }],


        //club following
        clubFollowing: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club",
        }],

        //Jobs applied
        applications: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
        }],

    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
