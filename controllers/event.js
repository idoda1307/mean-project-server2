const Event = require("../models/event");

exports.createEvent = (req,res,next)=>{
    const event = new Event({
        _id: null,
        title: req.body.title,
        description: req.body.description,
        lat: req.body.location.lat,
        lng: req.body.location.lng,
        creator: req.userData.userId,
        startDate: req.body.dateStarted,
        endDate: req.body.dateEnded
    });
    console.log("event added: " + event);
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
           console.log("error:" + error)
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
  console.log(req.userData.userId);
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
    console.log("delete");
    Event.deleteOne({ _id: req.params.id
       , creator: req.userData.userId
     })
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

  exports.updateEvent = (req, res, next) => {
    console.log("update");
    const event = new Event({
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      lat: req.body.location.lat,
      lng: req.body.location.lng,
      creator: req.userData.userId,
      startDate: req.body.dateStarted,
      endDate: req.body.dateEnded
    });
    Event.updateOne({ _id: req.params.id, creator: req.userData.userId }, event).then(result => {
      console.log("event updated: " + event);
      if(result.nModified > 0) {
        console.log(result);
        res.status(200).json({ message: "Update successful!" });
      } else {
        console.log(result);
        res.status(401).json({ message: "not authorized!" });
      }
    });
  }