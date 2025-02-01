import express from "express";
import {
  createLabour,
  updateLabour,
  getAllLabours,
  getLabourById,
  uploadExcel,
  deleteLabour,
} from "../Controllers/labour.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, createLabour);
router.put("/update-labour/:labourId", verifyToken, updateLabour);
router.get("/getAll", verifyToken, getAllLabours);
router.get("/getById/:labourId", verifyToken, getLabourById);
router.post("/upload", verifyToken, uploadExcel);
router.delete("/delete/:labourId",verifyToken, deleteLabour); 

export default router;
