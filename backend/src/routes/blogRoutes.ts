import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import {
  createBlog,
  getBlog,
  getAllBlogs,
  getRecentBlogs,
} from "../controllers/blogController";

const blogRouter = Router();

blogRouter.post("/create", upload.single("thumbnail"), resizeImage, createBlog);
blogRouter.get("/:blogId", getBlog);
blogRouter.get("/get/all", getAllBlogs);
blogRouter.get("/get/recent", getRecentBlogs);

export default blogRouter;
