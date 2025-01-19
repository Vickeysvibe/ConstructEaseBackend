import express from "express";
import {
  createSupervisor,
  updateSupervisor,
  getSupervisorsBySite,
  getSupervisorById,
  uploadExcel,
} from "../Controllers/supervisor.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, createSupervisor);

router.put("/update/:supervisorId", verifyToken, updateSupervisor);

router.get("/getsuppervisors/:siteId", verifyToken, getSupervisorsBySite);

router.get("/getbyid/:supervisorId", verifyToken, getSupervisorById);

router.post("/upload", verifyToken, uploadExcel);

export default router;
