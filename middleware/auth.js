const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/userSchema");


//auth controller to verify the user
exports.authController = (req , resp)=>{
    
    let token = req.headers["authorization"];

    if(!token){
        resp.json({
            success:false,
            message:"Unauthorized"
        });
        return;
    }

    token = token.split(" ")[1];
    console.log(token);

    let isTokenValid;

    try{
        isTokenValid = jwt.verify(token , process.env.JWT_SECRET);
    } catch(err){
        
        console.log("Token is invalid or expired.");
        
        resp.json({
            success:false,
            message:"Unauthorized",
            error:err.message
        });

        return;
    }

    if(isTokenValid){
        
        const payload = jwt.decode(token);
        req.user = payload;
        console.log(payload);
        // next();
        resp.json({ success:true , message:"Authorized" , payload:payload});

    }

    else{
        resp.json({ success:false,  message:"Unauthorized"});
        return;
    }

}



//auth middleware to verify the token
exports.auth = async (req, res, next) => {
    try {
        //extract token
        let token = req.headers["authorization"];

        // console.log("token= ", token);

        //if token missing, then return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is missing , Please login again to get the token',
            });
        }

        token = token.replace("Bearer ", "");

        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decode= ", decode);
            req.user = decode;
        }
        catch (err) {
            //verification - issue
            return res.status(401).json({
                success: false,
                message: 'token is invalid',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        });
    }
}

//isStudent
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.role != 1) {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Students only',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again'
        })
    }
}


//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.role != 2) {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Admin only',
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User role cannot be verified, please try again'
        })
    }
}