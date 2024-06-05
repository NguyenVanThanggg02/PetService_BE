import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    text: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pets",
    },
    toyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "toys",
    },
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "medicines",
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foods",
      },
    productId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    }
  },
  {
    timestamps: true,
  }
);
const Comment = mongoose.model("comments", commentSchema);

export default Comment;
export { commentSchema };
