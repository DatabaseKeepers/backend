import express from "express";
import { paymentController } from "../controllers/index.js";
import { isAuthorized } from "../middlewares/authorization.js";
import checkUnpaidInvoices from "../middlewares/check-unpaid-invoices.js";
import createStripeCustomer from "../middlewares/create-stripe-customer.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";
import { invoicesSchema } from "../middlewares/validators.js";

const router = express.Router();

/* User information routes */
router.get(
  "/invoices/:userId",
  [isAuthenticated, invoicesSchema, isAuthorized],
  paymentController.invoices
);

/* Transaction routes */
router.post(
  "/:uid/invoice",
  [isAuthenticated, createStripeCustomer, checkUnpaidInvoices],
  paymentController.invoice
);

router.delete(
  "/:invoiceId/invoice",
  [isAuthenticated],
  paymentController.voidInvoice
)

export default router;
