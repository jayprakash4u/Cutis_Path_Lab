import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { requireAdmin } from "@/lib/adminAuth";
import { toBit, toNumOrNull } from "@/lib/adminSql";
import { safeLimit, sqlExec, sqlOne, sqlQuery, toBool } from "@/lib/mysql";

const TEST_FIELDS = `\`id\`, \`code\`, \`name\`, \`category\`, \`price\`, \`originalPrice\`,
  \`description\`, \`sampleType\`, \`fastingRequired\`, \`reportTime\`,
  \`parameters\`, \`popular\`, \`iconUrl\``;

/** TINYINT(1) → boolean, matching what the old FOR JSON output produced. */
function normalizeTest(row) {
  return {
    ...row,
    fastingRequired: toBool(row.fastingRequired),
    popular: toBool(row.popular),
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const popular = searchParams.get("popular");
    const category = searchParams.get("category");
    const disease = searchParams.get("disease");
    const limit = safeLimit(searchParams.get("limit"), 100);
    const limitClause = limit ? `LIMIT ${limit}` : "";

    const diseaseSlug = String(disease || "").trim();

    // Disease category (homepage strip) — filter through the CategoryTest junction
    if (diseaseSlug) {
      const rows = await sqlQuery(
        `SELECT t.\`id\`, t.\`code\`, t.\`name\`, t.\`category\`, t.\`price\`, t.\`originalPrice\`,
                t.\`description\`, t.\`sampleType\`, t.\`fastingRequired\`, t.\`reportTime\`,
                t.\`parameters\`, t.\`popular\`, t.\`iconUrl\`
           FROM \`Test\` t
           INNER JOIN \`CategoryTest\` ct ON ct.\`testId\` = t.\`id\`
           INNER JOIN \`Category\` c ON c.\`id\` = ct.\`categoryId\`
          WHERE c.\`slug\` = ? AND c.\`isActive\` = 1
          ORDER BY ct.\`sortOrder\`, t.\`name\`
          ${limitClause}`,
        [diseaseSlug],
      );
      return NextResponse.json({
        success: true,
        data: rows.map(normalizeTest),
        meta: { disease: diseaseSlug },
      });
    }

    const where = [];
    const params = [];
    if (popular === "true") where.push("`popular` = 1");
    if (category) {
      where.push("`category` = ?");
      params.push(category);
    }
    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const rows = await sqlQuery(
      `SELECT ${TEST_FIELDS} FROM \`Test\` ${whereClause} ORDER BY \`name\` ${limitClause}`,
      params,
    );

    return NextResponse.json(
      { success: true, data: rows.map(normalizeTest) },
      publicCatalogCache(),
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to load tests", 500);
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

    const id = String(body.id || code).trim();

    const clash = await sqlOne(
      "SELECT `id` FROM `Test` WHERE `id` = ? OR `code` = ? LIMIT 1",
      [id, code],
    );
    if (clash) {
      return NextResponse.json(
        { success: false, message: "Test code or id already exists" },
        { status: 409 },
      );
    }

    await sqlExec(
      `INSERT INTO \`Test\`
         (\`id\`, \`code\`, \`name\`, \`category\`, \`price\`, \`originalPrice\`, \`description\`,
          \`sampleType\`, \`fastingRequired\`, \`reportTime\`, \`parameters\`, \`popular\`, \`iconUrl\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        code,
        name,
        category,
        price,
        toNumOrNull(body.originalPrice),
        body.description ? String(body.description).trim() : null,
        body.sampleType ? String(body.sampleType).trim() : null,
        toBit(body.fastingRequired),
        body.reportTime ? String(body.reportTime).trim() : null,
        toNumOrNull(body.parameters),
        toBit(body.popular),
        body.iconUrl ? String(body.iconUrl).trim() : null,
      ],
    );

    return NextResponse.json(
      { success: true, message: "Test created", data: { id, code } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to create test", 500);
  }
}
