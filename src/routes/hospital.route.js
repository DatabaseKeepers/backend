import express from "express";
import { hospitalController } from "../controllers/index.js";

const router = express.Router();

router.get("/hospitals", [], hospitalController.hospitals);

export default router;
