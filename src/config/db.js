import { connect } from "@planetscale/database";

const sqlConfig = {
  url: process.env.DATABASE_URL,
};

const dbConn = connect(sqlConfig);

export default dbConn;
