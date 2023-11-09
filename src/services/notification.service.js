import dbConn from "../config/db.js";

export async function create(receipient, sender, message) {
  try {
    const now = new Date();
    const { rows } = await dbConn.execute(
      "INSERT INTO \
        Notification (recipient_uid, sender_uid, message, createdAt, timestamp) \
        VALUES (?, ?, ?, ?)",
      [receipient, sender, message, now, now]
    );
  } catch (error) {
    console.log("notification.service.create: ", error);
  }
}

export async function polling(req, res) {
  try {
    const { rows } = await dbConn.execute(
      "\
      SELECT \
        uid, `read`, timestamp, message, createdAt \
      FROM \
        Notification WHERE `read` = 0 AND recipient_uid = ?",
      [req.userUID]
    );
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(204).end();
    }
  } catch (error) {
    console.log("notification.service.polling: ", error);
  }
}
