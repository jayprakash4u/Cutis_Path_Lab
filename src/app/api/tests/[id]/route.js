import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { bit, numOrNull } from "@/lib/adminSql";
import { escapeSql, sqlExec, sqlJson } from "@/lib/sqlserver";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const testId = String(id || "").trim();
    const rows = await sqlJson(`
      SELECT id, code, name, category,
             CAST(price AS decimal(10,2)) AS price,
             CAST(originalPrice AS decimal(10,2)) AS originalPrice,
             description, sampleType, fastingRequired, reportTime, parameters, popular,
             iconUrl
      FROM dbo.Test
      WHERE id = ${escapeSql(testId)}
      FOR JSON PATH
    `);
    const list = Array.isArray(rows) ? rows : rows ? [rows] : [];
    if (list.length === 0) {
      return NextResponse.json(
        { success: false, message: "Test not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: list[0] });
  } catch (error) {
    console.error("GET /api/tests/[id]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load test" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const testId = String(id || "").trim();
    const body = await request.json();

    const sets = [];
    if (body.code != null) sets.push(`code = ${escapeSql(String(body.code).trim())}`);
    if (body.name != null) sets.push(`name = ${escapeSql(String(body.name).trim())}`);
    if (body.category != null) {
      sets.push(`category = ${escapeSql(String(body.category).trim())}`);
    }
    if (body.price != null) sets.push(`price = ${numOrNull(body.price)}`);
    if (body.originalPrice !== undefined) {
      sets.push(`originalPrice = ${numOrNull(body.originalPrice)}`);
    }
    if (body.description !== undefined) {
      const v = body.description ? String(body.description).trim() : null;
      sets.push(`description = ${v ? escapeSql(v) : "NULL"}`);
    }
    if (body.sampleType !== undefined) {
      const v = body.sampleType ? String(body.sampleType).trim() : null;
      sets.push(`sampleType = ${v ? escapeSql(v) : "NULL"}`);
    }
    if (body.fastingRequired !== undefined) {
      sets.push(`fastingRequired = ${bit(Boolean(body.fastingRequired))}`);
    }
    if (body.reportTime !== undefined) {
      const v = body.reportTime ? String(body.reportTime).trim() : null;
      sets.push(`reportTime = ${v ? escapeSql(v) : "NULL"}`);
    }
    if (body.parameters !== undefined) {
      sets.push(`parameters = ${numOrNull(body.parameters)}`);
    }
    if (body.popular !== undefined) sets.push(`popular = ${bit(Boolean(body.popular))}`);
    if (body.iconUrl !== undefined) {
      const v = body.iconUrl ? String(body.iconUrl).trim() : null;
      sets.push(`iconUrl = ${v ? escapeSql(v) : "NULL"}`);
    }
    sets.push("updatedAt = SYSUTCDATETIME()");

    if (sets.length <= 1) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Test WHERE id = ${escapeSql(testId)})
      BEGIN
        RAISERROR('Test not found', 16, 1);
        RETURN;
      END
      UPDATE dbo.Test SET ${sets.join(", ")} WHERE id = ${escapeSql(testId)};
    `);

    return NextResponse.json({ success: true, message: "Test updated", data: { id: testId } });
  } catch (error) {
    console.error("PATCH /api/tests/[id]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update test" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const testId = String(id || "").trim();

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Test WHERE id = ${escapeSql(testId)})
      BEGIN
        RAISERROR('Test not found', 16, 1);
        RETURN;
      END
      UPDATE dbo.Booking SET testId = NULL WHERE testId = ${escapeSql(testId)};
      UPDATE dbo.PackageTest SET testId = NULL WHERE testId = ${escapeSql(testId)};
      UPDATE dbo.Offer SET testId = NULL WHERE testId = ${escapeSql(testId)};
      DELETE FROM dbo.Test WHERE id = ${escapeSql(testId)};
    `);

    return NextResponse.json({ success: true, message: "Test deleted", data: { id: testId } });
  } catch (error) {
    console.error("DELETE /api/tests/[id]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete test" },
      { status: 500 },
    );
  }
}
