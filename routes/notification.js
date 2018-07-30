const express = require("express");
const notificationController = require("../controllers/notification");
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("/send",checkAuth,notificationController.sendNotification);
router.post("/add",checkAuth,notificationController.addPushSubscriber)

module.exports = router;
