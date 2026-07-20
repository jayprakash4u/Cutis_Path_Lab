import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { bit, intOr } from "@/lib/adminSql";
import { escapeSql, newId, sqlExec, sqlJson } from "@/lib/sqlserver";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";
    const limitRaw = Number(searchParams.get("limit"));
    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(Math.floor(limitRaw), 100)
        : null;

    let where = "1=1";
    if (activeOnly) where += " AND isActive = 1";
    const topClause = limit ? `TOP ${limit}` : "";

    const rows = await sqlJson(`
      SELECT ${topClause}
        id, name, specialization, hospital, quote,
        imageUrl AS image, isActive, sortOrder, createdAt
      FROM dbo.ReferralDoctor
      WHERE ${where}
      ORDER BY sortOrder, name
      FOR JSON PATH
    `);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/referrals", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load referral doctors" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const specialization = String(body.specialization || "").trim();
    const quote = String(body.quote || "").trim();

    if (!name || !specialization || !quote) {
      return NextResponse.json(
        { success: false, message: "name, specialization, and quote are required" },
        { status: 400 },
      );
    }

    const id = String(body.id || newId()).trim();
    const hospital = body.hospital ? String(body.hospital).trim() : null;
    const imageUrl = body.imageUrl || body.image || null;

    await sqlExec(`
      INSERT INTO dbo.ReferralDoctor
        (id, name, specialization, hospital, quote, imageUrl, isActive, sortOrder)
      VALUES
        (${escapeSql(id)}, ${escapeSql(name)}, ${escapeSql(specialization)},
         ${hospital ? escapeSql(hospital) : "NULL"},
         ${escapeSql(quote)},
         ${imageUrl ? escapeSql(String(imageUrl).trim()) : "NULL"},
         ${bit(body.isActive !== false)},
         ${intOr(body.sortOrder, 0)});
    `);

    return NextResponse.json(
      { success: true, message: "Referral doctor added", data: { id } },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/referrals", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add referral doctor" },
      { status: 500 },
    );
  }
}
