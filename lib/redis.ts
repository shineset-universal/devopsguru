import Redis from "ioredis";

declare global {
  var _redis: Redis | undefined;
}

function createClient(): Redis {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error("REDIS_URL is not set");
  return new Redis(url, { maxRetriesPerRequest: 3, lazyConnect: true });
}

const redis: Redis = global._redis ?? createClient();

if (process.env.NODE_ENV !== "production") {
  global._redis = redis;
}

export default redis;
