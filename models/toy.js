import mongoose, { Schema } from "mongoose";

const toySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Toy name is required"],
      unique: [true, "Toy name is not duplicate"],
    },
    quantity: {
      type: Number,
    },
    description: {
      type: String,
    },
    pettype: {
      type: String,
    },
    images: [{ type: String }],
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
const Toy = new mongoose.model("toys", toySchema);
export default Toy;
