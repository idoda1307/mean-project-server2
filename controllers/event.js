const Event = require("../models/event");
const ObjectId = require("mongodb").ObjectId;

exports.createEvent = (req,res,next)=>{
  const url = "https://arcane-gorge-90547.herokuapp.com";
 // const url = req.protocol + "://" + req.get("host");
  console.log(req.body);
  console.log(req.userData);
  console.log("url: " + url);
    const event = new Event({
        _id: null,
        title: req.body.title,
        description: req.body.description,
        lat: req.body.lat,
        lng: req.body.lng,
        creator: req.userData.userName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        guests: null,
        imagePath: url + "/images/" + req.file.filename,
    });
    event.save().then(createdEvent=> {
      console.log(createdEvent);
      res.status(201).json({
            message: 'Event added successfully',
            event: {
              ...createdEvent,
              id: createdEvent._id
            }
          });
    })
     .catch(error=>{
       console.log(error);
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
       console.log(count);
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
  Event.find()
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
        console.log(event);
        res.status(200).json(event);
      } else {
        res.status(404).json({ message: "Event not found!" });
      }
    }).catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Fetching events failed!"
      });
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
  console.log('join to event');
Event.findById(req.params.id).then(event => {
  if (event) {
    // if(req.body.guests != null) {
    //   event.guests =
    //   console.log(event.guests);} else {
    //   event.guests = req.body.guests;
    // }
    // 
    //   Event.updateOne({ _id: req.params.id},{ guests: req.body.guests}).then(result => {
    //     console.log("event updated: ");
    //     if(result.nModified > 0) {
    //       res.status(200).json({ message: "Update successful!" });
    //     } else {
    //       res.status(401).json({ message: "not authorized!" });
    //     }
    //   });
    // } else {
   // let guests = req.body.guests.map(g=>ObjectId(g));
   if(event.guests == null){
       event.guests = [];
       const guest = req.body;
       Event.updateOne({ _id: req.params.id},{ guests: guest}).then(result => {
             if(result.nModified > 0) {
               res.status(200).json({ message: "Update successful!" });
             } else {
               res.status(401).json({ message: "not authorized!" });
             }
           }).catch(error => {
            res.status(500).json({
              message: error
            });
          });
    } else {
    Event.updateOne({ _id: req.params.id}, {$push: {guests: req.body }}).then(result => {
      if(result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "not authorized!" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: error
      });
    });
  } }
});
}

  exports.updateEvent = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = "https://arcane-gorge-90547.herokuapp.com";
     // const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    console.log("update");
    const event = new Event({
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      lat: req.body.lat,
      lng: req.body.lng,
      creator: req.userData.userName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      guests: req.body.guests,
      imagePath: imagePath
    });
    Event.update({ _id: req.params.id, creator: req.userData.userName}, {$set: event}).then(result => {
      console.log("event updated: " + event);
      if(result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "not authorized!" });
      }
    });
  }