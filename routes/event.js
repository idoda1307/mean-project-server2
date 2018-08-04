const express = require("express");
const eventController = require("../controllers/event");
const checkAuth = require('../middleware/check-auth');
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("" , checkAuth,extractFile, eventController.createEvent);

router.get("/userevents", checkAuth, eventController.getUserEvents);

router.get("/eventslist",checkAuth,eventController.getEventsList);

router.get("", eventController.getEvents);

router.get("/:id",checkAuth, eventController.getEvent);

router.put("/:id", checkAuth,extractFile, eventController.updateEvent);

router.put("/updateGuests/:id", checkAuth, eventController.joinEvent);

router.delete("/:id", checkAuth, eventController.deleteEvent);

module.exports = router;
