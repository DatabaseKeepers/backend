import { validationResult } from "express-validator";
import dbConn from "../config/db.js";

export async function bill(req, res) {
  const result = validationResult(req);
  const errors = result.array();
  const sanitizedErrors = errors.map(({ type, value, location, ...error }) => {
    return error;
  });
  for (const error of sanitizedErrors) {
    error.path = "payment/bill";
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
        path: "payment/bill",
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
  return res
    .status(200)
    .json({ message: "Payment success for: " + req.userUID });
}
