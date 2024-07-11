const express = require("express");

const router = express.Router();

const fileupload = require("express-fileupload");

const Review = require("../models/Review");

// import de mon middleware
const isAuthenticated = require("../middlewares/isAuthenticated");

// Route to add a review
router.post("/reviews", isAuthenticated, async (req, res) => {
  const { gameId, title, text } = req.body;

  if (!gameId || !title || !text) {
    return res.status(400).send("Game ID, title, and text are required");
  }

  try {
    const review = new Review({ gameId, title, text });
    await review.save();
    res.status(201).send(review);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to get reviews by gameId
router.get("/reviews/:gameId", async (req, res) => {
  const { gameId } = req.params;

  try {
    const reviews = await Review.find({ gameId });
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
