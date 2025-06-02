import * as db from "./db";
import mysql from "mysql2/promise";

let tableName = "tb_shiftNoa";

export async function getByID(id: number) {
  const query = `SELECT
                    id
                    ,shift
                    ,start
                    ,end
                    FROM ${tableName}
                    WHERE id = ${id};`;

  return await db.executeQuery(query);
}


