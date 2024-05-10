const User = require('../model/userSchema');
const PersonalInfo = require('../model/personalInfoSchema');
const jwt = require('jsonwebtoken');
const mailSender = require('../config/mailSender');
const { registerationConfirmationEmail } = require("../mail/template/registerationConfirmation");
const {uploadFile} = require("../config/fileUploader");

require('dotenv').config();

const bcrypt = require('bcrypt');
const { listenerCount } = require('../model/clubSchema');

//handling error function
const handleError = (err) => {

    const errors = {};

    //err.message : it gives the message written in the error
    //err.code : it gives the error code and help to identify the type of error
    console.log(err.message, err.code);

    //duplicate error code
    if (err.code === 11000) {
        errors.email = "Email is already registered";
        return errors;
    }

    //validation errors
    if (err.message.includes("User validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            // console.log(properties);
            errors[properties.path] = properties.message;
        });
    }

    return errors;

}


//a function to send user verification email
async function sendVerificationEmail(email, name) {

    try {

        // console.log(registerationConfirmation);
        const mailResponse = await mailSender(email, "Verification Email From UPC MRSPTU Bathinda", registerationConfirmationEmail(name));
        console.log("Email sent successfully : ", mailResponse);
    }

    catch (err) {
        console.log("Errror occured while sending email : ", err);
        throw err;
    }

}


//get all users controller
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('personalInfo');
        res.status(200).send({
            success: true,
            users: users
        });
    } catch (err) {
        res.status(400).send({
            success: false,
            error: err.message
        });
    }
}


//get user by id controller
const getUserById = async (req, res) => {
    try {

        // console.log(req.query);

        const user = await User.findById(req.query.id).populate('personalInfo');
        res.status(200).send({
            success: true,
            user: user
        });
    } catch (err) {
        res.status(400).send({
            success: false,
            error: err.message
        });
    }
}


//Signup controller
const handleUserRegistration = async (req, res) => {

    // extract the required fields from the request body
    const { name, email, password, confirmPassword, role } = req.body;

    console.log(name, email, password, confirmPassword, role);

    //validating the fetched data
    if (!name || !email || !password || !confirmPassword || !role) {
        return res.status(422).json({
            error: "Please fill the credentials properly",
            success: false
        });
    }

    //checking whether the email is valid or not
    const emailRegex = "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
    if (!email.match(emailRegex)) {
        return res.status(400).json({
            success: false,
            message: "Email is not valid , Please try again"
        })
    }


    // check if the email already exists
    const userExist = await User.findOne({
        email: email
    });

    if (userExist) {
        return res.status(422).json({
            error: "Email already exists",
            success: false
        });
    }


    //check if the password and confirm password are same
    if (password !== confirmPassword) {
        return res.status(422).json({
            error: "Password and Confirm Password should be same",
            success: false
        });
    }


    //creating new personalInfo document and adding the reference to the user document
    try {

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // initialize the personalInfo schema
        const personalInfo = await PersonalInfo.create({
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
            batch: null,
            branch: null,
            rollNumber: null,
            contact: null,
            gender: null,
            dateOfBirth: null,
            address: null,
            cvLink: null,
            interests: []

        })


        // save the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            personalInfo: personalInfo._id
        });

        user.password = undefined;

        //sending the verification email
        await sendVerificationEmail(user.email, user.name);


        // send the response
        res.status(201).send({
            UserId: user._id,
            success: true,
            user: user,
        });
    } catch (e) {

        const errors = handleError(e);
        // send the error response
        res.status(400).send({
            errors: errors,
            message: e.message,
            success: false
        });
    }
}


//Login Controller
const loginController = async (req, resp) => {

    try {

        //fetching the email and password from the request body
        const { email, password } = req.body;

        //validating the email and password
        if (!email || !password) {
            return resp.status(400).json({
                success: false,
                error: "Please fill the credentials properly"
            });
        }

        //checking if the user exists
        const userData = await User.findOne({ email }).populate('personalInfo');

        //if the user doesn't exists
        if (!userData) {
            return resp.status(400).json({
                success: false,
                error: "Invalid credentials or User doesn't exists"
            });
        }


        //verifying the password and generating the jwt token
        if (await bcrypt.compare(password, userData.password)) {

            //payload for the jwt token
            const payload = {
                id: userData._id,
                email: userData.email,
                role: userData.role
            }

            //generating the jwt token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE
            });

            //options for the cookie
            const options = {
                expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            userData.password = undefined;

            //sending the response
            return resp.status(200).cookie("token", token, options).json({
                success: true,
                message: "User logged in successfully",
                token: token,
                user: userData,

            });
        }
        else {
            return resp.status(400).json({
                success: false,
                error: "Password is incorrect"
            });
        }

    } catch (err) {

        //function to handle the error
        const errors = handleError(err);

        return resp.status(500).json({
            success: false,
            message: "Internal server error",
            errors: errors
        });

    }

}


//Updating the user data controller
const handleUserUpdation = async (req, res) => {


    // extract the required fields from the request body
    let { userId, name, batch, branch, rollNumber, contact, gender, dateOfBirth, address, cvLink, interests } = req.body;

    //userId can be fetched from the jwt token or middleware

    //fetching the image from the request file
    let imgFile = {};
    let imgUrl;


    if (req.files) {
      
        imgFile = req.files.profileImage;

        console.log(imgFile);

        //validation of file type
        const supportedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
        const fileType = imgFile.mimetype;
        // const fileType = imgFile.name.split(".").at(-1).toLowerCase();
        
        console.log(imgFile.mimetype);


        if (!supportedFileTypes.includes(fileType)) {
            return res.status(400).json({
                success: false,
                error: "File type not supported"
            });
        }


        //uploading the file to the cloudinary
        const response  = await uploadFile(imgFile.tempFilePath , "TPC/User Profile Pics" );
        console.log(response);

        imgUrl = response.secure_url;

    }


    //creating new
    try {

        //finding the user by userId
        const user = await User.findById(userId);

        //if the user doesn't exists
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User doesn't exists"
            });
        }

        //finding the personalInfo document by the reference
        const personalInfo = await PersonalInfo.findById(user.personalInfo);


        //updating the personalInfo document
        const updatedPersonalInfo = await PersonalInfo.findByIdAndUpdate(personalInfo._id, {
            image: imgUrl || personalInfo.image,
            batch: batch || personalInfo.batch,
            branch: branch || personalInfo.branch,
            rollNumber: rollNumber || personalInfo.rollNumber,
            contact: contact || personalInfo.contact,
            gender: gender || personalInfo.gender,
            dateOfBirth: dateOfBirth || personalInfo.dateOfBirth,
            address: address || personalInfo.address,
            cvLink: cvLink || personalInfo.cvLink,
            interests: interests || personalInfo.interests
        })

        //updating the user document
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: {
                name: name || user.name,
            }
        }, { new: true }).populate('personalInfo');

        updatedUser.password = undefined;

        // send the response
        res.status(201).send({
            success: true,
            user: updatedUser,
        });
    } catch (e) {

        // send the error response
        res.status(400).send({
            error: e.message,
            success: false
        });
    }
}



//change password controller
const changePasswordController = async (req , resp)=>{

    try{

        //fetching the email , password and new password from the request body
        const {email , password , newPassword} = req.body;

        //validating the email and password
        if(!email || !password || !newPassword){
            return resp.status(400).json({
                success : false,
                error : "Please fill the credentials properly"
            });
        }

        //checking if the user exists
        const userData = await User.findOne({email});

        //if the user doesn't exists
        if(!userData){
            return resp.status(400).json({
                success : false,
                error : "User doesn't exists"
            });
        }

        //verifying the password with the stored password
        if(await bcrypt.compare(password , userData.password)){

            //hashing the new password
            const hashedPassword = await bcrypt.hash(newPassword , 10);

            //updating the password
            const updatedUser = await User.findByIdAndUpdate(userData._id , {
                password : hashedPassword
            } , {new : true});

            //sending the response
            return resp.status(200).json({
                success : true,
                message : "Password changed successfully",
                user : updatedUser
            });

        }
        else{
            return resp.status(400).json({
                success : false,
                error : "Password is incorrect"
            });
        }
    

    } catch(err){

        //function to handle the error
        const errors = handleError(err);

        return resp.status(500).json({
            success : false,
            message : "Internal server error",
            errors : errors
        });

    }

}


module.exports = { handleUserRegistration, handleUserUpdation, loginController , changePasswordController , getAllUsers , getUserById};