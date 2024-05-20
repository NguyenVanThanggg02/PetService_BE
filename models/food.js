import mongoose, { Schema } from "mongoose";

const foodSchema = new Schema(
  {
    name: {
      type: String,
    },
    image: [{ type: String }],
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
  },
  {
    timestamps: true,
  }
);
const Food = mongoose.model("foods", foodSchema);
export default Food;