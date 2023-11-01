import express from "express";
import { paymentController } from "../controllers/index.js";
import { isAuthorized, isStaff } from "../middlewares/authorization.js";
import checkExistingImages from "../middlewares/check-existing-images.js";
import checkUnpaidInvoices from "../middlewares/check-unpaid-invoices.js";
import createStripeCustomer from "../middlewares/create-stripe-customer.js";
import errors from "../middlewares/errors.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";
import { invoiceSchema, invoicesSchema } from "../middlewares/validators.js";

const router = express.Router();

/* User information routes */
router.get(
  "/invoices",
  [isAuthenticated, isAuthorized],
  paymentController.invoices
);

router.get(
  "/invoices/:userId",
  [isAuthenticated, invoicesSchema, isStaff],
  paymentController.invoicesOfUser
);

/* Transaction routes */
router.post(
  "/:uid/invoice",
  [
    isAuthenticated,
    invoiceSchema,
    errors,
    checkExistingImages,
    createStripeCustomer,
    checkUnpaidInvoices,
  ],
  paymentController.invoice
);

router.delete(
  "/:invoiceId/invoice",
  [isAuthenticated],
  paymentController.voidInvoice
);

export default router;
