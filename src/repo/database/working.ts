import * as db from "./db";
import mysql from "mysql2/promise";

let tableName = "tb_workingNoa";

export async function getDailyByIDSubareaIDShiftToday(
  id_subarea: number,
  id_shift: number
) {
  const query = `SELECT
                  id
                  FROM ${tableName}
                  WHERE id_subarea = ${id_subarea}
                  AND id_shift = ${id_shift}
                  AND id_type = 3
                  AND DATE(create_date) = DATE(NOW())`;

  return await db.executeQuery(query);
}
