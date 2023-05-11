const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const UsersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
});

// static signup method
UsersSchema.statics.signup = async function (username, password) {
  // validation
  // username or password not entered
  if (!username || !password) {
    throw Error("All fields must be filled");
  }
  // password not long enough / bad configuration
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ username });

  if (exists) {
    throw Error("Username already in use");
  }

  // hashes the user password in the database
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // creates user in the database
  const user = await this.create({ username, password: hash });

  return user;
};

// static login method
UsersSchema.statics.login = async function (username, password) {
  // username or password not entered
  if (!username || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ username });

  // username does not exist
  if (!user) {
    throw Error("Username does not exist");
  }

  // sees if the password given matches the one associated with the
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

// static upload method
UsersSchema.statics.upload = async function (userId, imageId) {
  if (!userId) {
    throw Error("Invalid userId! Please login before continuing.");
  }
  if (!imageId) {
    throw Error("Invalid image format.");
  }

  const user = await this.findOne({ username: userId });

  
  user.images.push(imageId);
  user.save();
};

// static retrieve method
UsersSchema.statics.retrieve = async function (userId) {
  if (!userId) {
    throw Error("Invalid userId! Please login before continuing.");
  }

  const user = await this.findOne({ username: userId });

  return user.images;
};

const UserModel = mongoose.model("users", UsersSchema);
module.exports = UserModel;
