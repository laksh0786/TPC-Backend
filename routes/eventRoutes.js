//importing the modules
const express = require('express');

//importing the controller
const eventController = require('../controller/eventController');

//initializing the express router
const router = express.Router();


//routes for the events controller
router.get('/getAllEvents', eventController.getAllClubEvents);
router.get('/getEvent', eventController.getClubEventById);
router.post('/createEvent', eventController.createClubEvent);
router.put('/updateEvent', eventController.updateClubEvent);
router.delete('/deleteEvent', eventController.deleteClubEvent);
router.post('/updateEventAttendee', eventController.addorRemoveAttendees);


//exporting the router
module.exports = router;



