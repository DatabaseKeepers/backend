import dbConn from "../config/db.js";

export async function notify(receipient, sender, message, to) {
  try {
    const now = new Date();
    const { rows } = await dbConn.execute(
      "INSERT INTO \
        Notification (recipient_uid, sender_uid, message, createdAt, timestamp, `to`) \
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
        Notification WHERE recipient_uid = ? \
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

export async function read(req, res) {
  const { read } = req.body;

  if (read.length === 0) return res.status(204).end();

  try {
    const result = await dbConn.execute(
      "UPDATE Notification SET `read` = 1 WHERE uid IN (?)",
      [read]
    );
    return res.json({
      success: result.rowsAffected === read.length ? true : false,
      read,
    });
  } catch (error) {
    console.log("notification.service.read: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
