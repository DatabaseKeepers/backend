import dbConn from "../config/db.js";

async function checkExistingImages(req, res, next) {
  try {
    const existingImages = await dbConn.execute(
      "SELECT COUNT(*) FROM Image WHERE uploaded_for = ?",
      [req.userUID]
    );

    console.log(typeof(existingImages.rows[0]["count(*)"]));
    if (existingImages.rows[0]["count(*)"] === '0') {
      return res.status(409).json({
        msg: "Your account has no existing images. Contact your physician for more information.",
      });
    }

    next();
  } catch (error) {
    console.log("checkExistingImages: ", error);
  }
}

export default checkExistingImages;
