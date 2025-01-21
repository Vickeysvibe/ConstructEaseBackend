import express from "express";
import { attendance, getLabours, getSupervisors, updateShift } from "../Controllers/labourAttendance.controller";

const router = express.Router();

router.get("/labours",getLabours);
router.get("/supervisors",getSupervisors);
router.post("/labouratt",attendance);
router.update("/updateshift",updateShift);
