import { Pool } from "./Pool";
import { PoolConnection, MysqlError } from "mysql";
import { StaticLogger } from './helpers/StaticLogger'
import { logger } from "express-winston";

export class DB {

  public static async usePooledConnectionAsync(actionAsync: (connect: PoolConnection) => any) {
    const connection: PoolConnection = await new Promise((resolve, reject) => {
      Pool.current.getConnection((ex: MysqlError, conn: PoolConnection) => { if (ex) reject(ex); else resolve(conn); });
    });
    try {
      return await actionAsync(connection);
    } catch (ex) {
      StaticLogger.current.error(ex);
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
        connection.query(sql, params, async (ex, rows) => {
          if (ex) {
            StaticLogger.current.error(ex);
            reject(ex);
          }
          else {
            StaticLogger.current.info(rows);
            resolve(rows);
          }
        });

      });

      return result;
    });
  }
}