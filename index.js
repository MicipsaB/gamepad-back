require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

//Import des routes
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

//Utilisation des routes
app.use(reviewRoutes);
app.use(userRoutes);

app.all("*", (req, res) => {
  res.status(404).json("Page not found");
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
