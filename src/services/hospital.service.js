import dbConn from "../config/db.js";

export async function hospitals(_req, res) {
  const result = await dbConn
    .execute("SELECT uid, name from Hospital ORDER BY name")
    .catch((error) => {
      console.log("hospital.service.hospitals: ", error);
      res.json({ hospitals: [] });
    });

  res.json({ hospitals: result.rows });
}
