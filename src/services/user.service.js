import { adminAuth } from "../config/firebase.js";

export async function me(req, res) {
  const user = await adminAuth.getUser(req.userUID).catch((error) => {
    console.log("Error fetching user data:", error);
    res.status(409).json({ error: error.message });
  });
  res.json({ msg: `You are ${user.email}` });
}
