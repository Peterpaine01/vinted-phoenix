const cloudinary = require("cloudinary").v2;

// Je me connecte à mon compte cloudinary avec les identifiants présents sur mon compte
cloudinary.config({
  cloud_name: "djxejhaxr",
  api_key: "751321239949728",
  api_secret: "FC-YNN7ohaaxICISET-mrKy7ERU",
  secure: true,
});

// Fonction qui permet de transformer nos fichier qu'on reçoit sous forme de Buffer en base64 afin de pouvoir les upload sur cloudinary
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

const transformPicture = async (req, res, next) => {
  // Je transforme mon image en une string lisible par cloudinary
  const transformedPicture = convertToBase64(req.files.picture);

  // Je fais une requête à cloudianry afin qu'il stocke mon image
  const result = await cloudinary.uploader.upload(transformedPicture);
  req.picture = result;
  next();
};

module.exports = transformPicture;
