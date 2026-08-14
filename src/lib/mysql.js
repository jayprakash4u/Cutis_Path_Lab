import mysql from "mysql2/promise";
import { randomUUID } from "crypto";

const HOST = process.env.MYSQL_HOST || "127.0.0.1";
const PORT = Number(process.env.MYSQL_PORT || "3306");
const DATABASE = process.env.MYSQL_DATABASE || "cutispathlab";
const USER = process.env.MYSQL_USER || "root";
const PASSWORD = process.env.MYSQL_PASSWORD || "";
const CONNECTION_LIMIT = Number(process.env.MYSQL_CONNECTION_LIMIT || "10");

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function sslOption() {
  // MYSQL_SSL=true for hosts that require TLS; "skip-verify" for self-signed certs.
  const mode = String(process.env.MYSQL_SSL || "").toLowerCase();
  if (mode === "true" || mode === "required") return {};
  if (mode === "skip-verify") return { rejectUnauthorized: false };
  return undefined;
}

/**
 * Pool is cached on globalThis so Next.js dev hot-reloads reuse connections
 * instead of leaking a new pool on every module refresh.
 */
function createPool() {
  return mysql.createPool({
    host: HOST,
    port: PORT,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    waitForConnections: true,
    connectionLimit: CONNECTION_LIMIT,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    charset: "utf8mb4_general_ci",
    timezone: "Z",
    // DECIMAL as JS numbers and DATETIME as Date (JSON-serialized to ISO), so
    // responses keep the shapes the old `FOR JSON` queries produced.
    decimalNumbers: true,
    ssl: sslOption(),
  });
}

export function getPool() {
  if (!globalThis.__cutisMysqlPool) {
    globalThis.__cutisMysqlPool = createPool();
  }
  return globalThis.__cutisMysqlPool;
}

function logDbError(context, error) {
  console.error(`[mysql] ${context}`, error?.code || "", error?.message || error);
}

function toPublicDbError(error, context) {
  logDbError(context, error);
  if (isProduction()) {
    return new Error("Database operation failed");
  }
  const where = `${HOST}:${PORT}/${DATABASE}`;
  return new Error(`${error?.code ? `${error.code}: ` : ""}${error?.message || error} (${where})`);
}

/** SELECT returning all rows. Always pass values via `params`, never string-concat. */
export async function sqlQuery(sql, params = []) {
  try {
    const [rows] = await getPool().execute(sql, params);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    throw toPublicDbError(error, "query failed");
  }
}

/** SELECT returning the first row, or null. */
export async function sqlOne(sql, params = []) {
  const rows = await sqlQuery(sql, params);
  return rows.length ? rows[0] : null;
}

/** INSERT/UPDATE/DELETE. Returns { affectedRows, insertId }. */
export async function sqlExec(sql, params = []) {
  try {
    const [result] = await getPool().execute(sql, params);
    return result;
  } catch (error) {
    throw toPublicDbError(error, "exec failed");
  }
}

/**
 * Run several statements atomically on one connection.
 * `fn` receives a connection exposing the same query/exec helpers.
 */
export async function sqlTransaction(fn) {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const api = {
      query: async (sql, params = []) => {
        const [rows] = await conn.execute(sql, params);
        return Array.isArray(rows) ? rows : [];
      },
      one: async (sql, params = []) => {
        const [rows] = await conn.execute(sql, params);
        return Array.isArray(rows) && rows.length ? rows[0] : null;
      },
      exec: async (sql, params = []) => {
        const [result] = await conn.execute(sql, params);
        return result;
      },
    };
    const out = await fn(api);
    await conn.commit();
    return out;
  } catch (error) {
    await conn.rollback().catch(() => {});
    throw toPublicDbError(error, "transaction failed");
  } finally {
    conn.release();
  }
}

/** MySQL has no boolean type — TINYINT(1) comes back as 0/1. */
export function toBool(value) {
  return value === 1 || value === true || value === "1";
}

/** Clamp a user-supplied LIMIT to a safe integer for inlining (mysql2 can't bind LIMIT). */
export function safeLimit(value, max = 100) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(Math.floor(n), max);
}

export function newId() {
  return randomUUID();
}
