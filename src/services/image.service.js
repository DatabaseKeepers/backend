import dbConn from "../config/db.js";

export async function updateImageNote(req, res) {
  const result = await dbConn
    .execute(
      "INSERT INTO ImageNote (image_uid, author_uid, note) VALUES (?, ?, ?) \
        ON DUPLICATE KEY UPDATE note = VALUES(note)",
      [req.params.image_uid, req.userUID, req.body.note]
    )
    .catch((error) => {
      console.log("image.service.image: ", error);
      res.json({ success: false });
    });

  console.log(result);
  res.json({ success: true, note: req.body.note });
}
