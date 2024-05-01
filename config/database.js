const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {

    //connecting to the database
    mongoose.connect(process.env.DB_URL).then(() => {
        console.log("Database connected successfully");
    }).catch((err) => {
        console.log("Database connection failed : ", err);
        process.exit(1);
    })

}

module.exports  = dbConnect;