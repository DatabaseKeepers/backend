import dbConn from "../config/db.js";

async function checkImageHasInvoice(req, res, next) {
  try {
    const result = await dbConn
      .execute(
        "SELECT \
          IFNULL(inv.uid, 'No Invoice') as invoice_uid \
        FROM \
          Image i \
        LEFT JOIN \
          Invoice inv ON i.uid = inv.image_uid AND inv.radiologist_uid = ? \
        WHERE i.uid = ?",
        [req.params.uid, req.body.image]
      )
      .catch((error) => {
        console.log("checkImageHasInvoice: ", error);
        res.json({ success: false });
      });

    if (result.size > 0 && result.rows[0].invoice_uid === "No Invoice") {
      next();
    } else {
      return res.status(409).json({
        success: false,
        msg: "Image already has an invoice for this radiologist.",
      });
    }
  } catch (error) {
    console.log("checkImageHasInvoice: ", error);
  }
}

export default checkImageHasInvoice;
