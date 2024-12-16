import { Product } from "../model/productModel";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadFile } from "../utils/cloudinary";

const createProduct = asyncHandler(async (req, res) => {
  // get the data from the request
  const { name, description, affiliateLink, amount, category, quantity } =
    req.body;

  // validate the data
  // Validate required fields
  if (
    !name ||
    !description ||
    !affiliateLink ||
    !amount ||
    !category ||
    !quantity
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
  }

  // Validate data types
  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof affiliateLink !== "string"
  ) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Invalid type for name, description, or affiliateLink"
        )
      );
  }

  if (Number.isNaN(Number(amount)) || Number.isNaN(Number(quantity))) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Amount and quantity must be numbers"));
  }

  // Validate category
  const validCategories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home Appliances",
    "Toys",
  ];
  if (!validCategories.includes(category)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid category"));
  }
  // get image from the request
  const image = req.file;
  // validate the image
  if (!image) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Image is required"));
  }
  if (image.mimetype !== "image/jpeg" && image.mimetype !== "image/png") {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid image format"));
  }
  // upload image to cloudinary
  const imageUrl = await uploadFile(image);
  // validate the image url
  if (!imageUrl) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Image upload failed"));
  }
  // create the product
  const product = await Product.create({
    name,
    description,
    affiliateLink,
    amount: Number(amount),
    category,
    quantity: Number(quantity),
    image: imageUrl,
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

export { createProduct, getProduct };
