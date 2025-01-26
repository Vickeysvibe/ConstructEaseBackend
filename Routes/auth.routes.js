import express from "express";
import { checkout, login } from "../Controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/checkout",checkout);

export default router;
