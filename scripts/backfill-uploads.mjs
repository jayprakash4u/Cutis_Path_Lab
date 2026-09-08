/**
 * Copy existing public/images uploads into UploadedImage so live can serve them.
 * Run: node scripts/backfill-uploads.mjs
 */
import { randomUUID } from "crypto";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { connect, describeTarget } from "./db.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FOLDERS = [
  "about",
  "banners",
  "blogs",
  "categories",
  "gallery",
  "home",
  "packages",
  "referrals",
  "services",
  "team",
  "testimonials",
  "tests",
];

const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`UploadedImage\` (
  \`id\`        VARCHAR(50)  NOT NULL,
  \`folder\`    VARCHAR(64)  NOT NULL,
  \`filename\`  VARCHAR(255) NOT NULL,
  \`mimeType\`  VARCHAR(64)  NOT NULL,
  \`bytes\`     MEDIUMBLOB   NOT NULL,
  \`createdAt\` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`UQ_UploadedImage_folder_filename\` (\`folder\`, \`filename\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

async function main() {
  const conn = await connect();
  try {
    console.log(`Backfilling uploads into ${describeTarget()} ...`);
    await conn.query(CREATE_TABLE_SQL);

    const [gallery] = await conn.query(
      "SELECT `id`, `imageUrl` FROM `GalleryImage` ORDER BY `createdAt` DESC",
    );
    console.log(`Gallery rows: ${gallery.length}`);
    for (const row of gallery) {
      console.log(`  ${row.id}  ${row.imageUrl}`);
    }

    let saved = 0;
    for (const folder of FOLDERS) {
      const dir = path.join(ROOT, "public", "images", folder);
      let names;
      try {
        names = await readdir(dir);
      } catch {
        continue;
      }
      for (const filename of names) {
        const ext = path.extname(filename).toLowerCase();
        const mimeType = MIME_BY_EXT[ext];
        if (!mimeType) continue;
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z]+$/i.test(filename)) {
          continue;
        }
        const bytes = await readFile(path.join(dir, filename));
        await conn.execute(
          `INSERT INTO \`UploadedImage\` (\`id\`, \`folder\`, \`filename\`, \`mimeType\`, \`bytes\`)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE \`mimeType\` = VALUES(\`mimeType\`), \`bytes\` = VALUES(\`bytes\`)`,
          [randomUUID(), folder, filename, mimeType, bytes],
        );
        saved += 1;
        console.log(`  stored ${folder}/${filename} (${bytes.length} bytes)`);
      }
    }
    console.log(`Done. Stored ${saved} file(s).`);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error("Backfill failed:", err.code || "", err.message);
  process.exit(1);
});
