import { Router } from "express";
import { getCount } from "../controllers/baseController";

const baseRouter = Router();

baseRouter.get("/get/count", getCount);

export default baseRouter;
