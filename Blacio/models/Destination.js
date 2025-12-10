const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  country: {type: String, required: true},
  description: {type: String},
  rating: {type: Number, default: 0}
});

module.exports = mongoose.model("Destination", destinationSchema, "destinations");
