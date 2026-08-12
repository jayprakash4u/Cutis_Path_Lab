/**
 * Shared MySQL helper for the CLI scripts in this folder.
 * Loads .env.local (then .env) so scripts see the same config Next.js does.
 */
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadEnvFile(file) {
  let raw;
  try {
    raw = await readFile(path.join(ROOT, file), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

export async function loadEnv() {
  await loadEnvFile(".env.local");
  await loadEnvFile(".env");
}

export function dbConfig() {
  return {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "cutispathlab",
  };
}

export async function connect({ multipleStatements = false } = {}) {
  await loadEnv();
  const cfg = dbConfig();
  const conn = await mysql.createConnection({
    ...cfg,
    multipleStatements,
    charset: "utf8mb4_general_ci",
    dateStrings: true,
  });
  return conn;
}

export function describeTarget() {
  const cfg = dbConfig();
  return `${cfg.user}@${cfg.host}:${cfg.port}/${cfg.database}`;
}
