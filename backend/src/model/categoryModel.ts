import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
});

export const Category = mongoose.model("Category", categorySchema);
