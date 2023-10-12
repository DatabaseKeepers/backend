import { validationResult } from "express-validator";
import dbConn from "../config/db.js";

export async function bill(req, res) {
  const result = validationResult(req);
  const errors = result.array();
  const sanitizedErrors = errors.map(({ type, value, location, ...error }) => {
    return error;
  });
  for (const error of sanitizedErrors) {
    error.path = req.originalUrl;
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors: sanitizedErrors });
  }

  const { patientName, userUID } = req;
  const { patient, amount } = req.body;
  await dbConn
    .execute(
      "INSERT INTO Invoice (patient_uid, radiologist_uid, amount) VALUES (?, ?, ?)",
      [patient, userUID, amount]
    )
    .then((result) => {
      if (result.rowsAffected > 0) {
        return res
          .status(200)
          .json({ msg: "Successfully created new bill for " + patientName });
      }
    })
    .catch((error) => {
      console.log("Error inserting new bill: ", error);
      return res.status(409).json({
        msg: "Unable to create bill for " + patientName,
        path: req.originalUrl,
      });
    });
}

export async function pay(req, res) {
  const result = validationResult(req);
  const errors = result.array();
  const sanitizedErrors = errors.map(({ type, value, location, ...error }) => {
    return error;
  });
  for (const error of sanitizedErrors) {
    error.path = req.originalUrl;
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors: sanitizedErrors });
  }
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
  return res.status(200).json({ msg: "Successfully paid invoice" });
}

export async function usersInvoices(req, res) {
  await dbConn
    .execute(
      "SELECT uid, radiologist_uid, amount, paid, paid_at, createdAt FROM Invoice WHERE patient_uid=(?)",
      [req.params.userId]
    )
    .then((result) => {
      return res.status(200).json({ data: result.rows });
    })
    .catch((error) => {
      console.log("Error fetching invoices: ", error);
      return res.status(409).json({
        msg: "Unable to fetch invoices",
        path: req.originalUrl,
      });
    });
}
