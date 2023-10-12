import express from "express";
import { paymentController } from "../controllers/index.js";
import { isAuthorized, isStaff } from "../middlewares/authorization.js";
import { isAuthenticated } from "../middlewares/firebase-auth.js";
import {
  billingSchema,
  invoicesSchema,
  paySchema,
} from "../middlewares/validators.js";

const router = express.Router();

/* User information routes */
router.get(
  "/users/:userId",
  [isAuthenticated, invoicesSchema, isAuthorized],
  paymentController.usersInvoices
);

/* Transaction routes */
router.post(
  "/bill",
  [isAuthenticated, billingSchema, isStaff],
  paymentController.bill
);

router.post(
  "/pay",
  [isAuthenticated, paySchema],
  paymentController.pay
);

export default router;
