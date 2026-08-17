import { unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { buildUpdate, toBit, toIntOr } from "@/lib/adminSql";
import { sqlExec, sqlOne, toBool } from "@/lib/mysql";

async function removeLocalGalleryFile(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return;
  if (!imageUrl.startsWith("/images/gallery/")) return;

  const filename = path.basename(imageUrl);
  if (!filename || filename.includes("..")) return;

  const filePath = path.join(process.cwd(), "public", "images", "gallery", filename);
  await unlink(filePath).catch(() => {});
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;

    const row = await sqlOne(
      `SELECT \`id\`, \`title\`, \`caption\`, \`imageUrl\` AS \`image\`, \`altText\`,
              \`isActive\`, \`sortOrder\`, \`createdAt\`
         FROM \`GalleryImage\` WHERE \`id\` = ? LIMIT 1`,
      [String(id || "").trim()],
    );

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Gallery image not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...row, isActive: toBool(row.isActive) },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load gallery image", 500);
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const galleryId = String(id || "").trim();
    const body = await request.json();

    const existing = await sqlOne(
      "SELECT `imageUrl` FROM `GalleryImage` WHERE `id` = ? LIMIT 1",
      [galleryId],
    );
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Gallery image not found" },
        { status: 404 },
      );
    }

    const fields = {};
    if (body.title !== undefined) {
      fields.title = body.title ? String(body.title).trim() : null;
    }
    if (body.caption !== undefined) {
      fields.caption = body.caption ? String(body.caption).trim() : null;
    }
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const v = String(body.imageUrl || body.image || "").trim();
      if (!v) {
        return NextResponse.json(
          { success: false, message: "Image is required" },
          { status: 400 },
        );
      }
      fields.imageUrl = v;
    }
    if (body.altText !== undefined) {
      fields.altText = body.altText ? String(body.altText).trim() : null;
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
    await sqlExec(`UPDATE \`GalleryImage\` SET ${clause} WHERE \`id\` = ?`, [
      ...values,
      galleryId,
    ]);

    const oldImageUrl = existing.imageUrl;
    const newImageUrl = fields.imageUrl;
    if (oldImageUrl && newImageUrl && oldImageUrl !== newImageUrl) {
      await removeLocalGalleryFile(oldImageUrl);
    }

    return NextResponse.json({
      success: true,
      message: "Gallery image updated",
      data: { id: galleryId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update gallery image", 500);
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const galleryId = String(id || "").trim();

    const existing = await sqlOne(
      "SELECT `imageUrl` FROM `GalleryImage` WHERE `id` = ? LIMIT 1",
      [galleryId],
    );
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Gallery image not found" },
        { status: 404 },
      );
    }

    await sqlExec("DELETE FROM `GalleryImage` WHERE `id` = ?", [galleryId]);
    await removeLocalGalleryFile(existing.imageUrl);

    return NextResponse.json({
      success: true,
      message: "Gallery image deleted",
      data: { id: galleryId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete gallery image", 500);
  }
}
