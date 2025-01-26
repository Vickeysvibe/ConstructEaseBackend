import express from "express";
import { verifyToken } from "../Middlewares/auth.middleware.js";
import { laborReport } from "../Controllers/reports.controller.js";

const router = express.Router();

router.post("/labourReport", verifyToken, laborReport);

export default router;
