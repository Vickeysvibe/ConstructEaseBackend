import express from "express";
import { createVendor, updateVendor, getAllVendors, getVendorById, uploadExcel } from "../Controllers/vendor.controller.js";

const router = express.Router();

router.post("/create", createVendor);
router.put("/update-vendor/:vendorId", updateVendor);
router.get("/getAll", getAllVendors);
router.get("/getById/:vendorId", getVendorById);
router.post("/upload", uploadExcel);

export default router;
