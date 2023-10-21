const express = require("express");
// Je ne peux pas utiliser app et je ne peux pas le recréer car ça créerait un serveur dans mon serveur, j'utilise donc express.Router pour déclarer mes routes.
const router = express.Router();

// Import du modèle User
const User = require("../models/User");

const uid2 = require("uid2"); // Package qui sert à créer des string aléatoires
const SHA256 = require("crypto-js/sha256"); // Sert à encripter une string
const encBase64 = require("crypto-js/enc-base64"); // Sert à transformer l'encryptage en string

router.post("/user/login", async (req, res) => {
  try {
    // Aller regarder dans la collection si je trouve un utilisateur avec cet email
    const userFound = await User.findOne({ email: req.body.email });
    console.log(userFound);
    // userFound = array
    // On extrait l'objet user du tableau userFound
    // On verifie que currentUser existe dans la BDD
    if (!userFound) {
      // si ce n'est pas le cas on retourne un message d'erreur
      return res.status(400).json({
        message: "User doesn't exist. Please sign up.",
      });
    }
    // si c'est le cas on continue

    // on construit le hash avec le mot de passe reçu et le salt de l'utilisateur trouvé
    const hashReceived = SHA256(req.body.password + userFound.salt).toString(
      encBase64
    );

    // on compare le hash de l'utilisateur trouvé avec le has obtenu
    if (hashReceived !== userFound.hash) {
      // Je répond une erreur
      return res.status(400).json({
        message: "Email or Password doesn't match",
      });
    } else {
      const displayUser = {
        _id: userFound["_id"],
        account: {
          username: userFound["account"]["username"],
        },
        token: userFound["token"],
      };
      // Je répond OK au client
      res.status(201).json(displayUser);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------- SET UP ------------
// Export du router qui contient mes routes
module.exports = router;
