const express = require("express");

// controller functions
const {
  signupUser,
  loginUser,
  uploadImg,
  retrieveImg,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// upload route
router.post("/upload", uploadImg);

// retrieve route
router.post("/retrieve", retrieveImg)

module.exports = router;
