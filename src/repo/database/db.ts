import * as DB from "../../configs/db"
import mysql from "mysql2/promise";

const dbConfig = {
  host: DB.HOST,
  user: DB.USER,
  password: DB.PASSWORD,
  database: DB.DB,
};

const pool = mysql.createPool({
  host: DB.HOST,
  user: DB.USER,
  password: DB.PASSWORD,
  database: DB.DB,
  waitForConnections: DB.waitForConnection,
  connectionLimit: 0,
  queueLimit: 0,
});

export async function executeQuery(query: string) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result]: any = await connection.execute(query);
    await connection.end();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function beginTransaction(): Promise<mysql.PoolConnection> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    return connection;
  } catch (err) {
    console.error("Error beginning transaction:", err);
    connection.release();
    throw err; // Rethrow the error to indicate the failure
  }
}

export async function rollback(
  connection: mysql.PoolConnection
): Promise<void> {
  try {
    await connection.rollback();
  } catch (err) {
    console.error("Error rolling back transaction:", err);
  } finally {
    connection.release();
  }
}