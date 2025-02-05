import express from "express";
import {
  attendance,
  getLabours,
  getSupervisors,
  todayAttendance,
  updateShift,
} from "../Controllers/labourAttendance.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";
import { paymentReport } from "../Controllers/paymentReport.controller.js";
import verifySite from "../Middlewares/verifysite.middleware.js";

const router = express.Router();

router.get("/labours", verifyToken,verifySite, getLabours);
router.get("/supervisors", verifyToken,verifySite, getSupervisors);
router.post("/labouratt", verifyToken,verifySite, attendance);
router.put("/updateshift", verifyToken,verifySite, updateShift);
router.get("/todayAttendance",verifyToken,verifySite,todayAttendance)

export default router;
