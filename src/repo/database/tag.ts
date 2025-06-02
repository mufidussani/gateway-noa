import * as db from "./db";
import mysql from "mysql2/promise";

let tableName = "tb_tagNoa";

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
