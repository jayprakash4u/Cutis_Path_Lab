import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { resolveActiveFilter } from "@/lib/activeFilter";
import { requireAdmin } from "@/lib/adminAuth";
import { toBit, toIntOr } from "@/lib/adminSql";
import { newId, safeLimit, sqlExec, sqlQuery, toBool } from "@/lib/mysql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { denied, activeOnly } = resolveActiveFilter(request, searchParams);
    if (denied) return denied;

    const featured = searchParams.get("featured");
    const limit = safeLimit(searchParams.get("limit"), 100);
    const limitClause = limit ? `LIMIT ${limit}` : "";

    const where = [];
    if (activeOnly) where.push("`isActive` = 1");
    if (featured === "true") where.push("`featured` = 1");
    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const rows = await sqlQuery(
      `SELECT \`id\`, \`name\`, \`role\`, \`content\`, \`rating\`,
              \`imageUrl\` AS \`image\`, \`featured\`, \`isActive\`, \`sortOrder\`
         FROM \`Testimonial\`
         ${whereClause}
        ORDER BY \`sortOrder\`, \`name\`
        ${limitClause}`,
    );

    return NextResponse.json(
      {
        success: true,
        data: rows.map((r) => ({
          ...r,
          featured: toBool(r.featured),
          isActive: toBool(r.isActive),
        })),
      },
      publicCatalogCache(),
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to load testimonials", 500);
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const content = String(body.content || "").trim();

    if (!name || !content) {
      return NextResponse.json(
        { success: false, message: "name and content are required" },
        { status: 400 },
      );
    }

    const id = String(body.id || newId()).trim();
    const imageUrl = body.imageUrl || body.image || null;

    await sqlExec(
      `INSERT INTO \`Testimonial\`
         (\`id\`, \`name\`, \`role\`, \`content\`, \`rating\`, \`imageUrl\`, \`featured\`, \`isActive\`, \`sortOrder\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        body.role ? String(body.role).trim() : null,
        content,
        toIntOr(body.rating, 5),
        imageUrl ? String(imageUrl).trim() : null,
        toBit(body.featured !== false),
        toBit(body.isActive !== false),
        toIntOr(body.sortOrder, 0),
      ],
    );

    return NextResponse.json(
      { success: true, message: "Testimonial created", data: { id } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to create testimonial", 500);
  }
}
