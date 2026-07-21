import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { requireAdmin } from "@/lib/adminAuth";
import { bit, numOrNull } from "@/lib/adminSql";
import { escapeSql, sqlExec, sqlJson } from "@/lib/sqlserver";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const popular = searchParams.get("popular");
    const category = searchParams.get("category");
    const disease = searchParams.get("disease");
    const limitRaw = Number(searchParams.get("limit"));
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(Math.floor(limitRaw), 100)
        : null;

    const topClause = limit ? `TOP ${limit}` : "";
    const diseaseSlug = String(disease || "").trim();

    // Disease category (homepage strip) — filter via CategoryTest junction
    if (diseaseSlug) {
      const safeSlug = diseaseSlug.replace(/'/g, "''");
      const tests = await sqlJson(`
        SELECT ${topClause} t.id, t.code, t.name, t.category,
               CAST(t.price AS decimal(10,2)) AS price,
               CAST(t.originalPrice AS decimal(10,2)) AS originalPrice,
               t.description, t.sampleType, t.fastingRequired, t.reportTime, t.parameters, t.popular,
               t.iconUrl
        FROM dbo.Test t
        INNER JOIN dbo.CategoryTest ct ON ct.testId = t.id
        INNER JOIN dbo.Category c ON c.id = ct.categoryId
        WHERE c.slug = N'${safeSlug}' AND c.isActive = 1
        ORDER BY ct.sortOrder, t.name
        FOR JSON PATH
      `);
      return NextResponse.json({ success: true, data: tests, meta: { disease: diseaseSlug } });
    }

    let where = "1=1";
    if (popular === "true") where += " AND popular = 1";
    if (category) {
      const safe = category.replace(/'/g, "''");
      where += ` AND category = N'${safe}'`;
    }

    const tests = await sqlJson(`
      SELECT ${topClause} id, code, name, category,
             CAST(price AS decimal(10,2)) AS price,
             CAST(originalPrice AS decimal(10,2)) AS originalPrice,
             description, sampleType, fastingRequired, reportTime, parameters, popular,
             iconUrl
      FROM dbo.Test
      WHERE ${where}
      ORDER BY name
      FOR JSON PATH
    `);

    return NextResponse.json(
      { success: true, data: tests },
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
    const originalPrice = body.originalPrice != null ? Number(body.originalPrice) : null;
    const description = body.description ? String(body.description).trim() : null;
    const sampleType = body.sampleType ? String(body.sampleType).trim() : null;
    const fastingRequired = Boolean(body.fastingRequired);
    const reportTime = body.reportTime ? String(body.reportTime).trim() : null;
    const parameters =
      body.parameters != null && body.parameters !== ""
        ? Number(body.parameters)
        : null;
    const popular = Boolean(body.popular);
    const iconUrl = body.iconUrl ? String(body.iconUrl).trim() : null;

    await sqlExec(`
      IF EXISTS (SELECT 1 FROM dbo.Test WHERE id = ${escapeSql(id)} OR code = ${escapeSql(code)})
      BEGIN
        RAISERROR('Test code or id already exists', 16, 1);
        RETURN;
      END
      INSERT INTO dbo.Test
        (id, code, name, category, price, originalPrice, description, sampleType,
         fastingRequired, reportTime, parameters, popular, iconUrl)
      VALUES
        (${escapeSql(id)}, ${escapeSql(code)}, ${escapeSql(name)}, ${escapeSql(category)},
         ${numOrNull(price)}, ${numOrNull(originalPrice)},
         ${description ? escapeSql(description) : "NULL"},
         ${sampleType ? escapeSql(sampleType) : "NULL"},
         ${bit(fastingRequired)},
         ${reportTime ? escapeSql(reportTime) : "NULL"},
         ${numOrNull(parameters)},
         ${bit(popular)},
         ${iconUrl ? escapeSql(iconUrl) : "NULL"});
    `);

    return NextResponse.json(
      { success: true, message: "Test created", data: { id, code } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to create test", 500);
  }
}
