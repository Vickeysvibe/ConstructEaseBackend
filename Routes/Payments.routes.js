import express from "express";
import { verifyToken } from "../Middlewares/auth.middleware.js";
import {
  createPayment,
  deletePayment,
  editPayment,
  getPayments,
} from "../Controllers/payments.controller.js";
import verifySite from "../Middlewares/verifysite.middleware.js";

const router = express.Router();

router.get("/getPayments", verifyToken,verifySite,getPayments);
router.post("/createPayment", verifyToken, verifySite,createPayment);
router.put("editPayment/:id", verifyToken, verifySite,editPayment);
router.delete("/deletePayment/:id",verifyToken,verifySite,deletePayment);
export default router;
