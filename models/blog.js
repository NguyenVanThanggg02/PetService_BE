import mongoose,{ Schema } from "mongoose";

const blogSchema = new Schema({
    content: {
        type: String,
        required: true,  
    },
    images: [
        {
            type: String,
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "comments",
            required: false,
        },
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Tạo model sử dụng schema
const Blog =mongoose.model("blogs", blogSchema);

export default Blog;
