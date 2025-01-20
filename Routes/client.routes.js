import express from "express";
import {
    createClient,
    updateClient,
    getAllClients,
    getClientById,
    upload,
    deleteClient,
} from "../Controllers/client.controller.js"; 

const router = express.Router();

router.post("/create", createClient);

router.put("/update/:clientId", updateClient);

router.get("/getAll", getAllClients);

router.get("/get/:clientId", getClientById);

router.post("/upload", upload);

router.delete("/deleteclient/:clientId", deleteClient);


export default router;
