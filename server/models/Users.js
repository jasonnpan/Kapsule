const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const imageSchema = new mongoose.Schema({
  author: { type: String },
  id: { type: String },
  description: { type: String },
  public: { type: Boolean },
  tags: [{ type: String }],
  likes: { type: Number },
  date: { type: Date },
});

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
  profile: {
    type: String,
  },
  images: [imageSchema],
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
  const user = await this.create({ username, password: hash, profile: "" });

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
UsersSchema.statics.upload = async function (imageInfo) {
  const {
    username: userId,
    id: imageId,
    description: desc,
    public: publ,
    tags: tags,
    date: date,
  } = imageInfo;

  if (!userId) {
    throw Error("Invalid userId! Please login before continuing.");
  }

  const user = await this.findOne({ username: userId });

  const image = {
    author: userId,
    id: imageId,
    description: desc,
    public: publ,
    tags: tags,
    likes: 0,
    date: date,
  };

  user.images.push(image);
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

// static addLikes method
UsersSchema.statics.likes = async function (userId, imageId) {
  if (!userId) {
    throw Error("Invalid userId! Please login before continuing.");
  }
  if (!imageId) {
    throw Error("Invalid image.");
  }

  const user = await this.findOne({ username: userId });
  const userImage = user.images.find((element) => element.id == imageId);

  userImage.likes += 1;
  user.save();
};

// static users method
UsersSchema.statics.allUsers = async function () {
  return this.find();
};

// static delete method
UsersSchema.statics.delete = async function (userId, imageId) {
  if (!userId) {
    throw Error("Invalid userId! Please login before continuing.");
  }
  if (!imageId) {
    throw Error("Invalid image.");
  }
  const user = await this.findOne({ username: userId });
  const userImage = user.images.find((element) => element.id == imageId);

  user.images.pull(userImage);
  user.save();
};

// static update method
UsersSchema.statics.updateImage = async function (imageInfo) {
  const {
    username: userId,
    id: imageId,
    description: desc,
    public: publ,
    tags: tags,
    date: date,
  } = imageInfo;

  if (!userId) {
    throw Error("Invalid userId! Please login before continuing.");
  }

  const user = await this.findOne({ username: userId });
  const userImage = user.images.find((element) => element.id == imageId);
  const index = user.images.indexOf(userImage);

  const newImage = {
    author: userImage.author,
    id: userImage.id,
    description: desc,
    public: publ,
    tags: tags,
    likes: userImage.likes,
    date: date,
  };

  user.images[index] = newImage;
  user.save();
};

// static uploadProfile
UsersSchema.statics.uploadProfile = async function (info) {
  const { username: userId, profile: profile } = info;

  if (!userId) {
    throw Error("Invalid userId! Please login before continuing.");
  }

  const filter = { username: userId };
  const update = { profile: profile };
  await this.findOneAndUpdate(filter, update);
};

const UserModel = mongoose.model("users", UsersSchema);
module.exports = UserModel;
