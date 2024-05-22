import mongoose, { Schema } from "mongoose";

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Food name is required"],
      unique: [true, "Food name is not duplicate"],
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