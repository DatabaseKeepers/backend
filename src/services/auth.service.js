import dbConn from "../config/db.js";
import {
  adminAuth,
  auth,
  signInWithEmailAndPassword,
} from "../config/firebase.js";

export async function login(req, res) {
  const { email, password } = req.body;
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential._tokenResponse;
      console.log("Successfully logged in:", user.localId);
      /* Attributes that are not needed for the client, but are returned by the Firebase API */
      const { kind, verified, email, registered, ...sanitizedUser } = user;
      res.status(200).json(sanitizedUser);
    })
    .catch((error) => {
      console.log("Error logging in:", error.code);
      if (error.code === "auth/invalid-login-credentials") {
        res.status(409).json({
          errors: [
            {
              msg: "The email or password is incorrect",
              path: "auth",
            },
          ],
        });
      } else {
        res
          .status(409)
          .json({ errors: [{ msg: error.message, path: "auth/signin" }] });
      }
    });
}

export async function signup(req, res) {
  const { email, password, dob, first_name, last_name, title, role } = req.body;
  await adminAuth
    .createUser({
      email: email,
      password: password,
    })
    .then((userRecord) => {
      // Create a new user in the planetscale database since we use firebase auth
      // for authentication and planetscale for storing user data
      dbConn
        .execute(
          "INSERT INTO User(uid, email, dob, first_name, last_name, title, role) VALUES(?, ?, ?, ?, ?, ?, ?)",
          [userRecord.uid, email, dob, first_name, last_name, title, role]
        )
        .then((result) => {
          if (result.rowsAffected > 0) {
            res.status(200).json({ msg: "Successfully created new user" });
          }
        })
        .catch((error) => {
          console.log("Error inserting new user:", error.body.message);
          res.status(409).json({
            errors: [{ msg: "Unable to create account", path: "auth/signup" }],
          });
        });
    })
    .catch((error) => {
      console.log("Error creating new user:", error.errorInfo);
      res
        .status(409)
        .json({ errors: [{ msg: error.message, path: "auth/signup" }] });
    });
}
