const express = require("express");
const eventController = require("../controllers/event");
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("/createevent" , checkAuth, eventController.createEvent);

router.get("/userevents", checkAuth, eventController.getUserEvents);

router.get("/eventslist",checkAuth,eventController.getEventsList);

router.get("", eventController.getEvents);

router.get("/:id",checkAuth, eventController.getEvent);

router.put("/:id", checkAuth, eventController.updateEvent);

router.delete("/:id", checkAuth, eventController.deleteEvent);

module.exports = router;
