import express from "express";
import {
  createClient,
  updateClient,
  getAllClients,
  getClientById,
  upload,
  deleteClient,
} from "../Controllers/client.controller.js";
import { verifyToken } from "../Middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyToken, createClient); //tested

router.put("/update/:clientId", verifyToken, updateClient); //tested

router.get("/getAll", verifyToken, getAllClients); //tested

router.get("/get/:clientId", verifyToken, getClientById); //not needed

router.post("/upload", verifyToken, upload); //yet to be tested

router.delete("/deleteclient/:clientId", deleteClient); //tested

export default router;
