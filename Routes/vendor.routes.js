import express from "express";
import { createVendor, updateVendor, getAllVendors, getVendorById, uploadExcel, deleteVendor } from "../Controllers/vendor.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createvendor",verifyToken, createVendor);
router.put("/update-vendor/:vendorId",verifyToken, updateVendor);
router.get("/getAllvendor", getAllVendors);
router.get("/getvendorById/:vendorId",verifyToken, getVendorById);
router.put("/upload-vendor",verifyToken, uploadExcel);
router.delete("/deletevendors/:vendorId",verifyToken, deleteVendor);


export default router;
