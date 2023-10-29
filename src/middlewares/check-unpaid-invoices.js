import dbConn from "../config/db.js";

async function checkUnpaidInvoices(req, res, next) {
  try {
    const unpaidInvoice = await dbConn.execute(
      "SELECT COUNT(*) FROM Invoice WHERE patient_uid = ? AND paid = 0",
      [req.userUID]
    );

    if (unpaidInvoice.rows[0]["count(*)"] > 0) {
      return res.status(409).json({
        msg: "You have unpaid invoices. Please pay or cancel them before requesting another opinion.",
      });
    }

    next();
  } catch (error) {
    console.log("checkUnpaidInvoices: ", error);
  }
}

export default checkUnpaidInvoices;
