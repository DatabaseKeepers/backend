import dbConn from "../config/db.js";

export async function me(req, res) {
  const result = await dbConn
    .execute("SELECT role FROM User WHERE uid = ?", [req.userUID])
    .catch((error) => {
      console.log("user.service.me: ", error);
    });

  if (result.size === 1) {
    res.json({ role: result.rows[0].role.toLowerCase() });
  } else {
    res.json({ role: "patient" });
  }
}
