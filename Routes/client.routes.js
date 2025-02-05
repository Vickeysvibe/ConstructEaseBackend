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
import verifySite from "../Middlewares/verifysite.middleware.js";

const router = express.Router();

router.post("/create", verifyToken,verifySite, createClient); //tested

router.put("/update/:clientId", verifyToken,verifySite, updateClient); //tested

router.get("/getAll", verifyToken,verifySite, getAllClients); //tested

router.get("/get/:clientId", verifyToken,verifySite, getClientById); //not needed

router.post("/upload", verifyToken,verifySite, upload); //yet to be tested

router.delete("/deleteclient/:clientId",verifyToken,verifySite, deleteClient); //tested

export default router;
