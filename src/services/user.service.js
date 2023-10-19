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

export async function patients(req, res) {
  const result = await dbConn
    .execute(
      "SELECT uid, first_name, last_name FROM User U JOIN PatientRelation PR ON U.uid = PR.patient_uid WHERE PR.staff_uid = ? ",
      [req.userUID]
    )
    .catch((error) => {
      console.log("user.service.patients: ", error);
      res.json({ patients: [] });
    });

  res.json({ patients: result.rows });
}

export async function profile(req, res) {
  const results = await dbConn
    .transaction(async (tx) => {
      const user = await tx.execute(
        "SELECT first_name, last_name, dob, email, title FROM User WHERE uid = ?",
        [req.userUID]
      );
      const staff = await tx.execute(
        "\
      SELECT \
        U.uid AS uid, \
        U.first_name AS first_name, \
        U.last_name AS last_name, \
        U.role AS role, \
        U.title AS title \
      FROM \
          User AS U \
      INNER JOIN \
          PatientRelation AS PR ON U.uid = PR.staff_uid \
      WHERE \
          PR.patient_uid = ? ",
        [req.userUID]
      );
      return [user, staff];
    })
    .catch((error) => {
      console.log("user.service.profile: ", error);
      res.status(204).json({});
    });

  res.json({ profile: results[0].rows[0], staff: results[1].rows });
}

export async function uploadImage(req, res) {
  await dbConn
    .execute(
      "INSERT IGNORE INTO Image (uploaded_by, uploaded_for, url, notes) VALUES (?, ?, ?, ?)",
      [req.userUID, req.body.patient, req.body.url, req.body.notes]
    )
    .catch((error) => {
      console.log("user.service.uploadImage: ", error);
      res.status(422).json({ success: false });
    });

  res.json({ success: true });
}
