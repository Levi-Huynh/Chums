import dotenv from "dotenv";
import fs from "fs-extra";
import mysql from "mysql";
import util from "util";

const init = async () => {
  // read environment variables
  dotenv.config();
  // create an instance of the MySQL client
  console.log(process.env.DB_HOST);

  const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    debug: true,
  });

  const query = util.promisify(conn.query).bind(conn);

  try {
    var sql = await fs.readFile("./tools/initdb.mysql", { encoding: "UTF-8" });
    const statements = sql.split(/;\s*$/m);
    for (const statement of statements) {
      if (statement.length > 3) {
        console.log("*************");
        console.log(statement);
        await query(statement);
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    conn.end();
  }
};

init()
  .then(() => {
    console.log("Database Created");
  })
  .catch(() => {
    console.log("Database not created due to errors");
  });
