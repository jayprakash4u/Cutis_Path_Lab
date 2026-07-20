import { unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { bit, intOr } from "@/lib/adminSql";
import { escapeSql, sqlExec, sqlJson } from "@/lib/sqlserver";

async function removeLocalReferralImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return;
  if (!imageUrl.startsWith("/images/referrals/")) return;

  const filename = path.basename(imageUrl);
  if (!filename || filename.includes("..")) return;

  const filePath = path.join(process.cwd(), "public", "images", "referrals", filename);
  await unlink(filePath).catch(() => {});
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const rows = await sqlJson(`
      SELECT id, name, specialization, hospital, quote,
             imageUrl AS image, isActive, sortOrder
      FROM dbo.ReferralDoctor
      WHERE id = ${escapeSql(String(id || "").trim())}
      FOR JSON PATH
    `);
    const list = Array.isArray(rows) ? rows : rows ? [rows] : [];
    if (list.length === 0) {
      return NextResponse.json(
        { success: false, message: "Referral doctor not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: list[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load referral doctor" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const doctorId = String(id || "").trim();
    const body = await request.json();
    const sets = ["updatedAt = SYSUTCDATETIME()"];

    let oldImageUrl = null;
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const existing = await sqlJson(`
        SELECT imageUrl FROM dbo.ReferralDoctor WHERE id = ${escapeSql(doctorId)} FOR JSON PATH
      `);
      oldImageUrl = existing?.[0]?.imageUrl || null;
    }

    if (body.name != null) sets.push(`name = ${escapeSql(String(body.name).trim())}`);
    if (body.specialization != null) {
      sets.push(`specialization = ${escapeSql(String(body.specialization).trim())}`);
    }
    if (body.hospital !== undefined) {
      const v = body.hospital ? String(body.hospital).trim() : null;
      sets.push(`hospital = ${v ? escapeSql(v) : "NULL"}`);
    }
    if (body.quote != null) sets.push(`quote = ${escapeSql(String(body.quote).trim())}`);
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const v = body.imageUrl || body.image;
      sets.push(`imageUrl = ${v ? escapeSql(String(v).trim()) : "NULL"}`);
    }
    if (body.isActive !== undefined) sets.push(`isActive = ${bit(Boolean(body.isActive))}`);
    if (body.sortOrder != null) sets.push(`sortOrder = ${intOr(body.sortOrder)}`);

    if (sets.length === 1) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.ReferralDoctor WHERE id = ${escapeSql(doctorId)})
      BEGIN
        RAISERROR('Referral doctor not found', 16, 1);
        RETURN;
      END
      UPDATE dbo.ReferralDoctor SET ${sets.join(", ")} WHERE id = ${escapeSql(doctorId)};
    `);

    const newImageUrl = body.imageUrl || body.image;
    if (oldImageUrl && newImageUrl && oldImageUrl !== newImageUrl) {
      await removeLocalReferralImage(oldImageUrl);
    }

    return NextResponse.json({
      success: true,
      message: "Referral doctor updated",
      data: { id: doctorId },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update referral doctor" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const doctorId = String(id || "").trim();

    const rows = await sqlJson(`
      SELECT imageUrl FROM dbo.ReferralDoctor WHERE id = ${escapeSql(doctorId)} FOR JSON PATH
    `);
    const imageUrl = rows?.[0]?.imageUrl;

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.ReferralDoctor WHERE id = ${escapeSql(doctorId)})
      BEGIN
        RAISERROR('Referral doctor not found', 16, 1);
        RETURN;
      END
      DELETE FROM dbo.ReferralDoctor WHERE id = ${escapeSql(doctorId)};
    `);

    await removeLocalReferralImage(imageUrl);

    return NextResponse.json({
      success: true,
      message: "Referral doctor deleted",
      data: { id: doctorId },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete referral doctor" },
      { status: 500 },
    );
  }
}
