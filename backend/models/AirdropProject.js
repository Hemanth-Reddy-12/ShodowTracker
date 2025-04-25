import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const airdropProjectSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuid,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  link: {
    type: String,
    required: true,
    match: [/^https?:\/\/.*/, "Please enter a valid URL"],
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "closed"],
    required: true,
    trim: true,
    default: "upcoming",
  },
  blockchain: {
    type: String,
  },
  image_url: {
    type: String,
    default: "https://ibb.co/6cnFjN6s",
  },
  eligibility: {
    type: String,
    enum: ["eligible", "ineligible"],
  },
  reward: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

airdropProjectSchema.pre("save", function (next) {
  this.updated_at = Date.now;
  next();
});

export default mongoose.model("AirdropProject", airdropProjectSchema);
