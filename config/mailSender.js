const nodemailer = require("nodemailer");

//importing the env variables to process.env
require("dotenv").config();

//creating the mail sender function
const mailSender = async (email  , title , body)=>{

    if(!Array.isArray(email)){
        email = [email];
    }

    const emails = email.join(", ");

    try{    

        //creating the transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from:"University Placmeent Committee - MRSPTU Bathinda",
            to:emails,
            subject:title,
            html:body 
        })

        console.log(info);

        return info;

    } catch(err){

        console.log(err.message);

    }

}


//exporting the mailSender function
module.exports = mailSender;