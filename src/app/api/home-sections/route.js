import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { resolveActiveFilter } from "@/lib/activeFilter";
import { requireAdmin } from "@/lib/adminAuth";
import { buildUpdate, toBit, toIntOr } from "@/lib/adminSql";
import { sqlQuery, sqlTransaction } from "@/lib/mysql";
import {
  ITEM_COLUMNS,
  SECTION_COLUMNS,
  normalizeItem,
  normalizeSection,
} from "@/lib/homeContent";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { denied, activeOnly } = resolveActiveFilter(request, searchParams);
    if (denied) return denied;

    const where = activeOnly ? "WHERE `isActive` = 1" : "";
    const isAdmin = !requireAdmin(request);

    const sections = await sqlQuery(
      `SELECT ${SECTION_COLUMNS} FROM \`HomeSection\` ${where} ORDER BY \`sortOrder\``,
    );
    const items = await sqlQuery(
      `SELECT ${ITEM_COLUMNS} FROM \`HomeSectionItem\` ${where} ORDER BY \`sortOrder\``,
    );

    const bySection = new Map();
    for (const row of items) {
      if (!bySection.has(row.sectionKey)) bySection.set(row.sectionKey, []);
      bySection.get(row.sectionKey).push(normalizeItem(row));
    }

    return NextResponse.json(
      {
        success: true,
        data: sections.map((row) => ({
          ...normalizeSection(row),
          items: bySection.get(row.sectionKey) || [],
        })),
      },
      isAdmin ? undefined : publicCatalogCache(),
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to load home sections", 500);
  }
}

/**
 * Reorder / show / hide several sections at once — what the overview screen
 * saves. Applied in one transaction so the page never renders a half-order.
 */
export async function PATCH(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const sections = Array.isArray(body.sections) ? body.sections : null;

    if (!sections || sections.length === 0) {
      return NextResponse.json(
        { success: false, message: "sections array is required" },
        { status: 400 },
      );
    }

    await sqlTransaction(async (tx) => {
      for (const entry of sections) {
        const key = String(entry.key || entry.sectionKey || "").trim();
        if (!key) continue;

        const fields = {};
        if (entry.sortOrder != null) fields.sortOrder = toIntOr(entry.sortOrder);
        if (entry.isActive !== undefined) fields.isActive = toBit(entry.isActive);
        if (Object.keys(fields).length === 0) continue;

        const { clause, params } = buildUpdate(fields);
        await tx.exec(`UPDATE \`HomeSection\` SET ${clause} WHERE \`sectionKey\` = ?`, [
          ...params,
          key,
        ]);
      }
    });

    return NextResponse.json({ success: true, message: "Home sections updated" });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update home sections", 500);
  }
}
