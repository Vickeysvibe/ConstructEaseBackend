import express from "express";
import {
    createClient,
    updateClient,
    getAllClients,
    getClientById,
    upload,
} from "../Controllers/client.controller.js"; 

const router = express.Router();

// Create a new client
router.post("/create", createClient);

// Update an existing client by ID
router.put("/update/:clientId", updateClient);

// Get all clients filtered by siteId
router.get("/getAll", getAllClients);

// Get a specific client by ID
router.get("/get/:clientId", getClientById);

// Upload clients via Excel file (siteId required in query)
router.post("/upload", upload);

export default router;
