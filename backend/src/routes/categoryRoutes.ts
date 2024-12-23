import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import {
  createCategory,
  getAllCategories,
  getAllCategoriesNames,
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

export default categoryRouter;
