const express = require("express");
const fileUpload = require("express-fileupload");
const router = express.Router();

// Import du modèle Offer
const Offer = require("../models/Offer");

// Import du middleware isAuthenticated
const isAuthenticated = require("../middlewares/isAuthenticated");

const cloudinary = require("cloudinary").v2;

// Fonction qui permet de transformer nos fichier qu'on reçoit sous forme de Buffer en base64 afin de pouvoir les upload sur cloudinary
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

// ----------- ROUTE CREATE OFFER ------------

router.post(
  "/offer/publish",
  fileUpload(),
  isAuthenticated,
  async (req, res) => {
    try {
      // console.log(req.user);

      // Je transforme mon image en une string lisible par cloudinary
      const transformedPicture = convertToBase64(req.files.picture);

      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          {
            MARQUE: brand,
          },
          {
            TAILLE: size,
          },
          {
            ÉTAT: condition,
          },
          {
            COULEUR: color,
          },
          {
            EMPLACEMENT: city,
          },
        ],
        owner: req.user,
      });

      await newOffer.save();
      // Je fais une requête à cloudianry afin qu'il stocke mon image
      const result = await cloudinary.uploader.upload(transformedPicture, {
        folder: `vinted/offers/${newOffer._id}`,
      });
      req.picture = result;
      newOffer.product_image = req.picture;
      res.status(201).json(newOffer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ----------- ROUTE UPDATE OFFER ------------

router.put(
  "/offer/update/:id",
  fileUpload(),
  isAuthenticated,
  async (req, res) => {
    try {
      const offerToUpdate = await Offer.findById(req.params.id);
      console.log(offerToUpdate);

      // const { title, description, price, condition, city, brand, size, color } =
      //   req.body;

      // // Je transforme mon image en une string lisible par cloudinary
      // const transformedPicture = convertToBase64(req.files.picture);

      offerToUpdate.title = title;
      offerToUpdate.title = title;
      offerToUpdate.title = title;
      offerToUpdate.title = title;
      offerToUpdate.title = title;
      offerToUpdate.title = title;
      offerToUpdate.title = title;
      offerToUpdate.title = title;
      offerToUpdate.product_image = title;

      res.status(201).json("Ok");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ----------- ROUTE DELETE OFFER ------------

// ----------- ROUTE SORT OFFER ------------

router.get("/offers", async (req, res) => {
  try {
    const { search, priceMin, priceMax, sort, page, displayedOffers } =
      req.query;

    const searchRegexp = new RegExp(search, "i"); // Permet de créer une RegExp

    let findQueries = {};
    let sortQuery = {};
    let skipNum = 0;
    let limitNum = 3;
    let pageToSend = 1;

    if (search) {
      findQueries.product_name = searchRegexp;
      findQueries.product_description = searchRegexp;
      // findQueries.product_details = searchRegexp;
    }
    if (priceMin) {
      findQueries.product_price = { $gte: +priceMin };
    }
    if (priceMax) {
      if (priceMin && priceMax) {
        findQueries.product_price["$lte"] = +priceMax;
      } else {
        findQueries.product_price = { $lte: +priceMax };
      }
    }
    if (sort) {
      sortQuery.product_price = sort;
    }

    if (page) {
      pageToSend = page;
      if (displayedOffers) {
        limitNum = +displayedOffers;
        skipNum = limitNum * (pageToSend - 1);
      }
    }
    console.log(skipNum);
    const offers = await Offer.find(findQueries)
      .sort(sortQuery)
      .skip(skipNum)
      .limit(limitNum)
      .select("product_name product_price");

    const numberOfOffers = await Offer.countDocuments(findQueries);

    res.json({ count: numberOfOffers, offers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ----------- SET UP ------------
// Export du router qui contient mes routes
module.exports = router;

// const offers = await Offer.find({
//   product_name: searchRegexp,
//   product_description: searchRegexp,
//   // product_price: { $gte: minPrice, $lte: maxPrice },
// })
//   .sort()
//   .skip()
//   .limit()
//   .select("product_name product_price");
