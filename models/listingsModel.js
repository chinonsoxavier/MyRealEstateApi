// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    agentId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    condition: { type: String, required: true },
    sqft: { type: Number, required: true },
    bed: { type: Number, required: true },
    bath: { type: Number, required: true },
    kitchen: { type: Number, required: true },
    type: { type: Number, required: true },
    location: { type: String, required: true },
    overview: { type: String, required: true },
    features: { type: String, required: true },
    Images: { type: [String] },
    Videos: { type: [String] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing",listingSchema)