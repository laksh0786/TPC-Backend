//importing the modules
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dbConnect = require("./config/database"); //importing the database connection function
const cookieParser = require("cookie-parser");

const {
    handleRegister,
    handleNotifications,
    handleApplication,
    handleClub,
    eventRoutes
} = require("./routes"); //importing the routes

//creating the express app
const app = express();

//using the modules
app.use(cors());

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
}));


require("dotenv").config(); //loading the env variables to the process.env


//middleware to parse the json data
app.use(express.json());

//middleware to parse the cookie data
app.use(cookieParser());

//middleware to add static files to the server
app.use("/uploads", express.static("uploads"));

//testing api route, to check if the server is running
app.use("^/$", (req, res) => {

    //options object for the cookie 
    //maxAge: 1000*60*60*24*7 (would expire after 7 days)
    //httpOnly: true (cookie can't be accessed by the client side javascript)
    //secure: true (cookie will only be sent over https)
    //sameSite: "none" (cookie will be sent with the cross origin requests)

    

    res.cookie("User" , "Lakshay" ).json({
        message:
            "MRSPTU-TPC Server instance welcomes you to the index page of the API",
        status: "success",
        data:{
            message:"Welcome to the API",
            name:"Lakshay"
        }
    });
});

app.get("/getCookie", (req, res) => {
    console.log(req.cookies);
    res.send(req.cookies);
})

// attaching routes with API
app.use("/api/v1/register", handleRegister); // registering users
app.use("/api/v1/notify", handleNotifications); // routing for notifications
app.use("/api/v1/application", handleApplication); // routing for applications
app.use("/api/v1/club", handleClub); // routing for university Clubs
app.use("/api/v1/event" , eventRoutes);


//connecting to the cloudinary
const {cloudinaryConnect} = require("./config/fileUploader");

cloudinaryConnect();

//connecting to the database
dbConnect();

//listening to the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
});

//
