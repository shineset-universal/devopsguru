import Redis from "ioredis";

let _redis: Redis | undefined;

function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error("REDIS_URL is not set");
    _redis = new Redis(url, { maxRetriesPerRequest: 3, lazyConnect: true });
  }
  return _redis;
}

// Lazy proxy — Redis client is created on first call, not at module import.
const redis = new Proxy({} as Redis, {
  get(_target, prop: string | symbol) {
    const r = getRedis();
    const val = r[prop as keyof Redis];
    return typeof val === "function"
      ? (val as (...args: unknown[]) => unknown).bind(r)
      : val;
  },
});

export default redis;
