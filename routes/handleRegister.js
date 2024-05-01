const express = require('express');
const router = express.Router();
const registerController = require('../controller/handleRegisterController');



router.post('/signup', registerController.handleUserRegistration);
router.post("/login" , registerController.loginController);
router.put('/update', registerController.handleUserUpdation);


// change conflict management

module.exports = router;