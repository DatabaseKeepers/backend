import dbConn from "../config/db.js";
import stripe from "../config/stripe.js";

export async function invoice(req, res) {
  await stripe.invoiceItems
    .create({
      customer: req.stripeID,
      invoice: invoice.id,
      amount: req.body.amount * 100,
      currency: "usd",
      description: "Professional opinion",
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
          patientUID: req.body.patient,
          radiologistUID: req.userUID,
        },
      });
    })
    .then((invoice) => {
      stripe.invoices.sendInvoice(invoice.id).then(() => {
        res.status(200).json({
          msg: "Successfully created invoice for " + req.patientName,
        });
      });
    })
    .catch((error) => {
      console.log("Error creating invoice: ", error);
      res.status(500).json({ msg: "Error creating invoice" });
    });
}

export async function invoices(req, res) {
  await dbConn
    .execute(
      "SELECT uid, radiologist_uid, amount, paid, createdAt FROM Invoice WHERE patient_uid=(?)",
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

export async function pay(req, res) {
  const { invoice } = req.body;
  const results = await dbConn.transaction(async (tx) => {
    const updateInvoice = await tx.execute(
      "INSERT INTO Transaction (user_uid, invoice_uid, amount, transaction_date, status) VALUES (?, ?, ?, ?, ?)",
      [req.userUID, invoice, req.amount, new Date(), "SUCCESS"]
    );
    const createTransaction = await tx.execute(
      "UPDATE Invoice SET paid = TRUE WHERE uid = ?",
      [invoice]
    );
    return [updateInvoice, createTransaction];
  });
  console.log(results);
  res.status(200).json({ msg: "Successfully paid invoice" });
}
