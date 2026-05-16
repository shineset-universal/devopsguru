import { Pool, type PoolConfig } from "pg";

let _pool: Pool | undefined;

// pg-connection-string crashes on Node.js 20 when the scheme is postgresql:// or postgres://
// because it calls new URL(str, 'postgres://base') and Node 20 rejects non-standard base schemes.
// Bypass it by parsing the URL ourselves using http:// as a temporary scheme.
function parseDbUrl(str: string): PoolConfig {
  const url = new URL(str.replace(/^postgres(?:ql)?:\/\//, "http://"));
  return {
    host:     url.hostname,
    port:     parseInt(url.port || "5432", 10),
    database: url.pathname.slice(1),
    user:     decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    max:      10,
  };
}

function getPool(): Pool {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set");
    _pool = new Pool(parseDbUrl(connectionString));
  }
  return _pool;
}

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
