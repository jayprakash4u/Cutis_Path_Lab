/**
 * Create the Cutis Path Lab schema in MySQL.
 * Run: npm run db:init
 */
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { connect, describeTarget } from "./db.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const sql = await readFile(path.join(HERE, "mysql-schema.sql"), "utf8");
  const conn = await connect({ multipleStatements: true });

  try {
    console.log(`Applying schema to ${describeTarget()} ...`);
    await conn.query(sql);

    const [tables] = await conn.query(
      `SELECT TABLE_NAME AS name, TABLE_ROWS AS approxRows
         FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME`,
    );

    console.log(`\nSchema ready — ${tables.length} tables:`);
    for (const t of tables) console.log(`  • ${t.name}`);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error("Schema init failed:", err.code || "", err.message);
  process.exit(1);
});
