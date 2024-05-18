const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationsController');
const { isAdmin, auth } = require('../middleware/auth');

router.get('/getAll', notificationController.getAllNotifications);
router.post('/post', auth , isAdmin , notificationController.createNotification);
router.delete('/delete', auth , isAdmin ,notificationController.deleteNotification);
router.put('/update', auth , isAdmin ,notificationController.updateNotification);
router.get('/get', notificationController.getSingleNotification);


module.exports = router;