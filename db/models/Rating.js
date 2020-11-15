const mongoose = require("mongoose");

const Rating = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  track: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("rating", Rating);
