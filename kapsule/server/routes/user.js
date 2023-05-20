const express = require("express");

// controller functions
const {
  signupUser,
  loginUser,
  uploadImg,
  retrieveImg,
  addLikes,
  getAllImages,
  removeImage,
  updateImg,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// upload route
router.post("/upload", uploadImg);

// retrieve route
router.post("/retrieve", retrieveImg);

// likes route
router.post("/likes", addLikes);

// users route
router.post("/allImages", getAllImages);

// delete route
router.post("/delete", removeImage);

// update route
router.post("/update", updateImg);

module.exports = router;
