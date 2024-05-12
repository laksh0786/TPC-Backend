//importing the modules
const express = require('express');

//importing the controller
const eventController = require('../controller/eventController');
const { isAdmin, auth, isStudent } = require('../middleware/auth');

//initializing the express router
const router = express.Router();


//routes for the events controller
router.get('/getAllEvents', eventController.getAllClubEvents);
router.get('/getEvent', eventController.getClubEventById);
router.post('/createEvent', auth , isAdmin ,  eventController.createClubEvent);
router.put('/updateEvent', auth , isAdmin ,eventController.updateClubEvent);
router.delete('/deleteEvent', auth , isAdmin ,eventController.deleteClubEvent);
router.post('/updateEventAttendee', auth , isStudent ,eventController.addorRemoveAttendees);


//exporting the router
module.exports = router;



