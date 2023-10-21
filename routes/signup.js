const express = require("express");
// Je ne peux pas utiliser app et je ne peux pas le recréer car ça créerait un serveur dans mon serveur, j'utilise donc express.Router pour déclarer mes routes.
const router = express.Router();
const fileUpload = require("express-fileupload");

// Import du modèle User
const User = require("../models/User");

const uid2 = require("uid2"); // Package qui sert à créer des string aléatoires
const SHA256 = require("crypto-js/sha256"); // Sert à encripter une string
const encBase64 = require("crypto-js/enc-base64"); // Sert à transformer l'encryptage en string

const cloudinary = require("cloudinary").v2;

// Fonction qui permet de transformer nos fichier qu'on reçoit sous forme de Buffer en base64 afin de pouvoir les upload sur cloudinary
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

// ----------- ROUTES SIGNUP -----------
router.post("/user/signup", fileUpload(), async (req, res) => {
  try {
    // Aller regarder dans la collection si je trouve un utilisateur avec cet email

    const userFound = await User.findOne({ email: req.body.email });
    // Si on en trouve un utilisateur => erreur
    if (userFound !== null) {
      // error 409 = conflit
      return res.status(409).json({
        message: "User already exists",
      });
    }
    // On vérifie que le nom d'utilisateur a bien était passé en body
    if (!req.body.username) {
      return res.status(400).json({ message: "Username is required" });
    }
    // On génère un salt
    const salt = uid2(16);
    // console.log("salt =>>>>   ", salt);
    // On génère un hash
    const hash = SHA256(req.body.password + salt).toString(encBase64);
    // console.log("hash    ", hash);
    // On génère un token
    const token = uid2(64);
    // console.log("token    ", token);
    // Je transforme mon image en une string lisible par cloudinary
    const transformedPicture = convertToBase64(req.files.picture);

    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
      },
      newsletter: req.body.newsletter,
      hash: hash,
      salt: salt,
      token: token,
    });

    // J'enregistre toutes les infos qu'on a créées et reçues en BDD SAUF LE MOT DE PASSE
    await newUser.save();
    // Je fais une requête à cloudinary afin qu'il stocke mon image
    const result = await cloudinary.uploader.upload(transformedPicture, {
      folder: `vinted/avatars/${newUser._id}`,
    });
    req.picture = result;
    newUser.account.avatar = req.picture;
    const displayUser = {
      _id: newUser["_id"],
      account: {
        username: newUser["account"]["username"],
      },
      token: newUser["token"],
    };
    // Je répond à l'utilisateur tout sauf le SALT et le HASH car ce sont des données sensibles

    res.status(201).json(displayUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------- SET UP ------------
// Export du router qui contient mes routes
module.exports = router;
