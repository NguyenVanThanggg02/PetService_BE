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
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
        require: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Pet = mongoose.model("pets", petSchema);
export default Pet;
