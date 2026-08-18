/**
 * Create the BlogPost table and seed it from src/data/blogPosts.js.
 *
 *   node scripts/seed-blog.mjs
 *
 * Additive and re-runnable: CREATE TABLE IF NOT EXISTS + INSERT IGNORE, so it
 * never touches an existing table and never overwrites a post that is already
 * there (edits made in the admin panel are safe).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Next loads .env itself; a standalone script has to do it by hand.
for (const file of [".env", ".env.local"]) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const DDL = `
CREATE TABLE IF NOT EXISTS \`BlogPost\` (
  \`id\`           VARCHAR(50)  NOT NULL,
  \`slug\`         VARCHAR(200) NOT NULL,
  \`title\`        VARCHAR(300) NOT NULL,
  \`excerpt\`      TEXT         NULL,
  \`content\`      LONGTEXT     NULL,
  \`category\`     VARCHAR(50)  NOT NULL DEFAULT 'Blog',
  \`author\`       VARCHAR(150) NULL,
  \`imageUrl\`     VARCHAR(500) NULL,
  \`readMinutes\`  INT          NOT NULL DEFAULT 4,
  \`publishedAt\`  DATE         NULL,
  \`isActive\`     TINYINT(1)   NOT NULL DEFAULT 1,
  \`sortOrder\`    INT          NOT NULL DEFAULT 0,
  \`createdAt\`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`UQ_BlogPost_slug\` (\`slug\`),
  KEY \`IX_BlogPost_active\` (\`isActive\`, \`publishedAt\`),
  KEY \`IX_BlogPost_category\` (\`category\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const { blogPosts } = await import(
  "file:///" + path.join(root, "src/data/blogPosts.js").replace(/\\/g, "/")
);

const conn = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectTimeout: 20000,
  charset: "utf8mb4_general_ci",
});

console.log(`  connected to ${process.env.MYSQL_HOST}/${process.env.MYSQL_DATABASE}`);

const [existing] = await conn.query("SHOW TABLES LIKE 'BlogPost'");
console.log(`  BlogPost already existed: ${existing.length > 0}`);

await conn.query(DDL);
console.log("  table ready");

let inserted = 0;
for (const [i, p] of blogPosts.entries()) {
  const [res] = await conn.execute(
    `INSERT IGNORE INTO \`BlogPost\`
       (\`id\`, \`slug\`, \`title\`, \`excerpt\`, \`content\`, \`category\`,
        \`author\`, \`imageUrl\`, \`readMinutes\`, \`publishedAt\`, \`isActive\`, \`sortOrder\`)
     VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, 1, ?)`,
    [
      `post-${String(p.id).padStart(3, "0")}`,
      p.slug,
      p.title,
      p.excerpt ?? null,
      p.category ?? "Blog",
      p.author ?? "Cutis Path Lab",
      p.image ?? null,
      Number(p.readMinutes) || 4,
      p.date ?? null,
      i,
    ],
  );
  if (res.affectedRows) inserted += 1;
}

console.log(`  inserted ${inserted} new of ${blogPosts.length} posts`);

const [[c]] = await conn.query(
  "SELECT COUNT(*) AS total, SUM(`category`='Blog') AS blog, SUM(`category`='Health') AS health FROM `BlogPost`",
);
console.log(`  BlogPost rows: ${c.total}  (Blog ${c.blog}, Health ${c.health})`);

await conn.end();
