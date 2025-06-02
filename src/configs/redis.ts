import Redis from "ioredis";

require("dotenv").config();

const HOST = process.env.REDIS_HOST || "";
const PORT = process.env.REDIS_PORT || 0;

const redis = new Redis({
  port: +PORT, // Redis port
  host: HOST, // Redis host
});

export default redis;
