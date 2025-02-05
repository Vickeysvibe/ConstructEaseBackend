import express from "express";
import { verifyToken } from "../Middlewares/auth.middleware.js";
import { laborReport } from "../Controllers/reports.controller.js";
import { paymentReport } from "../Controllers/paymentReport.controller.js";
import { overallMaterialReport, SingleVendorReport } from '../Controllers/materialwiseReport.controller.js';



const router = express.Router();

router.post("/labourReport", verifyToken, laborReport);
router.post("/paymentreport",verifyToken,paymentReport);
router.post('/vendor-report', verifyToken,SingleVendorReport);
router.post('/overall-material',verifyToken, overallMaterialReport);


export default router;
