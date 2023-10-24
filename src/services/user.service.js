import dbConn from "../config/db.js";

export async function images(req, res) {
  const result = await dbConn
    .execute(
      "\
      SELECT \
        I.uid, \
        I.url, \
        INN.note, \
        CONCAT(UA.title, ' ', UA.first_name, ' ', UA.last_name) AS full_name, \
        UA.role \
      FROM User U \
          JOIN Image I ON U.uid = I.uploaded_for \
          LEFT JOIN ( \
            SELECT INN.uid, INN.note, INN.image_uid, INN.author_uid \
            FROM ImageNote INN \
            JOIN User UA ON INN.author_uid = UA.uid \
            WHERE UA.role IN ('PHYSICIAN', 'RADIOLOGIST') \
        ) AS INN ON I.uid = INN.image_uid \
      LEFT JOIN User UA ON INN.author_uid = UA.uid \
      WHERE U.role = 'PATIENT' AND U.uid = ?",
      [req.params.uid]
    )
    .catch((error) => {
      console.log("user.service.me: ", error);
    });

  res.json({ images: result.rows });
}

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
      "SELECT U.uid, U.first_name, U.last_name, U.email, \
          ( \
            SELECT JSON_ARRAYAGG( \
              JSON_OBJECT('uid', I.uid, 'url', I.url) \
            )\
            FROM Image I \
            WHERE U.uid = I.uploaded_for \
          ) AS images \
        FROM User U \
        JOIN PatientRelation PR ON U.uid = PR.patient_uid \
        WHERE PR.staff_uid = ? ",
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
        "\
        SELECT \
          title, first_name, last_name, dob, email, profile_image_url, SC.bio, SC.expertise, SC.years_of_exp \
        FROM User U \
        LEFT JOIN StaffCredentials SC ON U.uid = SC.uid \
        WHERE U.uid = ?",
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

export async function radiologist(_req, res) {
  const result = await dbConn
    .execute(
      "\
      SELECT U.uid, U.title, U.first_name, U.last_name, U.email, \
        SC.bio, SC.expertise, SC.years_of_exp \
      FROM User U \
      LEFT JOIN StaffCredentials SC ON U.uid = SC.uid \
      WHERE U.role = 'RADIOLOGIST'"
    )
    .catch((error) => {
      console.log("user.service.patients: ", error);
      res.json({ radiologists: [] });
    });

  res.json({ radiologists: result.rows });
}

export async function uploadImage(req, res) {
  try {
    await dbConn.execute("SELECT UUID() as uuid").then((result) => {
      dbConn
        .execute(
          "INSERT IGNORE INTO Image (uid, uploaded_by, uploaded_for, url) VALUES (?, ?, ?, ?)",
          [result.rows[0].uuid, req.userUID, req.body.patient, req.body.url]
        )
        .then(() => {
          dbConn.execute(
            "INSERT INTO ImageNote (image_uid, author_uid, note) VALUES (?, ?, ?)",
            [result.rows[0].uuid, req.userUID, req.body.notes]
          );
        });
    });
  } catch (error) {
    console.log("user.service.uploadImage: ", error);
    res.status(422).json({ success: false });
  }

  res.json({ success: true });
}

export async function updateProfile(req, res) {
  try {
    await dbConn.transaction(async (tx) => {
      const profile_image_url = await tx.execute(
        "UPDATE User SET profile_image_url = ? WHERE uid = ?",
        [req.body.profile_image_url, req.userUID]
      );
      const bio = await tx.execute(
        "INSERT INTO StaffCredentials(bio, uid) VALUES(?, ?) ON DUPLICATE KEY UPDATE bio = ?",
        [req.body.bio, req.userUID, req.body.bio]
      );
      return [profile_image_url, bio];
    });
    res.json({ success: true });
  } catch (error) {
    console.log("user.service.uploadImage: ", error);
    res.status(422).json({ success: false });
  }
}
