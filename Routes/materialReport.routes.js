import express from 'express';
import { overallMaterialReport, SingleVendorReport } from '../Controllers/materialwiseReport.controller.js';

const router = express.Router();

router.post('/overall-material', overallMaterialReport);

router.post('/vendor-report', SingleVendorReport);

export default router;
