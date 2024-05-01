const express = require('express');
const router = express.Router();
const clubController = require('../controller/clubController');

router.get('/getAllClubs', clubController.getAllClubs);
router.get('/getClub', clubController.getParticularClub);
router.post('/createClub', clubController.createClub);
router.put('/updateClub', clubController.updateClub);
router.delete('/deleteClub', clubController.deleteClub);
router.post('/addClubFollower' , clubController.addClubFollowers);
router.post('/removeClubFollower' , clubController.removeClubFollowers);
router.post('/updateClubMember' , clubController.addOrRemoveClubMembers);


module.exports = router;