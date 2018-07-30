const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: {type: String, required: true},
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true}
});

module.exports = mongoose.model("Event", eventSchema);
