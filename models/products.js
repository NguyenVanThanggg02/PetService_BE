import mongoose, { Schema } from "mongoose";

const productsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: [true, "Product name is not duplicate"],
    },
    image: { type: String },
    quantity: {
      type: Number,
    },
    description: {
      type: String,
    },
    pettype: {
      type: String,
    },
    comments: [
        {
          type: Schema.Types.ObjectId,
          ref: "comments",
          require: false,
        },
      ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("products", productsSchema);

export default Products;