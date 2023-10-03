import { validationResult } from "express-validator";
import {
  adminAuth,
  auth,
  signInWithEmailAndPassword,
} from "../config/firebase.js";

export async function login(req, res) {
  const result = validationResult(req);
  const errors = result.array();
  const sanitizedErrors = errors.map(({ type, value, location, ...error }) => {
    return error;
  });
  if (errors.length > 0) {
    return res.status(400).json({ errors: sanitizedErrors });
  }

  const { email, password } = req.body;
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential._tokenResponse;
      console.log("Successfully logged in:", user.localId);
      /* Attributes that are not needed for the client, but are returned by the Firebase API */
      const { kind, verified, email, registered, ...sanitizedUser } = user;
      return res.status(200).json(sanitizedUser);
    })
    .catch((error) => {
      console.log("Error logging in:", error.code);
      if (error.code === "auth/invalid-login-credentials") {
        return res.status(409).json({
          errors: [
            {
              msg: "The email or password is incorrect",
              path: "auth",
            },
          ],
        });
      }
      return res
        .status(409)
        .json({ errors: [{ msg: error.message, path: "auth/signin" }] });
    });
}

export async function signup(req, res) {
  const result = validationResult(req);
  const errors = result.array();
  const sanitizedErrors = errors.map(({ type, value, location, ...error }) => {
    return error;
  });
  if (errors.length > 0) {
    return res.status(400).json({ errors: sanitizedErrors });
  }

  const { email, password } = req.body;
  await adminAuth
    .createUser({
      email: email,
      password: password,
    })
    .then((userRecord) => {
      console.log("Successfully created new user:", userRecord.uid);
      return res.status(200).json({ userRecord });
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
      return res
        .status(409)
        .json({ errors: [{ msg: error.message, path: "auth/signup" }] });
    });
}
