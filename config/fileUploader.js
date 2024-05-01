//importing the cloudinary
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

//configuring the cloudinary
exports.cloudinaryConnect = ()=>{

    try{

        cloudinary.config({
            cloud_name : process.env.CLOUD_NAME,
            api_key : process.env.API_KEY,
            api_secret : process.env.API_SECRET
        })

    } catch(err){
        console.log(err);
    }


}


//function to upload the file to the cloudinary
exports.uploadFile = async (file , folder , height , quality) => {

    const options = {folder};

    if(height){
        options.height = height;
    }

    if(quality){
        options.quality = quality;
    }

    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file, options);

}