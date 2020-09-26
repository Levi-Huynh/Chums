import dotenv from "dotenv";
import mysql from "mysql";

dotenv.config();

export class Pool {
  public static current: mysql.Pool;

  private static initPool() {
    Pool.current = mysql.createPool({
      connectionLimit: 10, // process.env.CONNECTION_LIMIT,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
      typeCast: function castField(field, useDefaultTypeCasting) {
        // convert bit(1) to bool
        if ((field.type === "BIT") && (field.length === 1)) {
          try {
            const bytes = field.buffer();
            return (bytes[0] === 1);
          } catch (e) { return false; }
        }

        return (useDefaultTypeCasting());

      }
    });
  }

}


