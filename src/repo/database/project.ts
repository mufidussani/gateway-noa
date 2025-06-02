import * as db from "./db";
import mysql from "mysql2/promise";

let tableName = "tb_project";

export async function getProjectByIdClientList(id_client: number) {
  const query = `SELECT
                    ${tableName}.id
                    ,CONCAT(tb_client.client,"-",COALESCE(tb_service.service,"Null Service"),"-(",COALESCE(tb_business.kode,"NULL Business code"),".",COALESCE(tb_incomeCategory.kode,"NULL Incomecategory"),".",tb_client.id,".",COALESCE(tb_location.kode,"NULL Location"),")") as nama_project
                    FROM ${tableName}
                    JOIN tb_client ON tb_client.id = ${tableName}.id_client
                    LEFT JOIN tb_service ON tb_service.id = ${tableName}.id_service
                    LEFT JOIN tb_incomeCategory ON tb_incomeCategory.id = ${tableName}.id_incomeCategory
                    LEFT JOIN tb_location ON tb_location.id = ${tableName}.id_location
                    LEFT JOIN tb_business ON tb_business.id = tb_service.id_business
                    WHERE ${tableName}.statePermission = 2
                    AND tb_incomeCategory.kode = "RR"
                    AND ${tableName}.id_client = ${id_client}`;

  return await db.executeQuery(query);
}

export async function getIdClientByIdProject(id_project: number) {
  const query = `SELECT
                    id_client
                    FROM ${tableName}
                    WHERE id = ${id_project}`;

  return await db.executeQuery(query);
}

export async function getLatLngByIDManpower(id_manpower: string) {
  const query = `SELECT 
                  tb_project.lat
                  ,tb_project.lng FROM ${tableName}
                  JOIN tb_userManpower ON tb_userManpower.id_project = tb_project.id
                  WHERE tb_userManpower.id = "${id_manpower}"`;

  return await db.executeQuery(query);
}
