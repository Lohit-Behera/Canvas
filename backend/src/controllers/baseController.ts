import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Product } from "../model/productModel";
import { Blog } from "../model/blogModel";
import { Category } from "../model/categoryModel";

const getCount = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments();
  const blogCount = await Blog.countDocuments();
  const categoryCount = await Category.countDocuments();
  return res
    .status(200)
    .json(new ApiResponse(200, { productCount, blogCount, categoryCount }));
});

export { getCount };
