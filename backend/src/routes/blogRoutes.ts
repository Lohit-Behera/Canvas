import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import {
  createBlog,
  getBlog,
  getAllBlogs,
  getRecentBlogs,
  updateBlog,
} from "../controllers/blogController";

const blogRouter = Router();

blogRouter.post("/create", upload.single("thumbnail"), resizeImage, createBlog);
blogRouter.get("/:blogId", getBlog);
blogRouter.get("/get/all", getAllBlogs);
blogRouter.get("/get/recent", getRecentBlogs);
blogRouter.patch(
  "/update/:blogId",
  upload.single("thumbnail"),
  resizeImage,
  updateBlog
);

export default blogRouter;
