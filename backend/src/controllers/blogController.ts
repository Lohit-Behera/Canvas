import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadFile } from "../utils/cloudinary";
import { Blog } from "../model/blogModel";
import Joi from "joi";

// create a blog
const createBlog = asyncHandler(async (req, res) => {
  // Joi schema for validation
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    content: Joi.string().required(),
    isPublic: Joi.boolean().required(),
    seoTitle: Joi.string().allow("").optional(),
    seoDescription: Joi.string().allow("").optional(),
    seoKeywords: Joi.string().allow("").optional(),
  });
  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }
  const { title, content, isPublic, seoTitle, seoDescription, seoKeywords } =
    value;

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
    isPublic,
    seoTitle,
    seoDescription,
    seoKeywords,
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
  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .select("_id title thumbnail");
  // validate the blogs
  if (!blogs) {
    return res.status(404).json(new ApiResponse(404, null, "Blogs not found"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "Blogs found successfully"));
});

// get recent 4 blogs
const getRecentBlogs = asyncHandler(async (req, res) => {
  // get all blogs
  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .limit(4)
    .select("_id title thumbnail");
  // validate the blogs
  if (!blogs) {
    return res.status(404).json(new ApiResponse(404, null, "Blogs not found"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, blogs, "Blogs found successfully"));
});

export { createBlog, getBlog, getAllBlogs, getRecentBlogs };
