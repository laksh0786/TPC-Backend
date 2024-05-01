//importing the schema
const NotificationModel = require("../model/notificationSchema");


//controller to get all the notifications
exports.getAllNotifications = async (req , resp)=>{
    
    try {
        
        //getting all the notifications
        const notifications = await NotificationModel.find();
        
        //sending the notifications
        resp.status(200).json({
            success:true,
            notifications:notifications
        });
    
    } catch (error) {
        
        //sending the error
        resp.status(400).json({
            success:false,
            error:error.message
        });
    
    }

}


//controller to create a new notification
exports.createNotification = async (req, resp)=>{

    try{

        //fetching the notification details from the request body
        const {type, message, link} = req.body;

        //creating the new notification
        const notification = new NotificationModel({
            type,
            message,
            link
        });

        //saving the notification
        await notification.save();

        //sending the response
        resp.status(201).json({
            success:true,
            message:"Notification created successfully",
            notification:notification
        });

    } catch(error){

        //sending the error
        resp.status(400).json({
            success:false,
            error:error.message
        });

    }

}


//controller to delete a notification
exports.deleteNotification = async (req , resp)=>{

    try{

        //fetching the notification id from the request body
        const {id} = req.body;

        //deleting the notification
        await NotificationModel.findByIdAndDelete(id);

        //sending the response
        resp.status(200).json({
            success:true,
            message:"Notification deleted successfully"
        });

    } catch(error){

        //sending the error
        resp.status(400).json({
            success:false,
            error:error.message
        });

    }

}
