import crypto from "crypto";
import dbConn from "../config/db.js";
import {
  adminAuth,
  auth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "../config/firebase.js";
import { notify } from "./notification.service.js";

export async function addPatient(req, res) {
  const { email, dob, first_name, last_name, title } = req.body;

  const emailExists = await dbConn
    .execute("SELECT uid FROM User WHERE email = ?", [email])
    .catch((error) => {
      console.log(error.code, error.message);
      return res.status(409).json({ msg: "Unable to add patient" });
    });

  if (emailExists.size > 0) {
    const patient_uid = emailExists.rows[0].uid;

    try {
      const patientRelations = await dbConn.execute(
        "SELECT COUNT(*) FROM PatientRelation WHERE patient_uid = ?",
        [patient_uid]
      );

      if (patientRelations.rows[0]["count(*)"] > 1) {
        return res.status(409).json({
          errors: [
            {
              msg: "This patient is already assigned to another physician.",
            },
          ],
        });
      }

      await dbConn.execute(
        "INSERT IGNORE INTO PatientRelation(patient_uid, staff_uid) VALUES(?, ?)",
        [emailExists.rows[0].uid, req.userUID]
      );

      notify(
        emailExists.rows[0].uid,
        req.userUID,
        "You have been added as a patient."
      );

      return res.json({ success: true, msg: "Successfully added patient" });
    } catch (error) {
      console.log("auth.addPatient: ", error.message);
      return res.status(409).json({ msg: "Unable to add patient" });
    }
  }

  const role = "PATIENT";
  try {
    await adminAuth
      .createUser({
        email: email,
        password: crypto.randomBytes(18).toString("hex"),
      })
      .then(async (userRecord) => {
        await dbConn
          .execute(
            "INSERT INTO User(uid, email, dob, first_name, last_name, title, role) VALUES(?, ?, ?, ?, ?, ?, ?)",
            [userRecord.uid, email, dob, first_name, last_name, title, role]
          )
          .then(async () => {
            await adminAuth
              .updateUser(userRecord.uid, {
                displayName: title
                  ? `${title} ${first_name} ${last_name}`
                  : `${first_name} ${last_name}`,
              })
              .then(() => {
                sendPasswordResetEmail(auth, email).then(() => {
                  console.log("Password reset email sent to: ", email);
                  res.status(200).json({
                    msg: "Successfully added new patient",
                  });
                });
              })
              .catch((error) =>
                console.log("Error updating displayName: ", error)
              );
          });
        await dbConn
          .execute(
            "INSERT IGNORE INTO PatientRelation(patient_uid, staff_uid) VALUES(?, ?)",
            [userRecord.uid, req.userUID]
          )
          .catch((error) =>
            console.log("auth.service.addPatient: ", error.code, error.message)
          );
      });
  } catch (error) {
    console.log("Error inserting new user:", error.message);
    res.status(409).json({
      errors: [{ msg: "Unable to add patient", path: "auth/add-patient" }],
    });
  }
}

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

export async function portal(req, res) {
  const { role } = req.params;
  const { email } = req.body;
  try {
    const result = await dbConn.execute(
      "SELECT role FROM User WHERE email = ?",
      [email]
    );
    if (role.toUpperCase() === result.rows[0].role) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(409).json({ msg: "Unable to access portal" });
    }
  } catch (error) {
    console.log("auth.service.portal: ", error);
    res.status(409).json({ msg: "Unable to access portal" });
  }
}

export async function sendResetPassword(req, res) {
  try {
    await sendPasswordResetEmail(auth, req.body.email);
    res.json({ success: true });
  } catch (error) {
    console.log("user.service.resetPassword: ", error);
    res.json({ success: false });
  }
}

export async function signup(req, res) {
  const { email, password, dob, first_name, last_name, title, role } = req.body;
  const isPhysician = req.body.role === "physician";

  if (isPhysician) {
    await adminAuth
      .updateUser(req.userUID, {
        email: email,
        password: password,
      })
      .then((userRecord) => {
        dbConn
          .execute(
            "UPDATE \
              User SET email = ?, title = ?, claimed_as_physician = true, role = 'PHYSICIAN', title = 'Dr.' \
              WHERE uid = ?",
            [email, title, userRecord.uid]
          )
          .then((result) => {
            if (result.rowsAffected > 0) {
              res
                .status(200)
                .json({ msg: "Successfully created physician account" });
            }
            adminAuth
              .updateUser(userRecord.uid, {
                displayName: title + " " + first_name + " " + last_name,
              })
              .catch((error) =>
                console.log("Error updating displayName: ", error)
              );
          })
          .catch((error) => {
            console.log("Error adding physician: ", error.body.message);
            return res.status(409).json({
              errors: [
                { msg: "Unable to create account", path: "auth/signup" },
              ],
            });
          });
      })
      .catch((error) => {
        console.log("Error creating new user:", error.errorInfo);
        return res
          .status(409)
          .json({ errors: [{ msg: error.message, path: "auth/signup" }] });
      });
  } else {
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
            adminAuth
              .updateUser(userRecord.uid, {
                displayName: title
                  ? `${title} ${first_name} ${last_name}`
                  : `${first_name} ${last_name}`,
              })
              .catch((error) =>
                console.log("Error updating displayName: ", error)
              );
          })
          .catch((error) => {
            console.log("Error inserting new user:", error.body.message);
            res.status(409).json({
              errors: [
                { msg: "Unable to create account", path: "auth/signup" },
              ],
            });
          });
      })
      .catch((error) => {
        console.log("Error creating new user:", error.errorInfo);
        return res
          .status(409)
          .json({ errors: [{ msg: error.message, path: "auth/signup" }] });
      });
  }
}
