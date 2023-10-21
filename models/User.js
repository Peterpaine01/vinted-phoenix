// J'importe mongoose pour pouvoir faire mongoose.model
const mongoose = require("mongoose");

// MODEL USER

const User = mongoose.model("User", {
  email: {
    type: String,
    // required: true,
  },
  account: {
    username: String,
    avatar: Object, // nous verrons plus tard comment uploader une image
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

// Export du modèle
module.exports = User;
