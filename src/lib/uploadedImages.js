import { NextResponse } from "next/server";
import { unlink, readFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { getPool, newId, sqlExec, sqlOne } from "@/lib/mysql";

/**
 * Folders admin uploads are allowed to write. Kept in one place so the upload
 * route, the public file server, and deletes cannot drift.
 */
export const UPLOAD_FOLDERS = new Set([
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
]);

const SAFE_FILENAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

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

function diskPath(folder, filename) {
  return path.join(process.cwd(), "public", "images", folder, filename);
}

export function isSafeUploadFilename(filename) {
  return Boolean(filename) && SAFE_FILENAME.test(filename) && !filename.includes("..");
}

export function parseUploadedImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  const pathOnly = imageUrl.replace(/^https?:\/\/[^/]+/i, "").split("?")[0];
  const match = pathOnly.match(/^\/(?:api\/media|images)\/([^/]+)\/([^/]+)$/);
  if (!match) return null;

  const folder = match[1];
  const filename = match[2];
  if (!UPLOAD_FOLDERS.has(folder) || !isSafeUploadFilename(filename)) return null;
  return { folder, filename };
}

async function ensureTable() {
  if (globalThis.__cutisUploadedImageTable) {
    return globalThis.__cutisUploadedImageTable;
  }
  globalThis.__cutisUploadedImageTable = (async () => {
    try {
      await getPool().query(CREATE_TABLE_SQL);
    } catch (error) {
      globalThis.__cutisUploadedImageTable = null;
      throw error;
    }
  })();
  return globalThis.__cutisUploadedImageTable;
}

export async function persistUploadedImage({ folder, filename, mimeType, bytes }) {
  if (!UPLOAD_FOLDERS.has(folder) || !isSafeUploadFilename(filename)) {
    throw new Error("Invalid upload path");
  }

  const dir = path.join(process.cwd(), "public", "images", folder);
  try {
    await mkdir(dir, { recursive: true });
    await writeFile(diskPath(folder, filename), bytes);
  } catch (error) {
    // Production hosts are often read-only or ephemeral. MySQL is the copy
    // both local and live can actually serve.
    console.warn("[upload] disk write skipped:", error?.message || error);
  }

  await ensureTable();
  await sqlExec(
    `INSERT INTO \`UploadedImage\` (\`id\`, \`folder\`, \`filename\`, \`mimeType\`, \`bytes\`)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE \`mimeType\` = VALUES(\`mimeType\`), \`bytes\` = VALUES(\`bytes\`)`,
    [newId(), folder, filename, mimeType, bytes],
  );
}

export async function readUploadedImage(folder, filename) {
  if (!UPLOAD_FOLDERS.has(folder) || !isSafeUploadFilename(filename)) return null;

  try {
    const bytes = await readFile(diskPath(folder, filename));
    const mimeType =
      MIME_BY_EXT[path.extname(filename).toLowerCase()] || "application/octet-stream";
    return { bytes, mimeType };
  } catch {
    // Fall through to MySQL — production has no copy in public/.
  }

  await ensureTable();
  const row = await sqlOne(
    `SELECT \`mimeType\`, \`bytes\`
       FROM \`UploadedImage\`
      WHERE \`folder\` = ? AND \`filename\` = ?
      LIMIT 1`,
    [folder, filename],
  );
  if (!row?.bytes) return null;

  const bytes = Buffer.isBuffer(row.bytes) ? row.bytes : Buffer.from(row.bytes);
  return { bytes, mimeType: row.mimeType || "application/octet-stream" };
}

export async function serveUploadedImage(_request, context) {
  const { folder, filename } = await context.params;
  const name = String(folder || "").trim();
  const file = String(filename || "").trim();

  try {
    const image = await readUploadedImage(name, file);
    if (!image) {
      return new NextResponse("Not found", { status: 404 });
    }

    return new NextResponse(new Uint8Array(image.bytes), {
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": String(image.bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[media]", error);
    return new NextResponse("Not found", { status: 404 });
  }
}

export async function deleteUploadedImage(imageUrl) {
  const parsed = parseUploadedImageUrl(imageUrl);
  if (!parsed) return;

  await unlink(diskPath(parsed.folder, parsed.filename)).catch(() => {});

  try {
    await ensureTable();
    await sqlExec(
      "DELETE FROM `UploadedImage` WHERE `folder` = ? AND `filename` = ?",
      [parsed.folder, parsed.filename],
    );
  } catch {
    // Table may not exist yet on older deploys with only disk files.
  }
}
