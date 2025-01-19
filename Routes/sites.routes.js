import express from "express";
import { createSite, editSite } from "../Controllers/sites.controller.js";

const router = express.Router();

router.post("/create", createSite);
router.put("/:siteId/edit", editSite);
// router.delete("/:siteId", editSite); delete has more logic than expected

export default router;
