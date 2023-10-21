// J'importe mongoose pour pouvoir faire mongoose.model
const mongoose = require("mongoose");

// MODEL OFFER

const Offer = mongoose.model("Offer", {
  product_name: {
    type: String,
    required: true,
  },
  product_description: String,
  product_price: Number,
  product_details: Array,
  product_image: Object,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Export du modèle
module.exports = Offer;
