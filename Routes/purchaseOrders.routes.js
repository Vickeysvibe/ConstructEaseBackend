import express from "express";
import {
  CreatePo,
  CreatePr,
  getAllPos,
  getAllPrs,
  getPo,
  getPoForPr,
  getPr,
  helper,
} from "../Controllers/purchaseOrders.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.get("/getAllPos", verifyToken, getAllPos);
router.get("/getPo/:poid", verifyToken, getPo);
router.get("/create/details", verifyToken, helper);

router.get("/getPoForPr/:poid", verifyToken, getPoForPr);
router.get("/getAllPrs", verifyToken, getAllPrs);
router.get("/getPr/:prid", verifyToken, getPr);

router.post("/createPo", verifyToken, CreatePo);
router.post("/createPr", verifyToken, CreatePr);

export default router;
