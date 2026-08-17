import { unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { buildUpdate, toBit, toIntOr } from "@/lib/adminSql";
import { sqlExec, sqlOne, toBool } from "@/lib/mysql";

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

    const row = await sqlOne(
      `SELECT \`id\`, \`name\`, \`specialization\`, \`hospital\`, \`quote\`,
              \`imageUrl\` AS \`image\`, \`isActive\`, \`sortOrder\`
         FROM \`ReferralDoctor\` WHERE \`id\` = ? LIMIT 1`,
      [String(id || "").trim()],
    );

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Referral doctor not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...row, isActive: toBool(row.isActive) },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load referral doctor", 500);
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const doctorId = String(id || "").trim();
    const body = await request.json();

    const existing = await sqlOne(
      "SELECT `imageUrl` FROM `ReferralDoctor` WHERE `id` = ? LIMIT 1",
      [doctorId],
    );
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Referral doctor not found" },
        { status: 404 },
      );
    }

    const fields = {};
    if (body.name != null) fields.name = String(body.name).trim();
    if (body.specialization != null) {
      fields.specialization = String(body.specialization).trim();
    }
    if (body.hospital !== undefined) {
      fields.hospital = body.hospital ? String(body.hospital).trim() : null;
    }
    if (body.quote != null) fields.quote = String(body.quote).trim();
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const v = body.imageUrl || body.image;
      fields.imageUrl = v ? String(v).trim() : null;
    }
    if (body.isActive !== undefined) fields.isActive = toBit(body.isActive);
    if (body.sortOrder != null) fields.sortOrder = toIntOr(body.sortOrder);

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    const { clause, params: values } = buildUpdate(fields);
    await sqlExec(`UPDATE \`ReferralDoctor\` SET ${clause} WHERE \`id\` = ?`, [
      ...values,
      doctorId,
    ]);

    const oldImageUrl = existing.imageUrl;
    const newImageUrl = fields.imageUrl;
    if (oldImageUrl && newImageUrl && oldImageUrl !== newImageUrl) {
      await removeLocalReferralImage(oldImageUrl);
    }

    return NextResponse.json({
      success: true,
      message: "Referral doctor updated",
      data: { id: doctorId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update referral doctor", 500);
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const doctorId = String(id || "").trim();

    const existing = await sqlOne(
      "SELECT `imageUrl` FROM `ReferralDoctor` WHERE `id` = ? LIMIT 1",
      [doctorId],
    );
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Referral doctor not found" },
        { status: 404 },
      );
    }

    await sqlExec("DELETE FROM `ReferralDoctor` WHERE `id` = ?", [doctorId]);
    await removeLocalReferralImage(existing.imageUrl);

    return NextResponse.json({
      success: true,
      message: "Referral doctor deleted",
      data: { id: doctorId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete referral doctor", 500);
  }
}
