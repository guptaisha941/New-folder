

const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema({
    name: String,
    lat: Number,
    lng: Number,
    type: String,
    
  });

module.exports = mongoose.model("Location", locationSchema);
