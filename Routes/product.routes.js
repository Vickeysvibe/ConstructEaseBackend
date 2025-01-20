import express from "express";
import {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  uploadExcel,
} from "../Controllers/product.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-product", verifyToken, createProduct);
router.put("/update-product/:productId", verifyToken, updateProduct);
router.get("/getAll-product", verifyToken, getAllProducts);
router.get("/getById/:productId", verifyToken, getProductById);
router.post("/upload-product", verifyToken, uploadExcel);

export default router;
