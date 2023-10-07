import { connect } from "@planetscale/database";
import { DATABASE_URL } from "../utils/environment.js";

const sqlConfig = {
  url: DATABASE_URL,
};

const dbConn = connect(sqlConfig);

export default dbConn;
