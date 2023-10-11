import { checkSchema } from "express-validator";
import dbConn from "../config/db.js";
import { adminAuth } from "../config/firebase.js";

async function checkEmailExists(email) {
  await adminAuth
    .getUserByEmail(email)
    .then((user) => {
      if (user) return Promise.resolve();
    })
    .catch((error) => {
      console.log(error.code, error.message);
      return Promise.reject();
    });
}

async function checkPatientExists(uid, { req }) {
  await dbConn
    .execute("SELECT first_name, last_name FROM User WHERE uid = ?", [uid])
    .then((result) => {
      if (result.rows.length > 0) {
        req.patientName =
          result.rows[0].first_name + " " + result.rows[0].last_name;
        return Promise.resolve(req);
      }
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

export const billingSchema = checkSchema(
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
