import { firebaseAuth } from "../config/firebase.js";

export async function me(req, res) {
  const user = await firebaseAuth.getUser(req.userUID).catch((error) => {
    console.log("Error fetching user data:", error);
    res.status(409).json({ error: error.message });
  });
  res.json({ message: `You are ${user.email}` });
}
