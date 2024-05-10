const express = require('express');
const router = express.Router();
const applicationController = require('../controller/applicationController');

router.get('/getAll', applicationController.getAllApplications);
router.get('/get', applicationController.getParticularApplication);
router.post('/post', applicationController.createApplication);
router.put('/put', applicationController.updateApplication);
router.delete('/delete', applicationController.deleteApplication);
router.post("/addApplicationAttendee", applicationController.addOrRemoveParticipants);
router.post("/changePassword" , applicationController.changePassword);


module.exports = router;