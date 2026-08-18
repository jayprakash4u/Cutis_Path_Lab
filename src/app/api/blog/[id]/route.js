import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { buildUpdate, toBit, toIntOr } from "@/lib/adminSql";
import { sqlExec, sqlOne, toBool } from "@/lib/mysql";
import { slugify } from "../route";

const CATEGORIES = ["Blog", "Health"];

function normaliseCategory(value) {
  const v = String(value || "").trim();
  return CATEGORIES.find((c) => c.toLowerCase() === v.toLowerCase()) || "Blog";
}

const SELECT_FIELDS = `\`id\`, \`slug\`, \`title\`, \`excerpt\`, \`content\`, \`category\`,
       \`author\`, \`imageUrl\` AS \`image\`, \`readMinutes\`,
       \`publishedAt\` AS \`date\`, \`isActive\`, \`sortOrder\``;

/**
 * Accepts either the post id or its slug, so the public article page can fetch
 * by the slug that is already in the URL without a second lookup.
 */
export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const key = String(id || "").trim();

    const row = await sqlOne(
      `SELECT ${SELECT_FIELDS} FROM \`BlogPost\` WHERE \`id\` = ? OR \`slug\` = ? LIMIT 1`,
      [key, key],
    );

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...row, isActive: toBool(row.isActive) },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load blog post", 500);
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const postId = String(id || "").trim();
    const body = await request.json();

    const fields = {};
    if (body.title != null) fields.title = String(body.title).trim();
    if (body.excerpt !== undefined) {
      fields.excerpt = body.excerpt ? String(body.excerpt).trim() : null;
    }
    if (body.content !== undefined) {
      fields.content = body.content ? String(body.content) : null;
    }
    if (body.category != null) fields.category = normaliseCategory(body.category);
    if (body.author !== undefined) {
      fields.author = body.author ? String(body.author).trim() : null;
    }
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const v = body.imageUrl ?? body.image;
      fields.imageUrl = v ? String(v).trim() : null;
    }
    if (body.readMinutes != null) fields.readMinutes = toIntOr(body.readMinutes, 4);
    if (body.date !== undefined || body.publishedAt !== undefined) {
      fields.publishedAt = body.date || body.publishedAt || null;
    }
    if (body.isActive !== undefined) fields.isActive = toBit(body.isActive);
    if (body.sortOrder != null) fields.sortOrder = toIntOr(body.sortOrder);

    if (body.slug != null) {
      const slug = slugify(body.slug);
      if (!slug) {
        return NextResponse.json(
          { success: false, message: "Slug must contain latin letters or numbers" },
          { status: 400 },
        );
      }
      // Unique index would reject this anyway; caught here for a clear message.
      const clash = await sqlOne(
        "SELECT `id` FROM `BlogPost` WHERE `slug` = ? AND `id` <> ? LIMIT 1",
        [slug, postId],
      );
      if (clash) {
        return NextResponse.json(
          { success: false, message: `A post with the slug "${slug}" already exists` },
          { status: 409 },
        );
      }
      fields.slug = slug;
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    const exists = await sqlOne("SELECT `id` FROM `BlogPost` WHERE `id` = ? LIMIT 1", [postId]);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 },
      );
    }

    const { clause, params: values } = buildUpdate(fields);
    await sqlExec(`UPDATE \`BlogPost\` SET ${clause} WHERE \`id\` = ?`, [...values, postId]);

    return NextResponse.json({
      success: true,
      message: "Blog post updated",
      data: { id: postId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update blog post", 500);
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const postId = String(id || "").trim();

    const exists = await sqlOne("SELECT `id` FROM `BlogPost` WHERE `id` = ? LIMIT 1", [postId]);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 },
      );
    }

    await sqlExec("DELETE FROM `BlogPost` WHERE `id` = ?", [postId]);

    return NextResponse.json({
      success: true,
      message: "Blog post deleted",
      data: { id: postId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete blog post", 500);
  }
}
