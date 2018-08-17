const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: {type: String, required: true},
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
    creator: {type: String, required: true},
    startDate: {type: Date, required: true},
   //  endDate: {type: Date, required: true},
    //     // , expires: 0
     // },
    guests: [String],
    imagePath: { type: String, required: true },
    option: { type: String, required: true}
});

module.exports = mongoose.model("Event", eventSchema);
