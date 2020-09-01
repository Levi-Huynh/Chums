import { mySQLPool } from "./pool";
import { PoolConnection, MysqlError } from "mysql";

export class DB {

  public static async usePooledConnectionAsync(actionAsync: (connect: PoolConnection) => any) {
    const connection: PoolConnection = await new Promise((resolve, reject) => {
      mySQLPool.getConnection((ex: MysqlError, conn: PoolConnection) => { if (ex) reject(ex); else resolve(conn); });
    });
    try {
      return await actionAsync(connection);
    } finally {
      connection.release();
    }
  }

  public static async queryOne(sql: string, params: any[]) {
    return this.query(sql, params).then((result: any[]) => {
      return result.length > 0 ? result[0] : null;
    });
  }

  public static async query(sql: string, params: any[]) {
    return this.usePooledConnectionAsync(async (connection) => {
      const result: any[] = await new Promise((resolve, reject) => {
        connection.query(sql, params, (ex, rows) => { if (ex) reject(ex); else resolve(rows); });
      });
      return result;
    });
  }
}