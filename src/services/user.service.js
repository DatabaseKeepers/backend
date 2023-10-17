import dbConn from "../config/db.js";

export async function me(req, res) {
  const result = await dbConn
    .execute("SELECT role FROM User WHERE uid = ?", [req.userUID])
    .catch((error) => {
      console.log("user.service.me: ", error);
    });

  if (result.size === 1) {
    res.json({
      role:
        result.rows[0].role.charAt(0) +
        result.rows[0].role.slice(1).toLowerCase(),
    });
  } else {
    res.json({ role: "Patient" });
  }
}
