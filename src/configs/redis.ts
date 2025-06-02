import Redis from "ioredis";
require("dotenv").config();

const HOST = process.env.REDIS_HOST || "";
const PORT = process.env.REDIS_PORT || 0;
const baseRoute = process.env.BASE_ROUTE || "";

let redis: Redis;

// production
if (baseRoute === "") {
  redis = new Redis({
    port: +PORT, // Redis port
    host: HOST, // Redis host
  });
} else {
  // development
  redis = new Redis({
    path: "/home/wasteand/redis.sock",
  });
}

export default redis;
