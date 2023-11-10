import crypto from "crypto";
import dbConn from "../config/db.js";
import { notify } from "./notification.service.js";

export async function assignRadiologist(req, res) {
  await dbConn
    .execute(
      "INSERT INTO PatientRelation (patient_uid, staff_uid) VALUES (?, ?)",
      [req.userUID, req.params.uid]
    )
    .then((result) => {
      if (result.rowsAffected > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    })
    .catch((error) => {
      console.log("user.service.assignRadiologist: ", error.body.message);
      if (error.body.message.includes("Duplicate entry")) {
        return res.json({
          success: false,
          message:
            "You have already assigned this radiologist to your account.",
        });
      }
      res.json({ success: false });
    });
}

export async function removeRadiologist(req, res) {
  await dbConn
    .execute(
      "DELETE FROM PatientRelation WHERE patient_uid = ? AND staff_uid = ?",
      [req.userUID, req.params.uid]
    )
    .then((result) => {
      if (result.rowsAffected > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false, msg: "Specified radiologist not found." });
      }
    })
    .catch((error) => {
      console.log("user.service.removeRadiologist: ", error.body);
      res.json({ success: false });
    });
}

export async function images(req, res) {
  const result = await dbConn
    .execute(
      "\
      SELECT \
        I.uid, I.url, \
        IF(COUNT(INN.note) > 0, \
          JSON_ARRAYAGG( \
            JSON_OBJECT( \
              'uid', INN.author_uid, \
              'note', INN.note, \
              'full_name', CONCAT(UA.title, ' ', UA.first_name, ' ', UA.last_name), \
              'role', UA.role \
            ) \
          ), \
          JSON_ARRAY() \
        ) AS authors \
      FROM User U \
      JOIN Image I ON U.uid = I.uploaded_for \
      LEFT JOIN ( \
        SELECT INN.uid, INN.note, INN.image_uid, INN.author_uid \
        FROM ImageNote INN \
        JOIN User UA ON INN.author_uid = UA.uid \
        WHERE UA.role IN ('PHYSICIAN', 'RADIOLOGIST') \
      ) AS INN ON I.uid = INN.image_uid \
      LEFT JOIN User UA ON INN.author_uid = UA.uid \
      WHERE U.role = 'PATIENT' AND U.uid = ? \
      GROUP BY I.uid, I.url",
      [req.params.uid]
    )
    .catch((error) => {
      console.log("user.service.images: ", error);
    });

  res.json({ images: result.rows });
}

export async function me(req, res) {
  try {
    const result = await dbConn.execute("SELECT role FROM User WHERE uid = ?", [
      req.userUID,
    ]);

    if (result.size === 1) {
      res.json({
        role:
          result.rows[0].role.charAt(0) +
          result.rows[0].role.slice(1).toLowerCase(),
      });
    } else {
      res.json({ role: "Patient" });
    }
  } catch (error) {
    console.log("user.service.me: ", error);
    res.json({ role: "Patient" });
  }
}

export async function patients(req, res) {
  const result = await dbConn
    .execute(
      "SELECT U.uid, U.dob, U.first_name, U.last_name, U.email, U.profile_image_url, \
        JSON_ARRAYAGG( \
          JSON_OBJECT( \
            'uid', I.uid, \
            'url', I.url, \
            'authors', IFNULL(authors, JSON_ARRAY()) \
          ) \
        ) AS images \
        FROM User U \
        JOIN PatientRelation PR ON U.uid = PR.patient_uid \
      LEFT JOIN Image I ON U.uid = I.uploaded_for \
      LEFT JOIN ( \
        SELECT \
          INN.image_uid, \
          JSON_ARRAYAGG( \
            JSON_OBJECT( \
              'uid', INN.author_uid, \
              'note', INN.note, \
              'role', UA.role, \
              'full_name', CONCAT(UA.title, ' ', UA.first_name, ' ', UA.last_name) \
            ) \
          ) AS authors \
        FROM ImageNote INN \
        JOIN User UA ON INN.author_uid = UA.uid \
        WHERE UA.role IN ('PHYSICIAN', 'RADIOLOGIST') \
        GROUP BY INN.image_uid \
      ) AS authors_subquery ON I.uid = authors_subquery.image_uid \
      WHERE PR.staff_uid = ? \
      GROUP BY U.uid, U.dob, U.first_name, U.last_name, U.email, U.profile_image_url",
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

export async function meetOurRadiologists(_req, res) {
  const result = await dbConn
    .execute(
      "\
      SELECT U.uid, U.title, U.first_name, U.last_name, U.profile_image_url, \
        SC.expertise \
      FROM User U \
      LEFT JOIN StaffCredentials SC ON U.uid = SC.uid \
      WHERE U.role = 'RADIOLOGIST' \
      ORDER BY RAND() \
      LIMIT 6"
    )
    .catch((error) => {
      console.log("user.service.meetOurRadiologists: ", error);
      res.json({ radiologists: [] });
    });

  res.json({ radiologists: result.rows });
}

export async function radiologists(_req, res) {
  const result = await dbConn
    .execute(
      "\
      SELECT U.uid, U.title, U.first_name, U.last_name, U.email, U.profile_image_url, \
        SC.bio, SC.expertise, SC.years_of_exp \
      FROM User U \
      LEFT JOIN StaffCredentials SC ON U.uid = SC.uid \
      WHERE U.role = 'RADIOLOGIST'"
    )
    .catch((error) => {
      console.log("user.service.radiologists: ", error);
      res.json({ radiologists: [] });
    });

  res.json({ radiologists: result.rows });
}

export async function uploadImage(req, res) {
  try {
    const uuid = crypto.randomUUID();
    const results = await dbConn.transaction(async (tx) => {
      const image = await tx.execute(
        "INSERT IGNORE INTO Image (uid, uploaded_by, uploaded_for, url) VALUES (?, ?, ?, ?)",
        [uuid, req.userUID, req.body.patient, req.body.url]
      );
      const imageNote = await tx.execute(
        "INSERT INTO ImageNote (image_uid, author_uid, note) VALUES (?, ?, ?)",
        [uuid, req.userUID, req.body.notes]
      );
      return [image.rowsAffected, imageNote.rowsAffected];
    });
    if (results.length === 2 && results[0] > 0 && results[1] > 0) {
      notify(
        req.body.patient,
        req.userUID,
        "You have a new image from your physician."
      );
    }
  } catch (error) {
    console.log("user.service.uploadImage: ", error);
    res.status(422).json({ success: false });
  }

  res.json({ success: true });
}

export async function updateProfile(req, res) {
  let profile_image_url,
    bio = null;
  try {
    await dbConn.transaction(async (tx) => {
      const user = await dbConn.execute("SELECT role FROM User WHERE uid = ?", [
        req.userUID,
      ]);
      profile_image_url = await tx.execute(
        "UPDATE User SET profile_image_url = ? WHERE uid = ?",
        [req.body.profile_image_url, req.userUID]
      );
      if (user.size > 0 && user.rows[0].role !== "PATIENT") {
        bio = await tx.execute(
          "INSERT INTO StaffCredentials(bio, uid) VALUES(?, ?) ON DUPLICATE KEY UPDATE bio = ?",
          [req.body.bio, req.userUID, req.body.bio]
        );
      }
      return [profile_image_url, bio];
    });

    res.json({ success: true, data: { ...req.body } });
  } catch (error) {
    console.log("user.service.uploadImage: ", error);
    res.status(422).json({ success: false });
  }
}
