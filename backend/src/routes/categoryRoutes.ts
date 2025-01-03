import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import {
  createCategory,
  getAllCategories,
  getAllCategoriesNames,
  getCategory,
  updateCategory,
} from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.post(
  "/create",
  upload.single("thumbnail"),
  resizeImage,
  createCategory
);
categoryRouter.get("/get/all", getAllCategories);
categoryRouter.get("/get/names", getAllCategoriesNames);
categoryRouter.get("/get/:categoryId", getCategory);
categoryRouter.patch(
  "/update/:categoryId",
  upload.single("thumbnail"),
  resizeImage,
  updateCategory
);

export default categoryRouter;
