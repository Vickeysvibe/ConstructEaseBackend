import express from "express";
import { verifyToken } from "../Middlewares/auth.middleware.js";
import {
  createPayment,
  deletePayment,
  editPayment,
  getPayments,
} from "../Controllers/payments.controller.js";

const router = express.Router();

router.get("/getPayments", verifyToken, getPayments);
router.post("/createPayment", verifyToken, createPayment);
router.put("editPayment/:id", verifyToken, editPayment);
router.delete("deletePayment/:id", verifyToken, deletePayment);
export default router;
