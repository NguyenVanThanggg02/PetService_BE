import Blog from "../models/blog.js";

const fetchAllBlogs = async () => {
  try {
    const blogs = await Blog.find().exec();
    return blogs;
  } catch (error) {
    throw new Error(error.toString());
  }
};

const editBlogById = async (id, updatedContent) => {
    try {
      const updatedBlog = await Blog.findOneAndUpdate({ _id: id }, updatedContent, { new: true, runValidators: true }).exec();
      return updatedBlog;
    } catch (error) {
      throw new Error(error.toString());
    }
};


const deleteBlogById = async (id) => {
  try {
    const deletedBlog = await Blog.deleteOne({ _id: id }).exec();
    return deletedBlog;
  } catch (error) {
    throw new Error(error.toString());
  }
};

export default {
  fetchAllBlogs,
  editBlogById,
  deleteBlogById,
};
