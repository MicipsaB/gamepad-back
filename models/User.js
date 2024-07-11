const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  account: {
    username: String,
    avatar: Object,
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
