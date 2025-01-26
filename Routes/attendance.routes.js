import express from "express";
import { attendance, getLabours, getSupervisors, updateShift } from "../Controllers/labourAttendance.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.get("/labours",verifyToken,getLabours);
router.get("/supervisors",verifyToken,getSupervisors);
router.post("/labouratt",verifyToken,attendance);
router.put("/updateshift",verifyToken,updateShift);

export default router;