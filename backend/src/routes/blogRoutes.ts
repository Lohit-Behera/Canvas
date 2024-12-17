import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware";
import { resizeImage } from "../middlewares/resizeMiddleware";
import { createBlog, getBlog } from "../controllers/blogController";

const blogRouter = Router();

blogRouter.post("/create", upload.single("thumbnail"), resizeImage, createBlog);
blogRouter.get("/:blogId", getBlog);

export default blogRouter;
