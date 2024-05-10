const express = require('express');
const router = express.Router();
const registerController = require('../controller/handleRegisterController');



router.post('/signup', registerController.handleUserRegistration);
router.post("/login" , registerController.loginController);
router.put('/update', registerController.handleUserUpdation);
router.post("/changePassword" , registerController.changePasswordController);
router.get("/getAllUsers" , registerController.getAllUsers);
router.get("/getUser" , registerController.getUserById);


// change conflict management

module.exports = router;