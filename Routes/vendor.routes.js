import express from "express";
import { createVendor, updateVendor, getAllVendors, getVendorById, uploadExcel, deleteVendor } from "../Controllers/vendor.controller.js";

const router = express.Router();

router.post("/createvendor", createVendor);
router.put("/update-vendor/:vendorId", updateVendor);
router.get("/getAllvendor", getAllVendors);
router.get("/getvendorById/:vendorId", getVendorById);
router.post("/upload-vendor", uploadExcel);
router.delete("/deletevendors/:vendorId", deleteVendor);


export default router;
