import express from "express";
import { createLabour, updateLabour, getAllLabours, getLabourById, uploadExcel } from "../Controllers/labour.controller.js";

const router = express.Router();

router.post("/create", createLabour);
router.put("/update-labour/:labourId", updateLabour);
router.get("/getAll", getAllLabours);
router.get("/getById/:labourId", getLabourById);
router.post("/upload", uploadExcel);
router.delete("/labours/:labourId", deleteLabour); 

export default router;
