import { Pool } from "pg";

let _pool: Pool | undefined;

function getPool(): Pool {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set");
    _pool = new Pool({ connectionString, max: 10 });
  }
  return _pool;
}

// Lazy proxy — pool is created on first query, not at module import.
const pool = new Proxy({} as Pool, {
  get(_target, prop: string | symbol) {
    const p = getPool();
    const val = p[prop as keyof Pool];
    return typeof val === "function"
      ? (val as (...args: unknown[]) => unknown).bind(p)
      : val;
  },
});

export default pool;
