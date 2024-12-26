import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// import routes
import productRouter from "./routes/productRoute";
import blogRouter from "./routes/blogRoutes";
import categoryRouter from "./routes/categoryRoutes";
import baseRouter from "./routes/baseRoutes";

// Routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/base", baseRouter);

export { app };
