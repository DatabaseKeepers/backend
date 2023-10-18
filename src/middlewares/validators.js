import { checkSchema } from "express-validator";
import dbConn from "../config/db.js";
import { adminAuth } from "../config/firebase.js";

async function checkEmailExists(email) {
  await adminAuth
    .getUserByEmail(email)
    .then((user) => {
      if (user) return Promise.resolve();
      return Promise.reject();
    })
    .catch((_error) => {
      return Promise.reject();
    });
}

async function checkPatientExists(uid, { req }) {
  await dbConn
    .execute("SELECT email, first_name, last_name FROM User WHERE uid = ?", [
      uid,
    ])
    .then((result) => {
      if (result.rows.length > 0) {
        req.patientEmail = result.rows[0].email;
        req.patientName =
          result.rows[0].first_name + " " + result.rows[0].last_name;
        return Promise.resolve(req);
      }
      return Promise.reject();
    })
    .catch((error) => {
      console.log(error.code, error.message);
      return Promise.reject();
    });
}

async function checkInvoiceExists(uid, { req }) {
  await dbConn
    .execute(
      "SELECT uid, patient_uid, amount FROM Invoice WHERE uid = ? AND patient_uid = ?",
      [uid, req.userUID]
    )
    .then((result) => {
      if (result.rows.length > 0) {
        req.amount = result.rows[0].amount;
        return Promise.resolve(req);
      }
      return Promise.reject();
    })
    .catch((error) => {
      console.log(error.code, error.message);
      return Promise.reject();
    });
}

async function checkInvoicePaid(uid) {
  await dbConn
    .execute("SELECT paid FROM Invoice WHERE uid = ?", [uid])
    .then((result) => {
      if (result.rows.length > 0) {
        if (result.rows[0].paid) return Promise.reject(); // paid
        return Promise.resolve(); // not paid
      }
      return Promise.reject();
    })
    .catch((error) => {
      console.log(error.code, error.message);
      return Promise.reject();
    });
}

export const loginSchema = checkSchema(
  {
    email: { isEmail: { trim: true, errorMessage: "Invalid email" } },
    password: { notEmpty: { errorMessage: "Password is required" } },
  },
  ["body"]
);

export const signupSchema = checkSchema(
  {
    email: {
      emailExists: {
        bail: true,
        custom: checkEmailExists,
        errorMessage: "Email already exists",
      },
      isEmail: {
        trim: true,
        errorMessage: "Invalid email",
      },
    },
    password: {
      isLength: {
        options: { min: 8 },
        errorMessage: "Password must be at least 8 characters",
      },
      notEmpty: {
        errorMessage: "Password is required",
      },
    },
    dob: { isISO8601: { errorMessage: "Invalid date of birth" } },
    first_name: { notEmpty: { errorMessage: "First name is required" } },
    last_name: { notEmpty: { errorMessage: "Last name is required" } },
    title: { optional: true },
    role: {
      default: "patient",
      toLowerCase: true,
      isAlpha: {
        errorMessage: "Invalid role",
      },
      isIn: {
        options: [["patient", "radiologist", "physician"]],
        errorMessage: "Invalid role",
      },
    },
  },
  ["body"]
);

export const invoicesSchema = checkSchema(
  {
    userId: {
      notEmpty: {
        bail: true,
        errorMessage: "User's uid is required",
      },
      isString: {
        bail: true,
        options: { min: 28, max: 28 },
        errorMessage: "Invalid user's uid",
      },
    },
  },
  ["params"]
);

export const invoiceSchema = checkSchema(
  {
    patient: {
      notEmpty: {
        bail: true,
        errorMessage: "Patient's uid is required",
      },
      patientExists: {
        bail: true,
        custom: checkPatientExists,
        errorMessage: "Patient does not exist",
      },
    },
    amount: {
      notEmpty: {
        bail: true,
        errorMessage: "Bill amount is required",
      },
      isFloat: {
        bail: true,
        options: { min: 0 },
        errorMessage: "Invalid bill amount",
      },
    },
  },
  ["body"]
);

export const paySchema = checkSchema(
  {
    invoice: {
      notEmpty: {
        bail: true,
        errorMessage: "Invoice uid is required",
      },
      existsAndBelongsToUser: {
        bail: true,
        custom: checkInvoiceExists,
        errorMessage: "Invoice does not exist",
      },
      isPaid: {
        bail: true,
        custom: checkInvoicePaid,
        errorMessage: "Invoice has already been paid",
      },
    },
  },
  ["body"]
);

export const uploadImageSchema = checkSchema({
  patient: {
    notEmpty: {
      bail: true,
      errorMessage: "Patient's uid is required",
    },
    patientExists: {
      bail: true,
      custom: checkPatientExists,
      errorMessage: "Patient does not exist",
    },
  },
  url: {
    notEmpty: {
      bail: true,
      errorMessage: "Image url is required",
    },
    isURL: {
      bail: true,
      options: {
        host_whitelist: ["firebasestorage.googleapis.com"],
      },
      errorMessage: "Invalid image url",
    },
  },
});
