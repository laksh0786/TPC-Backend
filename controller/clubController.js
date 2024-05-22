//importing the schema
const Club = require("../model/clubSchema");
const User = require("../model/userSchema");
const PersonalInfo = require("../model/personalInfoSchema");
const ClubEvent = require("../model/clubEventSchema");
const { uploadFile } = require("../config/fileUploader");

//controller to create a new club
exports.createClub = async (req, resp) => {

    try {

        //fetching the club details from the request body
        const { clubName, clubDescription, clubType, clubHeadContact , clubHeadName  } = req.body;
        // console.log(clubName, clubDescription, clubType, clubHeadContact , clubHeadName);
        // console.log(req.body);

        //validating the club details
        if (!clubName || !clubDescription || !clubType || !clubHeadContact || !clubHeadName) {
            return resp.status(400).json({
                success: false,
                message: "Please enter all the fields"
            });
        }

        //fetching the file from the request.files
        let clubImg;
        let clubImgUrl;

        if (req.files) {

            clubImg = req.files.clubImg;

            //validation of file type
            const supportedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
            const fileType = clubImg.mimetype;
            console.log(fileType);

            if (!supportedFileTypes.includes(fileType)) {
                return resp.status(400).json({
                    success: false,
                    message: "Please upload a valid image file"
                });
            }

            //uploading the file to the cloudinary
            const response = await uploadFile(clubImg.tempFilePath, "TPC/Club Images");
            console.log(response);

            clubImgUrl = response.secure_url;


        }

        //creating a new club
        const newClub = await Club.create({
            clubName,
            clubImage: clubImgUrl,
            clubDescription,
            clubType,
            clubHeadName,
            clubHeadContact,
        });

        //sending the response
        resp.status(200).json({
            success: true,
            message: "Club created successfully",
            data: newClub
        });

    } catch (err) {
        console.log(err);
        resp.status(500).json({
            success: false,
            message: "Internal server error while creating the club",
            error:err.message
        });
    }

}


//controller to get all the clubs
exports.getAllClubs = async (req, resp) => {

    try {

        //fetching all the clubs
        // const clubs = await Club.find();
        const clubs = await Club.find().populate("clubEventsList").populate({
            path: "clubMembers",
            populate: {
                path: "personalInfo",
                model: "PersonalInfo"
            }
        }).populate({
            path: "clubFollowers",
            populate: {
                path: "personalInfo",
                // model: "PersonalInfo"
            }
        });

        //sending the response
        resp.status(200).json({
            success: true,
            message: "Clubs fetched successfully",
            data: clubs
        });

    } catch (err) {
        console.log(err);
        resp.status(500).json({
            success: false,
            message: "Internal server error while fetching the clubs"
        });
    }

}


//controller to get a single club
exports.getParticularClub = async (req, resp) => {

    try {

        //fetching the club id from the request query
        const clubId = req.query.clubId;

        //fetching the club
        // const clubData = await Club.findById(clubId);
        const clubData = await Club.findById(clubId).populate("clubEventsList").populate({
            path: "clubMembers",
            populate: {
                path: "personalInfo",
                // model: "PersonalInfo"
            }
        }).populate({
            path: "clubFollowers",
            populate: {
                path: "personalInfo",
                // model: "PersonalInfo"
            }
        });

        //validating the club
        if (!clubData) {
            return resp.json({
                success: false,
                message: "No club found with this id"
            });
        }

        //sending the response
        resp.status(200).json({
            success: true,
            message: "Club fetched successfully",
            data: clubData
        });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            success: false,
            message: "Internal server error while fetching the club",
            error: error.message
        });
    }

}


//controller to update a club
exports.updateClub = async (req, resp) => {

    try {

        //fetching the club id and club details from the request body
        const { clubId, clubName, clubDescription, clubType, clubHeadContact , clubHeadName } = req.body;

        //fetching the file from the request.files
        let clubImg;
        let clubImgUrl;

        if (req.files) {
            
            clubImg = req.files.clubImg;

            //validation of file type
            const supportedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
            const fileType = clubImg.mimetype;

            if (!supportedFileTypes.includes(fileType)) {
                return resp.status(400).json({
                    success: false,
                    message: "Please upload a valid image file"
                });
            }

            //uploading the file to the cloudinary
            const response = await uploadFile(clubImg.tempFilePath, "TPC/Club Images");
            console.log(response);
            clubImgUrl = response.secure_url;

        }

        //finding and validating the club by id
        const clubData = await Club.findById(clubId);

        //validating the club
        if (!clubData) {
            return resp.status(400).json({
                success: false,
                message: "No club found with this id"
            });
        }

        //updating the club
        const updatedClub = await Club.findByIdAndUpdate(clubId, {
            clubName: clubName || clubData.clubName,
            clubDescription: clubDescription || clubData.clubDescription,
            clubType: clubType || clubData.clubType,
            clubHeadContact: clubHeadContact || clubData.clubHeadContact,
            clubHeadName: clubHeadName || clubData.clubHeadName  ,
            clubImage: clubImgUrl || clubData.clubImage  
        }, { new: true });


        //sending the response
        resp.status(200).json({
            success: true,
            message: "Club updated successfully",
            data: updatedClub
        });

    } catch (error) {

        console.log(error);
        resp.status(500).json({
            success: false,
            message: "Internal server error while updating the club"
        });

    }

}


//controller to delete a club
exports.deleteClub = async (req, resp) => {

    try {

        //fetching the club id from the request body
        const { clubId } = req.body;


        //finding and validating the club by id
        const clubData = await Club.findById(clubId);


        //validating the club
        if (!clubData) {
            return resp.status(400).json({
                success: false,
                message: "No club found with this id"
            });
        }

        //deleting the club
        await Club.findByIdAndDelete(clubId);

        //sending the response
        resp.status(200).json({
            success: true,
            message: "Club deleted successfully"
        });

    } catch (error) {

        console.log(error);
        resp.status(500).json({
            success: false,
            message: "Internal server error while deleting the club"
        });

    }

}


//contoller to add the club followers
exports.addClubFollowers = async (req, resp) => {

    try {

        //fetching the club id and user id from the request body
        const { clubId, userId } = req.body;

        //validating the data
        if (!clubId || !userId) {
            return resp.status(400).json({
                success: false,
                message: "Please enter all the details"
            });
        }

        //finding and validating the user by id
        const userData = await User.findById(userId);

        //validating the user
        if (!userData) {
            return resp.status(400).json({
                success: false,
                message: "No user found with this id"
            });
        }

        //finding and validating the club by id
        const clubData = await Club.findById(clubId);

        //validating the club
        if (!clubData) {
            return resp.status(400).json({
                success: false,
                message: "No club found with this id"
            });
        }

        //checking if the user is already following the club
        if (clubData.clubFollowers.includes(userData._id)) {
            return resp.status(400).json({
                success: false,
                message: "User is already following the club"
            });
        }

        //adding the user to the club followers
        clubData.clubFollowers.push(userData._id);

        //adding the club to the user club following
        userData.clubFollowing.push(clubId);

        //saving the club
        await clubData.save();

        //saving the user
        await userData.save();

        //sending the response
        resp.status(200).json({
            success: true,
            message: "User added to the club followers successfully",
            data: clubData
        });


    } catch (err) {

        return resp.status(500).json({
            success: false,
            message: "Internal server error while adding the user to the club followers"
        })
    }

}


//controller to remove the club followers
exports.removeClubFollowers = async (req, resp) => {

    try {

        //fetching the club id and user id from the request body
        const { clubId, userId } = req.body;

        //validating the data
        if (!clubId || !userId) {
            return resp.status(400).json({
                success: false,
                message: "Please enter all the details"
            });
        }

        //finding and validating the club by id
        const clubData = await Club(clubId);

        //validating the club
        if (!clubData) {
            return resp.status(400).json({
                success: false,
                message: "No club found with this id"
            });
        }

        //finding and validating the user by id
        const userData = await User.findById(userId);

        //validating the user
        if (!userData) {
            return resp.status(400).json({
                success: false,
                message: "No user found with this id"
            });
        }

        //checking if the user is already following the club
        if (!clubData.clubFollowers.includes(userId)) {
            return resp.status(400).json({
                success: false,
                message: "User is not following the club"
            });
        }

        //removing the user from the club followers
        clubData.clubFollowers.pull(userId);

        //removing the club from the user club following
        userData.clubFollowing.pull(clubId);

        //saving the club
        await clubData.save();

        //saving the user
        await userData.save();

        //sending the response
        resp.status(200).json({
            success: true,
            message: "User removed from the club followers successfully",
            data: clubData
        });

    } catch (err) {

        return resp.status(500).json({
            success: false,
            message: "Internal server error while removing the user from the club followers"
        })
    }
}



// //controller to add the club members
// exports.addClubMembers = async (req , resp)=>{

//     try{

//         //fetching the club id and user id from the request body
//         const {clubId , userId} = req.body;

//         //validating the data
//         if(!clubId || !userId){
//             return resp.status(400).json({
//                 success:false,
//                 message:"Please enter all the details"
//             });
//         }

//         //finding and validating the club by id
//         const clubData = await Club.findById(clubId);

//         //validating the club
//         if(!clubData){
//             return resp.status(400).json({
//                 success:false,
//                 message:"No club found with this id"
//             });
//         }

//         //adding the user to the club members
//         clubData.clubMembers.push(userId);

//         //saving the club
//         await clubData.save();

//         //sending the response
//         resp.status(200).json({
//             success:true,
//             message:"User added to the club members successfully",
//             data:clubData
//         });

//     } catch(err){

//         return resp.status(500).json({
//             success:false,
//             message:"Internal server error while adding the user to the club members"
//         })

//     }

// }



// //controller to remove the club members
// exports.removeClubMembers = async (req , resp)=>{

//         try{

//             //fetching the club id and user id from the request body
//             const {clubId , userId} = req.body;

//             //validating the data
//             if(!clubId || !userId){
//                 return resp.status(400).json({
//                     success:false,
//                     message:"Please enter all the details"
//                 });
//             }

//             //finding and validating the club by id
//             const clubData = await Club.findById(clubId);

//             //validating the club
//             if(!clubData){
//                 return resp.status(400).json({
//                     success:false,
//                     message:"No club found with this id"
//                 });
//             }

//             //removing the user from the club members
//             clubData.clubMembers.pull(userId);

//             //saving the club
//             await clubData.save();

//             //sending the response
//             resp.status(200).json({
//                 success:true,
//                 message:"User removed from the club members successfully",
//                 data:clubData
//             });

//         } catch(err){

//             return resp.status(500).json({
//                 success:false,
//                 message:"Internal server error while removing the user from the club members"
//             })

//         }
// }


//controller to add or remove the club members (in a single controller)
exports.addOrRemoveClubMembers = async (req, resp) => {

    try {

        //fetching the club id and user id from the request body
        //action : add or remove
        const { clubId, email , action } = req.body;


        //validating the data
        if (!clubId || !email || !action) {
            return resp.status(400).json({
                success: false,
                message: "Please enter all the details"
            });
        }

        //finding and validating the club by id
        const clubData = await Club.findById(clubId);

        //validating the club
        if (!clubData) {
            return resp.status(400).json({
                success: false,
                message: "No club found with this id"
            });
        }

        //finding and validating the user by id
        const userData = await User.findOne({ email });

        //validating the user
        if (!userData) {
            return resp.status(400).json({
                success: false,
                message: "No user found with this id"
            });
        }

        //checking the action
        if (action === "add") {

            //checking if the user is already a member of the club
            if (clubData.clubMembers.includes(userData._id)) {
                return resp.status(400).json({
                    success: false,
                    message: "User is already a member of the club"
                });
            }

            //adding the user to the club members
            clubData.clubMembers.push(userData._id);

            //adding the club to the user club membership
            userData.clubMembership.push(clubId);

        } else {

            //checking if the user is not a member of the club
            if (!clubData.clubMembers.includes(userData._id)) {
                return resp.status(400).json({
                    success: false,
                    message: "User is not a member of the club"
                });
            }

            //removing the user from the club members
            clubData.clubMembers.pull(userData._id);

            //removing the club from the user club membership
            userData.clubMembership.pull(clubId);

        }

        //saving the club
        await clubData.save();

        //saving the user
        await userData.save();

        //sending the response
        resp.status(200).json({
            success: true,
            message: "User added/removed from the club members successfully",
            data: clubData
        });

    } catch (err) {

        return resp.status(500).json({
            success: false,
            message: "Internal server error while adding/removing the user from the club members"
        })

    }

}