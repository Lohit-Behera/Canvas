import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Category } from "../model/categoryModel";
import { uploadFile } from "../utils/cloudinary";
import Joi from "joi";

const createCategory = asyncHandler(async (req, res) => {
  // Joi schema for validation
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    isPublic: Joi.boolean().required(),
  });

  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }
  const { name, isPublic } = value;
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
      new ApiResponse(200, createdCategory, "Category created successfully")
    );
});

const getAllCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = "asc" } = req.query; // Extract query params

  // Build the aggregation pipeline
  const aggregate = Category.aggregate([
    { $match: { isPublic: true } },
    { $sort: { name: sort === "asc" ? 1 : -1 } },
    { $project: { name: 1, thumbnail: 1, isPublic: 1, _id: 1 } },
  ]);

  // Apply pagination using the plugin
  const options = {
    page: parseInt(page.toString(), 10),
    limit: parseInt(limit.toString(), 10),
  };

  const categories = await Category.aggregatePaginate(aggregate, options);

  // Validate the categories
  if (!categories || categories.docs.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Categories not found"));
  }

  // Send the response
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories found successfully"));
});

const getAllCategoriesNames = asyncHandler(async (req, res) => {
  // get all categories
  const categories = await Category.find().select("name").sort({ name: 1 });
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
