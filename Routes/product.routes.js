import express from "express";
import {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  uploadExcel,
  deleteProduct,
} from "../Controllers/product.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, createProduct); //tested
router.put("/update/:productId", verifyToken, updateProduct); //tested
router.get("/getAll", verifyToken, getAllProducts);
router.get("/getById/:productId", verifyToken, getProductById);
router.post("/upload", verifyToken, uploadExcel);
router.delete("/deleteproduct/:productId", verifyToken, deleteProduct);

export default router;
