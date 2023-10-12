import dbConn from "../config/db.js";

export const isAuthorized = async (req, res, next) => {
  try {
    const user = await dbConn.execute(
      "SELECT uid, role FROM User WHERE uid = ?",
      [req.userUID]
    );
    // We allow if the owner matches the user making the request
    // or if the user is a physician or radiologist
    const isOwnerOrAuthorized =
      (user.rows.length > 0 &&
        ["PHYSICIAN", "RADIOLOGIST"].includes(user.rows[0].role)) ||
      req.userUID === req.params.userId;

    if (isOwnerOrAuthorized) {
      return next();
    } else {
      return res
        .status(401)
        .send({ error: "You are not authorized to make this request" });
    }
  } catch (error) {
    console.log(error.code, error.message);
    return res
      .status(401)
      .send({ error: "You are not authorized to make this request" });
  }
};

// We allow if the user is a physician or radiologist
export const isStaff = async (req, res, next) => {
  try {
    const user = await dbConn.execute(
      "SELECT uid, role FROM User WHERE uid = ?",
      [req.userUID]
    );

    if (user.rows.length > 0 && ["PHYSICIAN", "RADIOLOGIST"].includes(user.rows[0].role)) {
      return next();
    } else {
      return res
        .status(401)
        .send({ error: "You are not authorized to make this request" });
    }
  } catch (error) {
    console.log(error.code, error.message);
    return res
      .status(401)
      .send({ error: "You are not authorized to make this request" });
  }
};
