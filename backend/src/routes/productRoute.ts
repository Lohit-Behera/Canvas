import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import { createProduct, getProduct } from "../controllers/productController";

const productRouter = Router();

productRouter.post(
  "/create",
  upload.single("image"),
  resizeImage,
  createProduct
);
productRouter.get("/:productId", getProduct);

export default productRouter;
