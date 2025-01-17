import { Product } from "../model/productModel";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadFile, deleteFile } from "../utils/cloudinary";
import Joi from "joi";

const createProduct = asyncHandler(async (req, res) => {
  // Joi schema for validation
  const ProductSchema = Joi.object({
    name: Joi.string().min(3).max(500).required(),
    productDescription: Joi.string().allow(""),
    productDetail: Joi.string().min(10).max(2000).required(),
    affiliateLink: Joi.string().uri().required(),
    category: Joi.string().required(),
    quantity: Joi.number().integer().positive().required(),
    amount: Joi.number().positive().required(),
    discount: Joi.number().required(),
    sellingPrice: Joi.number().positive().required(),
    isPublic: Joi.boolean().required(),
  });

  // Validate request body
  const { error, value } = ProductSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }

  // Extract validated fields
  const {
    name,
    productDescription,
    productDetail,
    affiliateLink,
    amount,
    discount,
    sellingPrice,
    category,
    quantity,
    isPublic,
  } = value;

  // get thumbnail from the request
  const thumbnail = req.file;
  // validate the image
  if (!thumbnail) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Image is required"));
  }
  if (
    thumbnail.mimetype !== "image/jpeg" &&
    thumbnail.mimetype !== "image/png"
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid image format"));
  }
  // get big image from the request
  const bigImage = req.file;
  // validate the image
  if (!bigImage) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Image is required"));
  }
  if (bigImage.mimetype !== "image/jpeg" && bigImage.mimetype !== "image/png") {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid image format"));
  }
  // upload image to cloudinary
  const thumbnailUrl = await uploadFile(thumbnail);
  const bigImageUrl = await uploadFile(bigImage);
  // validate the image url
  if (!thumbnailUrl || !bigImageUrl) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Image upload failed"));
  }

  // create the product
  const product = await Product.create({
    name,
    productDescription,
    productDetail,
    affiliateLink,
    amount,
    discount,
    sellingPrice,
    category,
    quantity,
    thumbnail: thumbnailUrl,
    isPublic,
    bigImage: bigImageUrl,
  });
  // validate the product creation
  const createdProduct = await Product.findById(product._id);
  if (!createdProduct) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Product creation failed"));
  }
  // send the response
  return res
    .status(201)
    .json(
      new ApiResponse(201, createdProduct._id, "Product created successfully")
    );
});

const getProduct = asyncHandler(async (req, res) => {
  // get product id from the params
  const { productId } = req.params;
  // get the product
  const product = await Product.findById(productId);
  // validate the product
  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product found successfully"));
});

const getAllProducts = asyncHandler(async (req, res) => {
  // Build the aggregation pipeline
  const products = await Product.aggregate([
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        name: 1,
        category: 1,
        thumbnail: 1,
        amount: 1,
        discount: 1,
        sellingPrice: 1,
        isPublic: 1,
      },
    },
  ]);

  // Validate the products
  if (!products || products.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Products not found"));
  }

  // Send the response
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products found successfully"));
});

// get recent 4 products
const getRecentProducts = asyncHandler(async (req, res) => {
  // get recent 4 products
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .limit(4)
    .select("_id name affiliateLink price category image");
  // validate the products
  if (!products) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Products not found"));
  }
  // send the response
  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products found successfully"));
});

// update product
const updateProduct = asyncHandler(async (req, res) => {
  // get product id from the params
  const { productId } = req.params;

  // Joi schema for validation
  const ProductSchema = Joi.object({
    name: Joi.string().optional(),
    productDescription: Joi.string().optional().allow(""),
    productDetail: Joi.string().optional(),
    category: Joi.string().optional(),
    affiliateLink: Joi.string().uri().optional(),
    amount: Joi.number().positive().optional(),
    discount: Joi.number().positive().optional(),
    sellingPrice: Joi.number().positive().optional(),
    quantity: Joi.number().positive().optional(),
    isPublic: Joi.boolean().optional(),
  });

  // Validate request body
  const { error, value } = ProductSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, error.details[0].message));
  }

  // get the product
  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Product not found"));
  }

  // get thumbnail
  const thumbnail = req.file;
  if (thumbnail) {
    deleteFile(product.thumbnail, res); // delete old thumbnail
    const thumbnailUrl = await uploadFile(thumbnail);
    if (!thumbnailUrl) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Image upload failed"));
    }
    product.thumbnail = thumbnailUrl; // update thumbnail
  }

  // Update fields if they are provided and different
  const fieldsToUpdate = [
    "name",
    "productDescription",
    "productDetail",
    "category",
    "affiliateLink",
    "amount",
    "discount",
    "sellingPrice",
    "quantity",
    "isPublic",
  ];

  let hasUpdates = false;

  fieldsToUpdate.forEach((field) => {
    if (value[field] !== undefined && value[field] !== product[field]) {
      product[field] = value[field];
      hasUpdates = true;
    }
  });

  if (!hasUpdates && !thumbnail) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "No fields to update"));
  }

  // Save updated product
  const updatedProduct = await product.save({ validateBeforeSave: false });
  if (!updatedProduct) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Product update failed"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProduct._id, "Product updated successfully")
    );
});
export {
  createProduct,
  getProduct,
  getAllProducts,
  getRecentProducts,
  updateProduct,
};
