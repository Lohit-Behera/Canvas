import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadFile } from "../utils/cloudinary";
import { Blog } from "../model/blogModel";

// create a blog
const createBlog = asyncHandler(async (req, res) => {
  // get the data from the request
  const { title, content } = req.body;
  // validate the data
  if (!title || !content) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
  }
  if (title.length < 3) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Title must be at least 3 characters"));
  }
  if (content.length < 10) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Content must be at least 10 characters")
      );
  }

  // get thumbnail from the request
  const thumbnail = req.file;
  if (!thumbnail) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Thumbnail is required"));
  }
  if (
    thumbnail.mimetype !== "image/jpeg" &&
    thumbnail.mimetype !== "image/png"
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid image format"));
  }
  // upload thumbnail to cloudinary
  const thumbnailUrl = await uploadFile(thumbnail);
  // validate the thumbnail url
  if (!thumbnailUrl) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Image upload failed"));
  }
  // create the blog
  const blog = await Blog.create({
    title,
    content,
    thumbnail: thumbnailUrl,
  });
  // validate the blog creation
  const createdBlog = await Blog.findById(blog._id);
  if (!createdBlog) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Blog creation failed"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, blog._id, "Blog created successfully"));
});

// get blog
const getBlog = asyncHandler(async (req, res) => {
  // get blog id from the params
  const { blogId } = req.params;
  // get the blog
  const blog = await Blog.findById(blogId);
  // validate the blog
  if (!blog) {
    return res.status(404).json(new ApiResponse(404, null, "Blog not found"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, blog, "Blog found successfully"));
});

// get all blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  // get all blogs
  const blogs = await Blog.find();
  // validate the blogs
  if (!blogs) {
    return res.status(404).json(new ApiResponse(404, null, "Blogs not found"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "Blogs found successfully"));
});

export { createBlog, getBlog, getAllBlogs };
