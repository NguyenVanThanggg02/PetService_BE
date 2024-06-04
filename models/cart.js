import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
