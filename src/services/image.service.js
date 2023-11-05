import dbConn from "../config/db.js";

export async function updateImageNote(req, res) {
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

  await dbConn
    .execute(
      "INSERT INTO ImageNote (image_uid, author_uid, note) VALUES (?, ?, ?) \
        ON DUPLICATE KEY UPDATE note = VALUES(note)",
      [req.params.image_uid, req.userUID, req.body.note]
    )
    .catch((error) => {
      console.log("image.service.image: ", error);
      res.json({ success: false });
    });

  res.json({ success: true });
}
