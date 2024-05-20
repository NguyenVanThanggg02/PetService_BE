import mongoose, { Schema } from "mongoose";

const petSchema = new Schema(
  {
    breed: {
      type: String,
    },
    gender: {
      type: String,
    },
    image: [{ type: String }],
    quantity: {
      type: Number,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Pet = mongoose.model("pet", petSchema);
export default Pet;
