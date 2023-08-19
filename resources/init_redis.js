const redis = require("redis");

const redisClient = redis.createClient({
  port: 6739,
  host: "127.0.0.1",
});

(async () => {
  // Connect to redis server
  await redisClient.connect();
})();

redisClient.on("connect", () => {
  console.log("Client connected to Redis");
});

redisClient.on("ready", () => {
  console.log("Client connected to Redis and readied");
});

redisClient.on("end", () => {
  console.log("Client disconnected to Redis");
});

redisClient.on("error", (error) => {
  console.log(error.message);
});

process.on("SIGINT", () => {
  redisClient.quit();
});

module.exports = redisClient;
