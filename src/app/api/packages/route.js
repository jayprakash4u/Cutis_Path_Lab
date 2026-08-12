import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { requireAdmin } from "@/lib/adminAuth";
import { replacePackageIncludes, toNumOrNull } from "@/lib/adminSql";
import { newId, safeLimit, sqlExec, sqlOne, sqlQuery } from "@/lib/mysql";

function normalizePackage(row, includeNames) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    category: row.category,
    description: row.description,
    price: row.price,
    originalPrice: row.originalPrice,
    image: row.imageUrl,
    imageUrl: row.imageUrl,
    reportsTime: row.reportsTime || "24-48 hrs",
    fasting: row.fasting || "10-12 hrs",
    sampleType: row.sampleType || "Blood",
    includes: includeNames.map((i) => i.testName),
    includeItems: includeNames.map((i) => ({
      testName: i.testName,
      testId: i.testId || null,
      price: i.price ?? null,
      category: i.category || null,
      code: i.code || null,
    })),
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = safeLimit(searchParams.get("limit"), 100);
    const limitClause = limit ? `LIMIT ${limit}` : "";

    const packages = await sqlQuery(
      `SELECT \`id\`, \`code\`, \`name\`, \`category\`, \`description\`, \`price\`,
              \`originalPrice\`, \`imageUrl\`, \`reportsTime\`, \`fasting\`, \`sampleType\`
         FROM \`Package\`
        ORDER BY CAST(\`id\` AS UNSIGNED), \`name\`
        ${limitClause}`,
    );

    if (packages.length === 0) {
      return NextResponse.json({ success: true, data: [] }, publicCatalogCache());
    }

    // One round trip for every package's includes, then group in JS.
    const placeholders = packages.map(() => "?").join(", ");
    const includeRows = await sqlQuery(
      `SELECT pt.\`packageId\`, pt.\`testName\`, pt.\`testId\`, pt.\`sortOrder\`,
              t.\`name\` AS linkedName, t.\`code\`, t.\`category\`, t.\`price\`
         FROM \`PackageTest\` pt
         LEFT JOIN \`Test\` t ON t.\`id\` = pt.\`testId\`
        WHERE pt.\`packageId\` IN (${placeholders})
        ORDER BY pt.\`sortOrder\``,
      packages.map((p) => p.id),
    );

    const byPackage = new Map();
    for (const row of includeRows) {
      if (!byPackage.has(row.packageId)) byPackage.set(row.packageId, []);
      byPackage.get(row.packageId).push({
        testName: row.testName || row.linkedName || "",
        testId: row.testId,
        code: row.code,
        category: row.category,
        price: row.price,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: packages.map((p) => normalizePackage(p, byPackage.get(p.id) || [])),
      },
      publicCatalogCache(),
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to load packages", 500);
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const code = String(body.code || "").trim();
    const name = String(body.name || "").trim();
    const category = String(body.category || "").trim();
    const price = Number(body.price);

    if (!code || !name || !category || !Number.isFinite(price)) {
      return NextResponse.json(
        { success: false, message: "code, name, category, and price are required" },
        { status: 400 },
      );
    }

    const id = String(body.id || newId()).trim();

    const clash = await sqlOne(
      "SELECT `id` FROM `Package` WHERE `id` = ? OR `code` = ? LIMIT 1",
      [id, code],
    );
    if (clash) {
      return NextResponse.json(
        { success: false, message: "Package code or id already exists" },
        { status: 409 },
      );
    }

    const imageUrl = body.imageUrl || body.image || null;

    await sqlExec(
      `INSERT INTO \`Package\`
         (\`id\`, \`code\`, \`name\`, \`category\`, \`description\`, \`price\`, \`originalPrice\`,
          \`imageUrl\`, \`reportsTime\`, \`fasting\`, \`sampleType\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        code,
        name,
        category,
        body.description ? String(body.description).trim() : null,
        price,
        toNumOrNull(body.originalPrice),
        imageUrl ? String(imageUrl).trim() : null,
        body.reportsTime || "24-48 hrs",
        body.fasting || "10-12 hrs",
        body.sampleType || "Blood",
      ],
    );

    if (body.includes) {
      await replacePackageIncludes(id, body.includes);
    }

    return NextResponse.json(
      { success: true, message: "Package created", data: { id, code } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to create package", 500);
  }
}
