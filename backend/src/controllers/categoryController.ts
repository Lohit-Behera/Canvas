import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Category } from "../model/categoryModel";
import { uploadFile } from "../utils/cloudinary";

const createCategory = asyncHandler(async (req, res) => {
  // get the data from the request
  const { name, isPublic } = req.body;
  // validate the data
  if (!name || !isPublic) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
  }
  // check if category already exists
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Category already exists"));
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
  // upload image to cloudinary
  const thumbnailUrl = await uploadFile(thumbnail);
  // validate the image url
  if (!thumbnailUrl) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Thumbnail upload failed"));
  }
  // create the category
  const category = await Category.create({
    name,
    thumbnail: thumbnailUrl,
    isPublic,
  });
  // validate the category creation
  const createdCategory = await Category.findById(category._id);
  if (!createdCategory) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Category creation failed"));
  }
  // send the response
  return res
    .status(200)
    .json(
      new ApiResponse(200, createdCategory._id, "Category created successfully")
    );
});

const getAllCategories = asyncHandler(async (req, res) => {
  // get all categories
  const categories = await Category.find();
  // validate the categories
  if (!categories) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Categories not found"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories found successfully"));
});

const getAllCategoriesNames = asyncHandler(async (req, res) => {
  // get all categories
  const categories = await Category.find().select("name");
  // validate the categories
  if (!categories) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Categories not found"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories found successfully"));
});

export { createCategory, getAllCategories, getAllCategoriesNames };
