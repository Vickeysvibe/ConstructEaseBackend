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

// Create a new client
router.post("/create", verifyToken, createClient);

// Update an existing client by ID
router.put("/update/:clientId", verifyToken, updateClient);

// Get all clients filtered by siteId
router.get("/getAll", verifyToken, getAllClients);

// Get a specific client by ID
router.get("/get/:clientId", verifyToken, getClientById);

// Upload clients via Excel file (siteId required in query)
router.post("/upload", verifyToken, upload);

router.delete("/deleteclient/:clientId", deleteClient);

export default router;
