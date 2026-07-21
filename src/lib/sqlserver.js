import { execFile } from "child_process";
import { promisify } from "util";
import { randomUUID } from "crypto";
import { readFile, unlink, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";

const execFileAsync = promisify(execFile);

const DEFAULT_SERVER =
  process.platform === "win32" ? "localhost\\SQLEXPRESS" : "localhost\\SQLEXPRESS";

const SERVER = process.env.SQLSERVER_HOST || DEFAULT_SERVER;
const DATABASE = process.env.SQLSERVER_DATABASE || "CutisPathLab";
const LOGIN_TIMEOUT = Number(process.env.SQLSERVER_LOGIN_TIMEOUT || "60");
const MAX_RETRIES = Number(process.env.SQLSERVER_MAX_RETRIES || "3");
const READ_CACHE_MS = Number(process.env.SQLSERVER_READ_CACHE_MS || "120000");

const readCache = new Map();
const inflightReads = new Map();

function normalizeQueryKey(query) {
  return query.replace(/\s+/g, " ").trim();
}

/** Drop cached reads after admin writes. */
export function clearReadCache() {
  readCache.clear();
}

function getCachedRead(query) {
  if (READ_CACHE_MS <= 0) return null;
  const key = normalizeQueryKey(query);
  const hit = readCache.get(key);
  if (hit && Date.now() - hit.at < READ_CACHE_MS) {
    return hit.data;
  }
  return null;
}

function setCachedRead(query, data) {
  if (READ_CACHE_MS <= 0) return;
  readCache.set(normalizeQueryKey(query), { data, at: Date.now() });
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function logDbError(context, error, detail = "") {
  console.error(`[sqlserver] ${context}`, error?.message || error, detail);
}

function toPublicDbError(error, detail = "") {
  logDbError("query failed", error, detail);
  if (isProduction()) {
    return new Error("Database operation failed");
  }
  if (detail) {
    return new Error(`${error?.message || "sqlcmd error"} | ${detail}`);
  }
  return error instanceof Error ? error : new Error(String(error));
}

let sqlcmdChain = Promise.resolve();

function enqueueSqlcmd(task) {
  const run = sqlcmdChain.then(task, task);
  sqlcmdChain = run.then(
    () => {},
    () => {},
  );
  return run;
}

async function runSqlcmd(args, options = {}) {
  return execFileAsync(
    "sqlcmd",
    ["-S", SERVER, "-E", "-C", "-l", String(LOGIN_TIMEOUT), "-d", DATABASE, ...args],
    {
      maxBuffer: 10 * 1024 * 1024,
      windowsHide: true,
      ...options,
    },
  );
}

async function runSqlcmdWithRetry(args, options = {}) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await runSqlcmd(args, options);
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw toPublicDbError(
    lastError,
    isProduction()
      ? ""
      : `sqlcmd failed after ${MAX_RETRIES} attempts (server: ${SERVER}, database: ${DATABASE})`,
  );
}

/**
 * Run a SQL batch against CutisPathLab using Windows Auth (sqlcmd).
 * Pass a SELECT ... FOR JSON PATH query.
 * Reads run in parallel (not queued) and are cached briefly in dev.
 */
export async function sqlJson(query) {
  const cached = getCachedRead(query);
  if (cached !== null) return cached;

  const key = normalizeQueryKey(query);
  if (inflightReads.has(key)) {
    return inflightReads.get(key);
  }

  const run = sqlJsonUncached(query)
    .then((data) => {
      setCachedRead(query, data);
      return data;
    })
    .finally(() => {
      inflightReads.delete(key);
    });

  inflightReads.set(key, run);
  return run;
}

async function sqlJsonUncached(query) {
  const outFile = path.join(tmpdir(), `cutis-json-${randomUUID()}.txt`);
  const sqlFile = path.join(tmpdir(), `cutis-sql-${randomUUID()}.sql`);

  const wrapped = `
SET NOCOUNT ON;
DECLARE @json NVARCHAR(MAX);
SET @json = (${query});
SELECT ISNULL(@json, N'[]');
`;

  try {
    await writeFile(sqlFile, wrapped, "utf8");

    // Read queries are not queued — homepage fires several API calls at once.
    await runSqlcmdWithRetry(["-y", "0", "-i", sqlFile, "-o", outFile]);

    const raw = await readFile(outFile, "utf8");
    const text = raw
      .replace(/\r/g, "")
      .split("\n")
      .map((l) => l.trim())
      .filter(
        (l) =>
          l &&
          l !== "NULL" &&
          !/^-+$/.test(l) &&
          !/^:/i.test(l) &&
          l.toLowerCase() !== "null",
      )
      .join("");

    const jsonStart = text.indexOf("[");
    const jsonObjStart = text.indexOf("{");
    let start = -1;
    if (jsonStart >= 0 && jsonObjStart >= 0) start = Math.min(jsonStart, jsonObjStart);
    else start = Math.max(jsonStart, jsonObjStart);

    const jsonText = start >= 0 ? text.slice(start) : text;
    if (!jsonText) return [];

    return JSON.parse(jsonText);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw toPublicDbError(error, isProduction() ? "" : "Could not parse SQL JSON result");
    }

    let outSnippet = "";
    try {
      const failedOut = await readFile(outFile, "utf8");
      outSnippet = failedOut.trim().slice(0, 500);
    } catch {
      // ignore missing output file
    }

    throw toPublicDbError(
      error,
      isProduction() ? "" : outSnippet ? `sqlcmd output: ${outSnippet}` : "",
    );
  } finally {
    await unlink(outFile).catch(() => {});
    await unlink(sqlFile).catch(() => {});
  }
}

/** Run a write query (INSERT/UPDATE). */
export async function sqlExec(query) {
  await enqueueSqlcmd(async () => {
    const { stderr, stdout } = await runSqlcmdWithRetry(["-b", "-Q", query]);
    const errText = (stderr || stdout || "").trim();
    if (errText && /error|failed|violation/i.test(errText)) {
      throw toPublicDbError(new Error("SQL execution failed"), isProduction() ? "" : errText);
    }
    clearReadCache();
  });
}

export function newId() {
  return randomUUID();
}

export function escapeSql(value) {
  if (value == null) return "NULL";
  return `N'${String(value).replace(/'/g, "''")}'`;
}
