const express = require('express');
const router = express.Router();
const clubController = require('../controller/clubController');
const { auth, isAdmin, isStudent } = require('../middleware/auth');

router.get('/getAllClubs', clubController.getAllClubs);
router.get('/getClub', clubController.getParticularClub);
router.post('/createClub', auth ,  isAdmin , clubController.createClub);
router.put('/updateClub', auth ,  isAdmin , clubController.updateClub);
router.delete('/deleteClub', auth ,  isAdmin , clubController.deleteClub);
router.post('/addClubFollower' , auth , isStudent , clubController.addClubFollowers);
router.post('/removeClubFollower' , auth , isStudent , clubController.removeClubFollowers);
router.post('/updateClubMember' , auth , isAdmin ,clubController.addOrRemoveClubMembers);


module.exports = router;