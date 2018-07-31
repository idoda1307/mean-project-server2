const Event = require("../models/event");
const ObjectId = require("mongodb").ObjectId;

exports.createEvent = (req,res,next)=>{
    const event = new Event({
        _id: null,
        title: req.body.title,
        description: req.body.description,
        lat: req.body.location.lat,
        lng: req.body.location.lng,
        creator: req.userData.userId,
        startDate: req.body.dateStarted,
        endDate: req.body.dateEnded,
        guests: null
    });
    event.save().then(createdEvent=> {
      res.status(201).json({
            message: 'Event added successfully',
            event: {
              ...createdEvent,
              id: createdEvent._id
            }
          });
    })
     .catch(error=>{
         res.status(500).json({
             message: "Creating an event failed!"
           });
     });
};

exports.getEventsList =  (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const eventQuery = Event.find();
  let fetchedEvents;
  if(pageSize && currentPage) {
eventQuery.skip(pageSize* (currentPage-1)).limit(pageSize);
  }
  eventQuery.then(events => {
    fetchedEvents = events;
       return Event.count();
     }).then(count => {
      res.status(200).json({
        message: "Events fetched successfully!",
        events: fetchedEvents,
        maxEvents: count
      });
     }).catch(error => {
      res.status(500).json({
        message: "Fetching events failed!"
      });
    });
}

exports.getEvents =  (req, res, next) => {
  Event.find().then(events => {
       res.status(200).json({
         message: "Events fetched successfully!",
         events: events
       });
     }).catch(error => {
      res.status(500).json({
        message: "Fetching events failed!"
      });
    });
}

exports.getUserEvents =  (req, res, next) => {
  Event.find({creator: req.userData.userId})
  .then(events => {
        res.status(200).json({
          message: "Events fetched successfully!",
          events: events
        });
      }).catch(error => {
       res.status(500).json({
         message: "Fetching events failed!"
       });
     });
}

  exports.getEvent = (req, res, next) => {
    Event.findById(req.params.id).then(event => {
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ message: "Event not found!" });
      }
    });
  }

  exports.deleteEvent = (req, res, next) => {
    const id=req.params.id;
    Event.deleteOne({ _id: ObjectId(id)})
      .then(result => {
       // console.log(result);
        // if(result.n > 0){
          res.status(200).json({ message: "Deletion successful!" });
//       } else {
// res.status(401).json({ message: "Not Authorized!"});
//      } }).catch(error => {
//         res.status(500).json({
//           message: "Deleting event failed!"
//         });
       });
  };
exports.joinEvent = (req, res, next) => {
  console.log(req.body);
Event.findById(req.params.id).then(event => {
  if (event) {
    // if(req.body.guests != null) {
    //   event.guests =
    //   console.log(event.guests);} else {
    //   event.guests = req.body.guests;
    // }
    if(event.guests == null){
      event.guests = req.body.guests;
      Event.updateOne({ _id: req.params.id},{ guests: req.body.guests}).then(result => {
        console.log("event updated: ");
        if(result.nModified > 0) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "not authorized!" });
        }
      });
    } else {
    let guests = req.body.guests.map(g=>ObjectId(g));
    Event.updateOne({ _id: req.params.id}, {$push: {guests: req.body.guests }}).then(result => {
      console.log("event updated: ");
      if(result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "not authorized!" });
      }
    });
  } 
}});}

  exports.updateEvent = (req, res, next) => {
    console.log("update");
    console.log(req.body);
    const event = new Event({
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      lat: req.body.location.lat,
      lng: req.body.location.lng,
      creator: req.userData.userId,
      startDate: req.body.dateStarted,
      endDate: req.body.dateEnded,
      guests: req.body.guests
    });
    if(req.body.guests != null) {
      event.guests =req.body.guests.map(g=>ObjectId(g));
    }
    Event.update({ _id: req.params.id}, {$set: event}).then(result => {
      console.log("event updated: " + event);
      if(result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "not authorized!" });
      }
    });
  }