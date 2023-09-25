import { firebaseAuth } from "../config/firebase.js";

export async function signup(req, res) {
  await firebaseAuth
    .createUser({
      email: req.body.email,
      password: req.body.password,
    })
    .then((userRecord) => {
      console.log("Successfully created new user:", userRecord.uid);
      res.status(200).json({ userRecord });
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
      res.status(409).json({ error: error.message });
    });
}
