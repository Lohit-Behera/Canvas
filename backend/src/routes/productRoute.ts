import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import {
  createProduct,
  getProduct,
  getAllProducts,
  getRecentProducts,
  updateProduct,
  addMoreImagesToProduct,
} from "../controllers/productController";

const productRouter = Router();
// create product
productRouter.post(
  "/create",
  upload.single("thumbnail"),
  resizeImage,
  createProduct
);
// get one product
productRouter.get("/:productId", getProduct);
// get all products
productRouter.get("/get/all", getAllProducts);
// get recent products
productRouter.get("/get/recent", getRecentProducts);
// update product
productRouter.patch(
  "/update/:productId",
  upload.single("thumbnail"),
  resizeImage,
  updateProduct
);
// add more images to product
productRouter.patch(
  "/add/images/:productId",
  upload.array("images", 5),
  resizeImage,
  addMoreImagesToProduct
);
export default productRouter;
