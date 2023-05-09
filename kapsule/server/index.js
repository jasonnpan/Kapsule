require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");

// cloud
const cloudinary = require("cloudinary").v2;

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDAPISECRET,
});

const PORT = process.env.PORT || 4000;

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/user", userRoutes);

// connects to cluster
mongoose.connect(
  `mongodb+srv://testing:${process.env.DB_PASSWORD}@gallery.megzdat.mongodb.net/account_info?retryWrites=true&w=majority`
);

app.get("/get-signature", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp
    },
    cloudinaryConfig.api_secret
  )
  res.json({ timestamp, signature })
})

app.post("/upload", (req, res) => {
  console.log(req.data);
})

// success message if server runs
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
