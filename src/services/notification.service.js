import dbConn from "../config/db.js";

export async function notify(receipient, sender, message, to) {
  try {
    const now = new Date();
    const { rows } = await dbConn.execute(
      "INSERT INTO \
        Notification (recipient_uid, sender_uid, message, createdAt, timestamp, to) \
        VALUES (?, ?, ?, ?, ?, ?)",
      [receipient, sender, message, now, now, to]
    );
  } catch (error) {
    console.log("notification.service.notify: ", error);
  }
}

export async function polling(req, res) {
  try {
    const { rows } = await dbConn.execute(
      "\
      SELECT \
        uid, `read`, timestamp, message, DATE(createdAt) as createdAt, `to` \
      FROM \
        Notification WHERE `read` = 0 AND recipient_uid = ? \
      ORDER BY timestamp DESC",
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
