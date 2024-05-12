const express = require('express');
const router = express.Router();
const applicationController = require('../controller/applicationController');
const { isAdmin, auth, isStudent } = require('../middleware/auth');

router.get('/getAll', applicationController.getAllApplications);
router.get('/get', applicationController.getParticularApplication);
router.post('/post', auth , isAdmin ,applicationController.createApplication);
router.put('/put', auth , isAdmin ,applicationController.updateApplication);
router.delete('/delete', auth , isAdmin ,applicationController.deleteApplication);
router.post("/addorRemoveApplicationAttendee", auth , isStudent ,applicationController.addOrRemoveParticipants);


module.exports = router;