import express from "express";
import { verifyToken } from "../Middlewares/auth.middleware.js";
import {
  createMaterialInward,
  createMaterialOutward,
  getAllMaterialInwards,
  getAllMaterialOutwards,
  getMaterialInwardById,
  getMaterialOutwardById,
} from "../Controllers/materials.controller.js";

const router = express.Router();

router.get("/getMI/:siteId", verifyToken, getAllMaterialInwards);
router.get("/getMO/:siteId", verifyToken, getAllMaterialOutwards);

router.get("/getMI/:MIid", verifyToken, getMaterialInwardById);
router.get("/getMO/:MOid", verifyToken, getMaterialOutwardById);

router.post("/createMI", verifyToken, createMaterialInward);
router.post("/createMO", verifyToken, createMaterialOutward);
export default router;
