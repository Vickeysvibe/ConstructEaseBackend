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
import verifySite from "../Middlewares/verifysite.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, verifySite, createLabour);
router.put("/update-labour/:labourId", verifyToken, verifySite, updateLabour);
router.get("/getAll", verifyToken, verifySite, getAllLabours);
router.get("/getById/:labourId", verifyToken, verifySite, getLabourById);
router.post("/upload", verifyToken, verifySite, uploadExcel);
router.delete("/delete/:labourId", verifyToken, verifySite, deleteLabour);

export default router;
