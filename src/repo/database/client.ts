import * as db from "./db";
import mysql from "mysql2/promise";

let tableName = "tb_client";

export async function getAllList(searchValue: string) {
  const query = `SELECT DISTINCT
                    ${tableName}.id
                    ,${tableName}.client
                    FROM ${tableName}
                    JOIN tb_project ON tb_project.id_client = ${tableName}.id
                    JOIN tb_incomeCategory ON tb_incomeCategory.id = tb_project.id_incomeCategory
                    WHERE ${tableName}.statePermission = 2
                    AND tb_incomeCategory.kode = "RR"
                    AND ${tableName}.client LIKE "%${searchValue}%"`;

  return await db.executeQuery(query);
}
