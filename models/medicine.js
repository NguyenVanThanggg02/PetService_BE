import mongoose, { Schema } from "mongoose";

const medicineSchema = new Schema({
  name: {
    type: String,
    required: [true, "Medicine name is required"],
    unique: [true, "Medicine name is not duplicate"],
  },
  images: [{ type: String }],
  quantity: {
    type: Number,
  },
  description: {
    type: String,
  },
  pettype: {
    type: String,
  },
}, {
    timestamps:true
});

const Medicine = mongoose.model('medicines', medicineSchema)
export default Medicine