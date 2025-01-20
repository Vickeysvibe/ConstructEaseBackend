import express from "express";
import {createProduct,updateProduct,getAllProducts,getProductById,uploadExcel, deleteProduct} from "../Controllers/product.controller.js";

const router = express.Router();

router.post("/create-product", createProduct);
router.put("/update-product/:productId", updateProduct);
router.get("/getAll-product", getAllProducts);
router.get("/getById/:productId", getProductById);
router.post("/upload-product", uploadExcel);
router.delete("/deleteproduct/:productId", deleteProduct); 


export default router;
