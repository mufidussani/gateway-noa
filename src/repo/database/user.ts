import * as db from "./db";
import mysql from "mysql2/promise";

let tableName = "tb_userNoa"

export const checkSingleValueInDatabase = (
  columnName: string
) => {
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

export const checkSingleValueExistedInDatabase = (columnName: string) => {
  return (value: any, { req }: any) => {
    return new Promise<void>(async (resolve: any, reject: any) => {
      try {
        const query = `SELECT ${columnName} FROM ${tableName} WHERE ${columnName} = "${value}"`;
        // console.log(query);

        const results = await db.executeQuery(query);

        if (results.length == 0) {
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

export async function login(data: any) {
  const query = `SELECT 
                    ${tableName}.id
                    ,${tableName}.name
                    ,${tableName}.id_level
                    ,${tableName}.id_client
                    ,${tableName}.id_project
                    ,CASE
                      WHEN ${tableName}.id_level = 1 THEN "ALL"
                      ELSE tb_business.kode
                    END as kode_service 
                    FROM ${tableName}
                    LEFT JOIN tb_project ON tb_project.id = ${tableName}.id_project
                    LEFT JOIN tb_service ON tb_service.id = tb_project.id_service
                    LEFT JOIN tb_business ON tb_business.id = tb_service.id_business
                    WHERE ${tableName}.email="${data.email}" 
                    AND  ${tableName}.password="${data.password}"`;

  return await db.executeQuery(query);
}

export async function create(tx: mysql.PoolConnection, data: any) {
  const query = `INSERT INTO ${tableName} (
                  id,
                  name,
                  email,
                  no_hp,
                  password,
                  id_level,
                  id_client,
                  id_project,
                  create_date,
                  create_by
                ) VALUES (
                  "${data.id}",
                  "${data.name}",
                  "${data.email}",
                  "${data.no_hp}",
                  "${data.password}",
                  "${data.id_level}",
                  "${data.id_client}",
                  "${data.id_project}",
                  NOW(),
                  "${data.create_by}"
                )`;
  const [result, _] = await tx.query(query);

  return result as mysql.ResultSetHeader;
}

export async function getAll(
  offset: number,
  limit: number,
  searchValue: string
) {
  const query = `SELECT
                  ${tableName}.id
                  ,${tableName}.name
                  ,${tableName}.email
                  ,${tableName}.no_hp
                  ,${tableName}.id_level as id_level
                  ,tb_levelNoa.level as level
                  ,tb_client.client
                  ,CONCAT(tb_client.client,"-",COALESCE(tb_service.service,"Null Service"),"-(",COALESCE(tb_business.kode,"NULL Business code"),".",COALESCE(tb_incomeCategory.kode,"NULL Incomecategory"),".",tb_client.id,".",COALESCE(tb_location.kode,"NULL Location"),")") as nama_project
                  FROM ${tableName}
                  LEFT JOIN tb_levelNoa ON tb_levelNoa.id = ${tableName}.id_level
                  LEFT JOIN tb_client ON tb_client.id = ${tableName}.id_client
                  LEFT JOIN tb_project ON tb_project.id = ${tableName}.id_project
                  LEFT JOIN tb_service ON tb_service.id = tb_project.id_service
                  LEFT JOIN tb_incomeCategory ON tb_incomeCategory.id = tb_project.id_incomeCategory
                  LEFT JOIN tb_location ON tb_location.id = tb_project.id_location
                  LEFT JOIN tb_business ON tb_business.id = tb_service.id_business
                  WHERE ${tableName}.name LIKE "%${searchValue}%" 
                  OR tb_client.client LIKE "%${searchValue}%"
                  LIMIT ${limit} OFFSET ${offset}`;

  return await db.executeQuery(query);
}
