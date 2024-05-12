const express = require('express');
const router = express.Router();
const registerController = require('../controller/handleRegisterController');
const { authController } = require('../middleware/auth');



router.post('/signup', registerController.handleUserRegistration);
router.post("/login" , registerController.loginController);
router.put('/update', registerController.handleUserUpdation);
router.post("/changePassword" , registerController.changePasswordController);
router.get("/getAllUsers" , registerController.getAllUsers);
router.get("/getUser" , registerController.getUserById);
router.post("/validate" , authController);


// change conflict management

module.exports = router;