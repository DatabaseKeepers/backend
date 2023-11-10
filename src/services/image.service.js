import dbConn from "../config/db.js";
import { notify } from "../services/notification.service.js";

export async function updateImageNote(req, res) {
  let patientResult;
  const invoiceResult = await dbConn
    .execute(
      "\
      SELECT \
        i.uid AS image_uid, i.uploaded_by AS uploaded_by, i.url AS image_url, \
        iv.uid AS invoice_uid, iv.patient_uid AS patient_uid, iv.radiologist_uid AS radiologist_uid, iv.paid \
      FROM Image i \
      LEFT JOIN Invoice iv ON i.uploaded_for = iv.patient_uid \
      WHERE i.uid = ? AND iv.paid = 0",
      [req.params.image_uid]
    )
    .catch((error) => {
      console.log("image.service.invoiceResult: ", error);
    });

  if (invoiceResult.size > 0) {
    return res.status(409).json({
      msg: "The patient has not paid for this image yet. Please wait for the patient to pay before updating the note.",
    });
  }

  try {
    patientResult = await dbConn.execute(
      "SELECT i.uploaded_for AS patient_uid FROM Image i WHERE i.uid = ?",
      [req.params.image_uid]
    );
  } catch (error) {
    console.log("image.service.uploadImageNote.patientResult: ", error);
  }

  const patientUID = patientResult.rows[0].patient_uid;

  try {
    await dbConn.execute(
      "INSERT INTO ImageNote (image_uid, author_uid, note) VALUES (?, ?, ?)",
      [req.params.image_uid, req.userUID, req.body.note]
    );
    notify(
      patientUID,
      req.userUID,
      "Your image has a new note.",
      "/imagelibrary"
    );
  } catch (error) {
    if (error.body.message.includes("AlreadyExists")) {
      await dbConn
        .execute(
          "UPDATE ImageNote SET note = ? WHERE image_uid = ? AND author_uid = ?",
          [req.body.note, req.params.image_uid, req.userUID]
        )
        .catch((error) => {
          console.log("image.service.uploadImageNote: ", error);
          res.json({ success: false });
        });
      notify(
        patientUID,
        req.userUID,
        "Your image note has been updated.",
        "/imagelibrary"
      );
    }
  }

  res.json({ success: true });
}
