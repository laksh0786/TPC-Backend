//importing the models
const Application = require("../model/applicationSchema");
const User = require("../model/userSchema");


//controller to create a new application
exports.createApplication = async (req, resp) => {

    try {

        //fetching the application details from the request body
        const applicationData = req.body;

        //creating the new application
        const application = new Application(applicationData);

        //saving the application
        await application.save();

        //sending the response
        resp.status(201).json({
            success: true,
            message: "Application created successfully",
            application: application
        });

    } catch (error) {

        //sending the error
        resp.status(400).json({
            success: false,
            error: error.message
        });

    }

}


//controller to get all the applications
exports.getAllApplications = async (req, resp) => {

    try {

        //getting all the applications
        const applications = await Application.find();

        //sending the applications
        resp.status(200).json({
            success: true,
            applications: applications
        });

    } catch (error) {

        //sending the error
        resp.status(400).json({
            success: false,
            error: error.message
        });

    }

}


//controller to get a particular application
exports.getParticularApplication = async (req, resp) => {

    try {

        //fetching the application id from the request query
        const { id } = req.query;

        //validating the application id
        if (!id) {
            return resp.status(400).json({
                success: false,
                error: "Application id is required"
            });
        }

        //fetching the application
        const applicationData = await Application.findById(id);


        //checking if the application exists
        if (!applicationData) {
            return resp.status(404).json({
                success: false,
                error: "Application not found"
            });
        }

        //sending the application
        resp.status(200).json({
            success: true,
            application: applicationData
        });

    } catch (error) {

        //sending the error
        resp.status(400).json({
            success: false,
            error: error.message
        });

    }

}


//controller to update a particular application
exports.updateApplication = async (req, resp) => {

    try {
        //fetching the application data from the request body
        const applicationData = req.body;

        //checking the application id
        if (!applicationData.id) {
            return resp.status(400).json({
                success: false,
                error: "Application id is required"
            });
        }


        //checking if the application exists
        const applicationExist = await Application.findById(applicationData.id);

        if (!applicationExist) {
            return resp.status(404).json({
                success: false,
                error: "Application not found"
            });
        }


        //updating the application
        const updatedApplication = await Application.findByIdAndUpdate(applicationData.id, applicationData, { new: true });


        //sending the response
        resp.status(200).json({
            success: true,
            message: "Application updated successfully",
            application: updatedApplication
        });

    } catch (error) {

        //sending the error
        resp.status(400).json({
            success: false,
            error: error.message
        });
    }

}


//controller to delete a particular application
exports.deleteApplication = async (req, resp) => {
    try {

        //fetching the application id from the request body
        const { id } = req.body;

        //deleting the application
        await Application.findByIdAndDelete(id);

        //sending the response
        resp.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });

    } catch (error) {

        //sending the error
        resp.status(400).json({
            success: false,
            error: error.message
        });
    }
}



//controller to add or remove participants to the application
exports.addOrRemoveParticipants = async (req, resp) => {
    
    try{

        //fetching the data from the request body
        //action can be either add or remove
        const { applicationId, userId, action } = req.body;

        //validating the data
        if(!applicationId || !userId || !action){
            return resp.status(400).json({
                success: false,
                message: "Please enter the valid data"
            });
        }

        //finding the application
        const application = await Application.findById({ _id: applicationId });
        
        //if application does not exist
        if(!application){
            return resp.status(400).json({
                success: false,
                message: "Application does not exist"
            });
        }

        //finding the user
        const user = await User.findById({ _id: userId});

        //if user does not exist
        if(!user){
            return resp.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        //if action is add
        if(action === "add"){

            //verifying if the user is already a participant
            if(application.applicationParticipants.includes(userId)){
                return resp.status(400).json({
                    success: false,
                    message: "User is already a participant"
                });
            }

            //adding the participant to the application
            application.applicationParticipants.push(userId);

            //adding the application to the user
            user.applications.push(applicationId);

        }
        else{

            //verifying if the user is not a participant
            if(!application.applicationParticipants.includes(userId)){
                return resp.status(400).json({
                    success: false,
                    message: "User is not a participant"
                });
            }

            //removing the participant from the application
            application.applicationParticipants = application.applicationParticipants.filter(participant => participant !== userId);

            //removing the application from the user
            user.applications = user.applications.filter(application => application !== applicationId);

        }

        //saving the changes
        await application.save();
        await user.save();

        //sending the response
        resp.status(200).json({
            success: true,
            message: "Participants updated successfully"
        });

    } catch(err){

        //sending the error
        resp.status(400).json({
            success: false,
            error: err.message
        });

    }

}
