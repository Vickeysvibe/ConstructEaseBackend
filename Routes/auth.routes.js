import express from "express";
import {login}  from "../Controllers/auth.controller.js";
import { checkin, checkout } from "../Controllers/checkin.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/checkin",checkin);
router.post("/checkout",checkout);

export default router;
