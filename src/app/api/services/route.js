import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { resolveActiveFilter } from "@/lib/activeFilter";
import { requireAdmin } from "@/lib/adminAuth";
import { toBit, toIntOr } from "@/lib/adminSql";
import { newId, safeLimit, sqlExec, sqlOne, sqlQuery } from "@/lib/mysql";
import { SERVICE_COLUMNS, normalizeService } from "@/lib/serviceRows";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { denied, activeOnly } = resolveActiveFilter(request, searchParams);
    if (denied) return denied;

    const category = (searchParams.get("category") || "").trim();
    const limit = safeLimit(searchParams.get("limit"), 200);
    const limitClause = limit ? `LIMIT ${limit}` : "";

    const where = [];
    const params = [];
    if (activeOnly) where.push("`isActive` = 1");
    if (category && category !== "all") {
      where.push("`category` = ?");
      params.push(category);
    }
    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const rows = await sqlQuery(
      `SELECT ${SERVICE_COLUMNS}
         FROM \`Service\`
         ${whereClause}
        ORDER BY \`sortOrder\`, \`name\`
        ${limitClause}`,
      params,
    );

    return NextResponse.json(
      { success: true, data: rows.map(normalizeService) },
      publicCatalogCache(),
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to load services", 500);
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "name is required" },
        { status: 400 },
      );
    }

    const id = String(body.id || newId()).trim();

    const clash = await sqlOne("SELECT `id` FROM `Service` WHERE `id` = ? LIMIT 1", [id]);
    if (clash) {
      return NextResponse.json(
        { success: false, message: "Service id already exists" },
        { status: 409 },
      );
    }

    const imageUrl = body.imageUrl || body.image || null;
    const iconKey = body.iconKey || body.icon || null;

    await sqlExec(
      `INSERT INTO \`Service\`
         (\`id\`, \`name\`, \`description\`, \`longDescription\`, \`category\`,
          \`iconKey\`, \`imageUrl\`, \`isActive\`, \`sortOrder\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        body.description ? String(body.description).trim() : null,
        body.longDescription ? String(body.longDescription).trim() : null,
        body.category ? String(body.category).trim() : "health",
        iconKey ? String(iconKey).trim() : null,
        imageUrl ? String(imageUrl).trim() : null,
        toBit(body.isActive !== false),
        toIntOr(body.sortOrder, 0),
      ],
    );

    return NextResponse.json(
      { success: true, message: "Service created", data: { id } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to create service", 500);
  }
}
