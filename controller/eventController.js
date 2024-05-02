const ClubEvent = require('../model/clubEventSchema');
const Club = require("../model/clubSchema");
const User = require("../model/userSchema");
const { newEventNotificationEmail } = require('../mail/template/eventCreatedEmail');
const mailSender = require('../config/mailSender');


//a function to send email
async function emailSenderFunction(name, eventName, eventDate, eventDetails, clubName , email) {

    try {

        // console.log(registerationConfirmation);
        const mailResponse = await mailSender(email, "Verification Email From UPC MRSPTU Bathinda", newEventNotificationEmail(name , eventName, eventDate , eventDetails, clubName));
        console.log("Email sent successfully : ", mailResponse);
    }

    catch (err) {
        console.log("Errror occured while sending email : ", err);
        throw err;
    }

}


//creating new club event
exports.createClubEvent = async (req, res) => {

    try {

        //fetching the club event details from the request body
        const { clubId, eventName, eventDescription, eventDate, eventTime, eventVenue, eventHeadName, eventHeadContact, eventLink } = req.body;

        //validating the data
        if (!clubId || !eventName || !eventDescription || !eventDate || !eventTime || !eventVenue) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the details"
            });
        }

        //checking if the club exists
        const clubData = await Club.findById({ _id: clubId }).populate("clubMembers").populate("clubFollowers");

        //if club does not exist
        if (!clubData) {
            return res.status(400).json({
                success: false,
                message: "Club does not exist"
            });
        }

        //creating the new club event 
        const newClubEvent = new ClubEvent({
            clubId,
            eventName,
            eventDescription,
            eventDate,
            eventTime,
            eventVenue,
            eventHeadName,
            eventHeadContact,
            eventLink
        });


        //saving the new club event
        await newClubEvent.save();


        //sending the mail to all the club members and followers
        const allClubMembers = [...clubData.clubMembers, ...clubData.clubFollowers];

        for(const member of allClubMembers){

            const { email, name } = member;

            //sending the mail
            await emailSenderFunction(name, eventName, eventDate, eventDescription, clubData.clubName, email);

        }
        



        //adding the reference of the club event to the club
        clubData.clubEventsList.push(newClubEvent._id);

        //saving the club
        await clubData.save();

        //sending the response
        res.status(201).json({
            success: true,
            message: "Club Event created successfully",
            newClubEvent,
            clubData
        });

    } catch (err) {

    }

}


//removing the club event
exports.deleteClubEvent = async (req, res) => {

    try {

        //fetching the club event id from the request query
        const { clubId, eventId } = req.query;

        //validating the data
        if (!eventId) {
            return res.status(400).json({
                success: false,
                message: "Please enter the valid event id"
            });
        }

        //finding the club event
        const clubEvent = await ClubEvent.findById({ _id: eventId });


        //if club event does not exist
        if (!clubEvent) {
            return res.status(400).json({
                success: false,
                message: "Club Event does not exist"
            });
        }

        //fetching the club data
        const clubData = await Club.findById({ _id: clubId });

        //if club does not exist
        if (!clubData) {
            return res.status(400).json({
                success: false,
                message: "Club does not exist"
            });
        }

        //removing the reference of the club event from the club
        clubData.clubEventsList.pull(clubEvent._id);

        //removing the club event
        await clubEvent.remove();


    } catch (err) {

        return res.status(500).json({
            success: false,
            message: "Internal Server Error while deleting the club event"
        });

    }

}


//fetching all the club events
exports.getAllClubEvents = async (req, resp) => {

    try {

        //fetching all the club events
        const clubEvents = await ClubEvent.find({}).populate("clubId").populate("eventAttendees");

        //sending the response
        resp.status(200).json({
            success: true,
            message: "All Club Events",
            clubEvents
        });

    } catch (err) {
        return resp.status(500).json({
            success: false,
            message: "Internal Server Error while fetching the club events"
        });
    }
}



//fetching the club event by id
exports.getClubEventById = async (req, resp) => {

    try {

        //fetching the club event id from the request query
        const { eventId } = req.query;

        //validating the data
        if (!eventId) {
            return resp.status(400).json({
                success: false,
                message: "Please enter the valid event id"
            });
        }

        //finding the club event
        const clubEvent = await ClubEvent.findById({ _id: eventId }).populate("clubId").populate("eventAttendees");

        //if club event does not exist
        if (!clubEvent) {
            return resp.status(400).json({
                success: false,
                message: "Club Event does not exist"
            });
        }

        //sending the response
        resp.status(200).json({
            success: true,
            message: "Club Event",
            clubEvent
        });

    } catch (err) {
        return resp.status(500).json({
            success: false,
            message: "Internal Server Error while fetching the club event"
        });
    }

}



//updating the club event
exports.updateClubEvent = async (req, resp) => {

    try {

        //fetching the data from the request body
        const { eventId, eventName, eventDescription, eventDate, eventTime, eventVenue, eventHeadName, eventHeadContact, eventLink } = req.body;

        //validating the data
        if (!eventId) {
            return resp.status(400).json({
                success: false,
                message: "Please enter the valid event id"
            });
        }

        //check if the club event exists
        const clubEventData = await ClubEvent.findById({ _id: eventId });

        //if club event does not exist
        if (!clubEventData) {
            return resp.status(400).json({
                success: false,
                message: "Club Event does not exist"
            });
        }

        //updating the club event
        const clubEvent = await ClubEvent.findByIdAndUpdate({ _id: eventId }, {
            eventName: eventName || clubEventData.eventName,
            eventDescription : eventDescription || clubEventData.eventDescription,
            eventDate : eventDate || clubEventData.eventDate,
            eventTime : eventTime || clubEventData.eventTime,
            eventVenue : eventVenue || clubEventData.eventVenue,
            eventHeadName : eventHeadName || clubEventData.eventHeadName,
            eventHeadContact : eventHeadContact || clubEventData.eventHeadContact,
            eventLink : eventLink || clubEventData.eventLink
        }, { new: true });

        
        //sending the response
        resp.status(200).json({
            success: true,
            message: "Club Event updated successfully",
            clubEvent
        });


    } catch (err) {
        return resp.status(500).json({
            success: false,
            message: "Internal Server Error while updating the club event"
        });
    }

}



//adding or removing the attendees to the club event
exports.addorRemoveAttendees = async (req, resp) => {

    try {

        //fetching the data from the request body
        //action can be either add or remove
        const { eventId, userId, action } = req.body;

        //validating the data
        if (!eventId || !userId || !action) {
            return resp.status(400).json({
                success: false,
                message: "Please enter the valid data"
            });
        }

        //finding the club event
        const clubEvent = await ClubEvent.findById({ _id: eventId });


        //if club event does not exist
        if (!clubEvent) {
            return resp.status(400).json({
                success: false,
                message: "Club Event does not exist"
            });
        }

        //finding the user
        const user = await User.findById({ _id: userId});

        //if user does not exist
        if (!user) {
            return resp.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        //if action is add
        if (action === "add") {

            //checking if the user is already an attendee
            if (clubEvent.eventAttendees.includes(userId)) {
                return resp.status(400).json({
                    success: false,
                    message: "User is already an attendee"
                });
            }

            //adding the attendee to the club event
            clubEvent.eventAttendees.push(userId);

            //adding the reference of the club event to the user
            user.clubEvents.push(clubEvent._id);

        }
        else {

            //checking if the user is not an attendee
            if (!clubEvent.eventAttendees.includes(userId)) {
                return resp.status(400).json({
                    success: false,
                    message: "User is not an attendee"
                });
            }

            //removing the attendee from the club event
            clubEvent.eventAttendees.pull(userId);

            //removing the reference of the club event from the user
            user.clubEvents.pull(clubEvent._id);
        }

        //saving the club event
        await clubEvent.save();

        //saving the user
        await user.save();

        //sending the response
        resp.status(200).json({
            success: true,
            message: "Attendees updated successfully",
            clubEvent
        });

    } catch (err) {

        return resp.status(500).json({
            success: false,
            message: "Internal Server Error while updating the attendees"
        });

    }

}