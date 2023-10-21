import express from "express";
import { paymentController } from "../controllers/index.js";
import { isAuthorized, isStaff } from "../middlewares/authorization.js";
import createStripeCustomer from "../middlewares/create-stripe-customer.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";
import { invoiceSchema, invoicesSchema } from "../middlewares/validators.js";

const router = express.Router();

/* User information routes */
router.get(
  "/invoices/:userId",
  [isAuthenticated, invoicesSchema, isAuthorized],
  paymentController.invoices
);

/* Transaction routes */
router.post(
  "/invoice",
  [isAuthenticated, invoiceSchema, createStripeCustomer, isStaff],
  paymentController.invoice
);

// Disabled since we handling payments through Stripe
//router.post("/pay", [isAuthenticated, paySchema], paymentController.pay);

export default router;
