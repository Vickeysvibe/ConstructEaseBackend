import express from "express";
import {
  createSupervisor,
  updateSupervisor,
  getSupervisorsBySite,
  getSupervisorById,
  uploadExcel,
  deleteSupervisor,
  getGlobalSupervisors,
  createGloablSupervisor,
} from "../Controllers/supervisor.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, createSupervisor);

router.post("/create-global", verifyToken, createGloablSupervisor);

router.put("/update/:supervisorId", verifyToken, updateSupervisor);

router.get("/getsuppervisors", verifyToken, getSupervisorsBySite);
router.get("/getGlobalSupervisors",verifyToken,getGlobalSupervisors);

router.get("/getbyid/:supervisorId", verifyToken, getSupervisorById);

router.post("/upload", verifyToken, uploadExcel);

router.delete("/deletesupervisor/:supervisorId", deleteSupervisor); 


export default router;
