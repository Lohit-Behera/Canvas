import { Product } from "../model/productModel";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadFile } from "../utils/cloudinary";

const createProduct = asyncHandler(async (req, res) => {
  // get the data from the request
  const { name, description, affiliateLink, price, category, quantity } =
    req.body;

  // validate the data
  // Validate required fields
  if (
    !name ||
    !description ||
    !affiliateLink ||
    !price ||
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

  if (Number.isNaN(Number(price)) || Number.isNaN(Number(quantity))) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Price and quantity must be numbers"));
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
    price: Number(price),
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

const getAllProducts = asyncHandler(async (req, res) => {
  // get all products
  const products = await Product.find()
    .sort({ createdAt: -1 })
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

export { createProduct, getProduct, getAllProducts, getRecentProducts };
