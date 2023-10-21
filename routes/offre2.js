const express = require("express");
const router = express.Router();

// Import du middleware isAuthenticated
// const isAuthenticated = require("../middlewares/isAuthenticated");

// Import des modèles User et Offer
// const User = require("../models/User");
// const Offer = require("../models/Offer");

// Je me connecte à mon compte cloudinary avec les identifiants présents sur mon compte
cloudinary.config({
  cloud_name: "djxejhaxr",
  api_key: "751321239949728",
  api_secret: "FC-YNN7ohaaxICISET-mrKy7ERU",
  secure: true,
});

// Fonction qui permet de transformer nos fichier qu'on reçoit sous forme de Buffer en base64 afin de pouvoir les upload sur cloudinary
// const convertToBase64 = (file) => {
//   return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
// };

app.post("/upload", async (req, res) => {
  try {
    console.log("OK");
    console.log(req.body);
    res.json("OK");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ----------- ROUTE PUBLISH -----------

// router.post("/offer/publish", fileUpload(), async (req, res) => {
//   try {
//     // console.log(isAuthenticated);
//     // Ici, j'ai accès aux infos de l'utilisateur dans req.user
//     // console.log(req.user);

//     const token = req.header.authorization.replace("Bearer ", "");
//     // Je dois aller chercher dans la collection User, un document dont la clef token contient ma variable token
//     const user = await User.foundOne({ token: token });

//     const { title, description, price, condition, city, brand, size, color } =
//       req.body;

//     // Je transforme mon image en une string lisible par cloudinary
//     const transformedPicture = convertToBase64(req.files.picture);

//     // Je fais une requête à cloudianry afin qu'il stocke mon image
//     const result = await cloudinary.uploader.upload(transformedPicture);

//     const newOffer = new Offer({
//       product_name: title,
//       product_description: description,
//       product_price: price,
//       product_details: [
//         {
//           MARQUE: brand,
//         },
//         {
//           TAILLE: size,
//         },
//         {
//           ÉTAT: condition,
//         },
//         {
//           COULEUR: color,
//         },
//         {
//           EMPLACEMENT: city,
//         },
//       ],
//       product_image: {
//         // ...
//         // informations sur l'image du produit
//         secure_url: result.secure_url,
//         // ...
//       },
//       owner: user,
//     });

//     await newOffer.save();
//     res.status(201).json(newOffer);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// ----------- SET UP ------------
// Export du router qui contient mes routes
module.exports = router;
