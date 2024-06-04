import { Schema, model } from "mongoose";

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
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: "users"  // Giả sử bạn có model User để quản lý thông tin người dùng
        }
    ],
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
const Blog = model("blogs", blogSchema);

export default Blog;
