const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationsController');

router.get('/getAll', notificationController.getAllNotifications);
router.post('/post', notificationController.createNotification);
router.delete('/delete', notificationController.deleteNotification);


module.exports = router;