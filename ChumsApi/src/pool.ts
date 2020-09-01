import dotenv from "dotenv";
import mysql from "mysql";

dotenv.config();

export const mySQLPool = mysql.createPool({
  connectionLimit: 5, // process.env.CONNECTION_LIMIT,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});
