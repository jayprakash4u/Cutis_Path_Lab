import { unlink } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { bit, intOr } from "@/lib/adminSql";
import { escapeSql, sqlExec, sqlJson } from "@/lib/sqlserver";

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
    const rows = await sqlJson(`
      SELECT id, title, caption, imageUrl AS image, altText, isActive, sortOrder, createdAt
      FROM dbo.GalleryImage
      WHERE id = ${escapeSql(String(id || "").trim())}
      FOR JSON PATH
    `);
    const list = Array.isArray(rows) ? rows : rows ? [rows] : [];
    if (list.length === 0) {
      return NextResponse.json(
        { success: false, message: "Gallery image not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: list[0] });
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
    const sets = ["updatedAt = SYSUTCDATETIME()"];

    let oldImageUrl = null;
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const existing = await sqlJson(`
        SELECT imageUrl FROM dbo.GalleryImage WHERE id = ${escapeSql(galleryId)} FOR JSON PATH
      `);
      oldImageUrl = existing?.[0]?.imageUrl || null;
    }

    if (body.title !== undefined) {
      const v = body.title ? String(body.title).trim() : null;
      sets.push(`title = ${v ? escapeSql(v) : "NULL"}`);
    }
    if (body.caption !== undefined) {
      const v = body.caption ? String(body.caption).trim() : null;
      sets.push(`caption = ${v ? escapeSql(v) : "NULL"}`);
    }
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const v = String(body.imageUrl || body.image || "").trim();
      if (!v) {
        return NextResponse.json(
          { success: false, message: "Image is required" },
          { status: 400 },
        );
      }
      sets.push(`imageUrl = ${escapeSql(v)}`);
    }
    if (body.altText !== undefined) {
      const v = body.altText ? String(body.altText).trim() : null;
      sets.push(`altText = ${v ? escapeSql(v) : "NULL"}`);
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
      IF NOT EXISTS (SELECT 1 FROM dbo.GalleryImage WHERE id = ${escapeSql(galleryId)})
      BEGIN
        RAISERROR('Gallery image not found', 16, 1);
        RETURN;
      END
      UPDATE dbo.GalleryImage SET ${sets.join(", ")} WHERE id = ${escapeSql(galleryId)};
    `);

    const newImageUrl = body.imageUrl || body.image;
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

    const rows = await sqlJson(`
      SELECT imageUrl FROM dbo.GalleryImage WHERE id = ${escapeSql(galleryId)} FOR JSON PATH
    `);
    const imageUrl = rows?.[0]?.imageUrl;

    await sqlExec(`
      IF NOT EXISTS (SELECT 1 FROM dbo.GalleryImage WHERE id = ${escapeSql(galleryId)})
      BEGIN
        RAISERROR('Gallery image not found', 16, 1);
        RETURN;
      END
      DELETE FROM dbo.GalleryImage WHERE id = ${escapeSql(galleryId)};
    `);

    await removeLocalGalleryFile(imageUrl);

    return NextResponse.json({
      success: true,
      message: "Gallery image deleted",
      data: { id: galleryId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete gallery image", 500);
  }
}
