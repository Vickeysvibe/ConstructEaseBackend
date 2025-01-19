import express from "express";
import {
  CreatePo,
  getAllPos,
  getPo,
  helper,
} from "../Controllers/purchaseOrders.controller.js";

const router = express.Router();

router.get("/getAllPos", getAllPos);
router.get("/getPo/:poid", getPo);
router.get("/create/details", helper);

router.post("/create", CreatePo);

export default router;
