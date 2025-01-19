import express from "express";
import {
  createSupervisor,
  updateSupervisor,
  getSupervisorsBySite,
  getSupervisorById,
  uploadExcel,
} from "../Controllers/supervisor.controller.js";

const router = express.Router();

router.post("/create", createSupervisor);

router.put("/update/:supervisorId", updateSupervisor);

router.get("/getsuppervisors/:siteId", getSupervisorsBySite);

router.get("/getbyid/:supervisorId", getSupervisorById);

router.post("/upload", uploadExcel);

export default router;
