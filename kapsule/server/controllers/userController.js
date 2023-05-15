const User = require("../models/Users");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);

    // create a token (header, payload, secret)
    const token = createToken(user._id);

    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.signup(username, password);

    // create a token (header, payload, secret)
    const token = createToken(user._id);

    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// upload image
const uploadImg = async (req, res) => {

  try {
    await User.upload(req.body);
    res.status(200).json("successful upload");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// retrieve images
const retrieveImg = async (req, res) => {
  const { username: userId } = req.body;

  try {
    const images = await User.retrieve(userId);
    res.status(200).json(images);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// increase likes to image
const addLikes = async (req, res) => {
  const { username: userId, id: imageId } = req.body;

  try {
    await User.likes(userId, imageId);
    res.status(200).json("likes +1");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// getAllUsers
const getAllImages = async (req, res) => {
  const merge = (first, second) => {
    for (let i = 0; i < second.length; i++) {
      first.push(second[i]);
    }
    return first;
  };

  try {
    var allImages = [];
    const users = await User.allUsers();
    await users.map((user) => merge(allImages, user.images));
    res.status(200).json(allImages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  uploadImg,
  retrieveImg,
  addLikes,
  getAllImages,
};
