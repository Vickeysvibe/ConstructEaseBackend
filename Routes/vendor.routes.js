import express from "express";
import {
  createVendor,
  updateVendor,
  getAllVendors,
  getVendorById,
  uploadExcel,
} from "../Controllers/vendor.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, createVendor);
router.put("/update-vendor/:vendorId", verifyToken, updateVendor);
router.get("/getAll", verifyToken, getAllVendors);
router.get("/getById/:vendorId", verifyToken, getVendorById);
router.post("/upload", verifyToken, uploadExcel);

export default router;
