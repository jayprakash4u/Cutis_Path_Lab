import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { resolveActiveFilter } from "@/lib/activeFilter";
import { requireAdmin } from "@/lib/adminAuth";
import { buildUpdate, toBit, toIntOr } from "@/lib/adminSql";
import { sqlExec, sqlOne, sqlQuery } from "@/lib/mysql";
import {
  ITEM_COLUMNS,
  SECTION_COLUMNS,
  normalizeItem,
  normalizeSection,
} from "@/lib/homeContent";

export async function GET(request, { params }) {
  try {
    const { key } = await params;
    const sectionKey = String(key || "").trim();
    const { searchParams } = new URL(request.url);
    const { denied, activeOnly } = resolveActiveFilter(request, searchParams);
    if (denied) return denied;

    const row = await sqlOne(
      `SELECT ${SECTION_COLUMNS} FROM \`HomeSection\` WHERE \`sectionKey\` = ? LIMIT 1`,
      [sectionKey],
    );

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Home section not found" },
        { status: 404 },
      );
    }

    const items = await sqlQuery(
      `SELECT ${ITEM_COLUMNS}
         FROM \`HomeSectionItem\`
        WHERE \`sectionKey\` = ? ${activeOnly ? "AND `isActive` = 1" : ""}
        ORDER BY \`sortOrder\``,
      [sectionKey],
    );

    return NextResponse.json({
      success: true,
      data: { ...normalizeSection(row), items: items.map(normalizeItem) },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load home section", 500);
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { key } = await params;
    const sectionKey = String(key || "").trim();
    const body = await request.json();

    const exists = await sqlOne(
      "SELECT `sectionKey` FROM `HomeSection` WHERE `sectionKey` = ? LIMIT 1",
      [sectionKey],
    );
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Home section not found" },
        { status: 404 },
      );
    }

    const text = (value) => (value ? String(value).trim() : null);

    const fields = {};
    if (body.title !== undefined) fields.title = text(body.title);
    if (body.highlight !== undefined) fields.highlight = text(body.highlight);
    if (body.subtitle !== undefined) fields.subtitle = text(body.subtitle);
    if (body.ctaLabel !== undefined) fields.ctaLabel = text(body.ctaLabel);
    if (body.ctaHref !== undefined) fields.ctaHref = text(body.ctaHref);
    if (body.isActive !== undefined) fields.isActive = toBit(body.isActive);
    if (body.sortOrder != null) fields.sortOrder = toIntOr(body.sortOrder);

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    const { clause, params: values } = buildUpdate(fields);
    await sqlExec(`UPDATE \`HomeSection\` SET ${clause} WHERE \`sectionKey\` = ?`, [
      ...values,
      sectionKey,
    ]);

    return NextResponse.json({
      success: true,
      message: "Home section updated",
      data: { key: sectionKey },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update home section", 500);
  }
}
