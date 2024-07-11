const mongoose = require("mongoose");

const Review = mongoose.model("Review", {
  gameId: String,
  title: String,
  text: String,
});

module.exports = Review;
