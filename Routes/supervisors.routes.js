import express from "express";
import {
  createSupervisor,
  updateSupervisor,
  getSupervisorsBySite,
  getSupervisorById,
  uploadExcel,
  deleteSupervisor,
} from "../Controllers/supervisor.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";
import onlyForEngineers from "../Middlewares/onlyForEngineers.middleware.js";

const router = express.Router();

router.post("/create", verifyToken,onlyForEngineers, createSupervisor);

router.put("/update/:supervisorId", verifyToken,onlyForEngineers, updateSupervisor);

router.get("/getsuppervisors/:siteId", verifyToken,onlyForEngineers, getSupervisorsBySite);

router.get("/getbyid/:supervisorId", verifyToken,onlyForEngineers, getSupervisorById);

router.post("/upload", verifyToken,onlyForEngineers, uploadExcel);

router.delete("/deletesupervisor/:supervisorId",verifyToken,onlyForEngineers, deleteSupervisor); 

export default router;
