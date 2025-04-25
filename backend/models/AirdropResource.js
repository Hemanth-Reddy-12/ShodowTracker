import mongoose from "mongoose";

const airdropResourceSchema = mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AirdropProject",
    required: true,
    index: true,
  },
  url: {
    type: String,
    required: true,
    match: [/^https?:\/\/.*/, "Please enter a valid URL"],
  },
  resource_type: {
    type: String,
    required: true,
  },
  added_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AirdropResource", airdropResourceSchema);
