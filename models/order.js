import mongoose, { Schema } from "mongoose";
import OrderItem from "./orderItem.js";

const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderItems",
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "VnPay"],
      default: "COD",
    },
    status: {
      type: String,
      enum: [
        "Loading",
        "Pending",
        "Processing",
        "Completed",
        "Cancel",
        "Transfer",
      ],
      default: "Pending",
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("orders", orderSchema);
export default Order;
