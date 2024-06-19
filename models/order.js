import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    listCart: { type: Array, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "cash" },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);
const Order = mongoose.model("orders", orderSchema);

export default Order;

