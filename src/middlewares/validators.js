import { checkSchema } from "express-validator";
import { adminAuth } from "../config/firebase.js";

async function checkEmailExists(email) {
  await adminAuth
    .getUserByEmail(email)
    .then((user) => {
      if (user) return false;
    })
    .catch((error) => {
      if (error.code === "auth/user-not-found") return true;
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
      default: "Patient",
      toLowerCase: true,
      isAlpha: {
        errorMessage: "Invalid role",
      },
      isIn: {
        options: ["patient", "radiologist", "physician"],
        errorMessage: "Invalid role",
      },
    },
  },
  ["body"]
);
