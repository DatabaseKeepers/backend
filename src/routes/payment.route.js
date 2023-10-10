import express from "express";
import { paymentController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";

const router = express.Router();

router.post("/pay", [isAuthenticated], paymentController.pay);

export default router;
