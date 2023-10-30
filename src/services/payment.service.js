import dbConn from "../config/db.js";
import stripe from "../config/stripe.js";

export async function invoice(req, res) {
  await stripe.invoiceItems
    .create({
      customer: req.stripeID,
      invoice: invoice.id,
      amount: (Math.floor(Math.random() * 201) + 100) * 100,
      currency: "usd",
      description: "Professional opinion from a radiologist",
    })

    .then((invoiceItems) => {
      return stripe.invoices.create({
        customer: invoiceItems.customer,
        collection_method: "send_invoice",
        days_until_due: 30,
        payment_settings: {
          payment_method_types: ["card", "ach_debit"],
        },
        pending_invoice_items_behavior: "include",
        metadata: {
          patient: req.userUID,
          radiologist: req.params.uid,
        },
      });
    })
    .then((invoice) => {
      stripe.invoices.sendInvoice(invoice.id).then(() => {
        res.status(200).json({
          success: true,
          msg: "Successfully created invoice.",
        });
      });
    })
    .catch((error) => {
      console.log("Error creating invoice: ", error);
      res.status(500).json({ success: false, msg: "Error creating invoice." });
    });
}

export async function invoices(req, res) {
  console.log(req.userUID)
  await dbConn
    .execute(
      "SELECT uid, url, radiologist_uid, amount, paid, createdAt FROM Invoice WHERE patient_uid = ?",
      [req.userUID]
    )
    .then((result) => {
      res.status(200).json({ data: result.rows });
    })
    .catch((error) => {
      console.log("Error fetching invoices: ", error);
      res.status(409).json({
        msg: "Unable to fetch invoices",
        path: req.originalUrl,
      });
    });
}

export async function invoicesOfUser(req, res) {
  await dbConn
    .execute(
      "SELECT uid, url, radiologist_uid, amount, paid, createdAt FROM Invoice WHERE patient_uid = ?",
      [req.params.userId]
    )
    .then((result) => {
      res.status(200).json({ data: result.rows });
    })
    .catch((error) => {
      console.log("Error fetching invoices: ", error);
      res.status(409).json({
        msg: "Unable to fetch invoices",
        path: req.originalUrl,
      });
    });
}

export async function voidInvoice(req, res) {
  await dbConn
    .execute("UPDATE Invoice SET paid = true WHERE uid = ? AND paid = false", [
      req.params.invoiceId,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(200).json({
          success: true,
          msg: "Invoice has already been paid or does not exist",
        });
      }
      res
        .status(200)
        .json({ success: true, msg: "Successfully voided invoice" });
    })
    .catch((error) => {
      console.log("Error voiding invoice: ", error);
      res.status(409).json({
        msg: "Unable to void invoice",
        path: req.originalUrl,
      });
    });
}
