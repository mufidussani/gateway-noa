import * as db from "./db";
import mysql from "mysql2/promise";

let tableName = "tb_userManpower";

export async function getByNIP(nip: string) {
  const query = `SELECT 
                    id
                    ,nip
                    ,name
                    ,no_hp
                    FROM ${tableName}
                    WHERE nip = "${nip}"`;

  return await db.executeQuery(query);
}

export async function updatePasswordByID(tx: mysql.PoolConnection, data: any) {
  const query = `UPDATE ${tableName} SET
                  password = "${data.password}"
                  ,update_date = NOW()
                  ,update_by = "${data.id}"
                  WHERE id = "${data.id}"`;

  const [result, _] = await tx.query(query);

  return result as mysql.ResultSetHeader;
}

export async function login(nip: string, password: string) {
  const query = `SELECT 
                  id
                  ,nip
                  ,name
                  ,id_project
                  FROM ${tableName}
                  WHERE nip = "${nip}"
                  AND password = "${password}"`;
                  
  return await db.executeQuery(query);
}

export const checkSingleValueInDatabase = (columnName: string) => {
  return (value: any, { req }: any) => {
    return new Promise<void>(async (resolve: any, reject: any) => {
      try {
        const query = `SELECT ${columnName} FROM ${tableName} WHERE ${columnName} = "${value}"`;
        // console.log(query);

        const results = await db.executeQuery(query);

        if (results.length > 0) {
          throw new Error("Error");
        }
        resolve();
      } catch (err) {
        // console.log(err);

        return reject(new Error("Error"));
      }
    });
  };
};
