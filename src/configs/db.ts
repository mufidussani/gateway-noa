require("dotenv").config();

export const HOST: string = process.env.DB_HOST || "";
export const USER: string = process.env.DB_USER || "";
export const PASSWORD: string = process.env.DB_PASSWORD || "";
export const DB: string = process.env.DB_DATABASE || "";
export const waitForConnection = true;
export const conlimit = 10;
export const queueLimit = 0;
export const dialect: string = "mysql";
export const pool: {
  max: number;
  min: number;
  acquire: number;
  idle: number;
} = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000,
};
