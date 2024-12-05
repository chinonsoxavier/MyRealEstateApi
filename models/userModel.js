// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    profilePic: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User",UserSchema)