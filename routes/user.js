const express = require("express");

const User = require("../models/User");

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const convertToBase64 = require("../utils/convertToBase64");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const router = express.Router();

// --------------Login Route----------------------
router.post("/user/login", async (req, res) => {
  try {
    //find the user
    const user = await User.findOne({ email: req.body.email });

    //if error in email
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email",
      });
    }

    //generate hash
    const hash = SHA256(req.body.password + user.salt).toString(encBase64);

    //compare the generated hash with the saved one in the database

    if (hash !== user.hash) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    return res.status(200).json({
      _id: user._id,
      token: user.token,
      account: {
        username: user.account.username,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

// ------------------Signup Route----------------------
router.post("/user/signup", fileUpload(), async (req, res) => {
  try {
    //si le username n'est pas renseigné

    if (!req.body.username) {
      return res.status(400).json({
        message: "Please, insert a username",
      });
    }

    //si l'email renseigné à l'inscription existe déjà dans la base de données

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({
        message: "Email already exists, please insert a different email",
      });
    }

    let avatarUrl;

    if (req.files && req.files.picture) {
      // Get the uploaded image
      const avatarPhoto = req.files.picture;

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(
        convertToBase64(avatarPhoto)
      );
      avatarUrl = result.secure_url; // or result.secure_url
    } else {
      // Use a default avatar URL
      avatarUrl =
        "https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg"; // Replace with your default avatar URL
    }

    // //On récupère l'image uploadé
    // const avatarPhoto = req.files.picture;

    // //enregistrer l'image dans Cloudinary
    // const result = await cloudinary.uploader.upload(
    //   convertToBase64(avatarPhoto)
    // );

    //generate salt
    const salt = uid2(64);

    //generate hash
    hash = SHA256(req.body.password + salt).toString(encBase64);

    //generate token
    const token = uid2(64);

    //create new Signup
    const newSignup = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
        avatar: avatarUrl,
      },
      token: token,
      hash: hash,
      salt: salt,
    });

    //save newSignup in dataBase
    await newSignup.save();

    //generate response
    return res.status(201).json({
      _id: newSignup._id,
      token: newSignup.token,
      account: {
        username: newSignup.account.username,
        avatar: avatarUrl,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
