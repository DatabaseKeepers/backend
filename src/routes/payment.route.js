import express from "express";
import { paymentController } from "../controllers/index.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";
import { billingSchema } from "../middlewares/validators.js";

const router = express.Router();

router.post("/bill", [isAuthenticated, billingSchema], paymentController.bill);
router.post("/pay", [isAuthenticated], paymentController.pay);

export default router;
