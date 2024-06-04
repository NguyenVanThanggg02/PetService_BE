import mongoose, { Schema } from "mongoose";

// Create a schema for Category object
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: [true, "Product name is not duplicate"],
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mapping to connection
const Category = mongoose.model("category", categorySchema);

export default Category;
