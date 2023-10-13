import express from "express";
import dbConn from "../config/db.js";
import stripe from "../config/stripe.js";
import { STRIPE_WEBHOOK_SECRET_KEY } from "../utils/environment.js";

const router = express.Router();

router.post(express.raw({ type: "application/json" }), (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET_KEY
    );
  } catch (err) {
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "charge.succeeded":
      break;
    case "customer.created":
      break;
    case "customer.updated":
      break;
    case "customer.source.created":
      break;
    case "invoiceitem.created":
      break;
    case "invoice.created":
      break;
    case "invoice.finalized":
      dbConn
        .execute(
          "INSERT IGNORE INTO Invoice (uid, patient_uid, radiologist_uid, amount, paid, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
          [
            event.data.object.id,
            event.data.object.metadata.patientUID,
            event.data.object.metadata.radiologistUID,
            event.data.object.total / 100,
            event.data.object.paid,
            new Date(event.data.object.created * 1000), // in GMT
          ]
        )
        .catch((error) => console.log("Error inserting invoice: ", error));
      break;
    case "invoice.payment_succeeded":
      break;
    case "invoice.paid":
      dbConn.execute("UPDATE Invoice SET paid = 1 WHERE uid = ?", [
        event.data.object.id,
      ]);
      break;
    case "invoice.sent":
      break;
    case "invoice.updated":
      break;
    case "payment_method.attached":
      break;
    case "payment_intent.created":
      break;
    case "payment_intent.succeeded":
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
});

export default router;
