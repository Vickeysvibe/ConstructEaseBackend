import express from "express";
import { attendance, getLabours, getSupervisors, updateShift } from "../Controllers/labourAttendance.controller";
import { verifyToken } from "../Middlewares/auth.middleware";

const router = express.Router();

router.get("/labours",verifyToken,getLabours);
router.get("/supervisors",verifyToken,getSupervisors);
router.post("/labouratt",verifyToken,attendance);
router.update("/updateshift",verifyToken,updateShift);
