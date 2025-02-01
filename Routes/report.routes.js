import express from "express";
import { paymentReport } from "../Controllers/paymentReport.controller.js";

const router = express.Router();

router.post("/paymentreport",paymentReport);

export default router;