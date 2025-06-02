import * as db from "./db";
import mysql from "mysql2/promise";

let tableName = "tb_presence"

export async function criteriaNotMet (id:string) {
    const query = `SELECT tbp.id, 
                    tbp.id_shift,
                    tbs.end
                        FROM 
                        tb_presence as tbp
                        JOIN 
                        tb_shiftNoa as tbs
                        ON 
                        tbs.id = tbp.id_shift
                        WHERE 
                        tbp.id = "${id}"`
    return await db.executeQuery(query);
}

export async function selectShift(id: number) {
    const query = `SELECT id, start, end
                   FROM tb_shiftNoa
                   WHERE id = ${id}`
    console.log("query:", query)
    return await db.executeQuery(query);
}