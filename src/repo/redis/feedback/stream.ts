import redis from "../../../configs/redis";

require("dotenv").config();

const STREAM_KEY = process.env.REDIS_STREAM_KEY_FEEDBACK || "";

export async function publisher(message: any) {
  await redis.xadd(STREAM_KEY, "*", "data", JSON.stringify(message));
}

export const messageFormat = {
  trx_type: "",
  sub_type: "",
  id_user: "",
  data: {},
};
