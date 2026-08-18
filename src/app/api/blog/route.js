import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { resolveActiveFilter } from "@/lib/activeFilter";
import { requireAdmin } from "@/lib/adminAuth";
import { toBit, toIntOr } from "@/lib/adminSql";
import { newId, safeLimit, sqlExec, sqlOne, sqlQuery, toBool } from "@/lib/mysql";

/** Fixed set — the public filter chips depend on these two staying stable. */
const CATEGORIES = ["Blog", "Health"];

function normaliseCategory(value) {
  const v = String(value || "").trim();
  const match = CATEGORIES.find((c) => c.toLowerCase() === v.toLowerCase());
  return match || "Blog";
}

/** Latin slug: Devanagari titles would percent-encode into an unreadable URL. */
export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const { denied, activeOnly } = resolveActiveFilter(request, searchParams);
    if (denied) return denied;

    const category = searchParams.get("category");
    const limit = safeLimit(searchParams.get("limit"), 100);
    const limitClause = limit ? `LIMIT ${limit}` : "";

    /*
      Article bodies are opt-in. The admin list searches across body text, but
      sending every post's full content to the public blog page — which only
      renders titles and excerpts — would multiply that payload for nothing.
      Admin-only, so this can't be used to bulk-read unpublished drafts.
    */
    const wantsContent = searchParams.get("withContent") === "1" && !requireAdmin(request);
    const contentField = wantsContent ? "`content`," : "";

    const where = [];
    const params = [];
    if (activeOnly) where.push("`isActive` = 1");
    if (category && category !== "All") {
      where.push("`category` = ?");
      params.push(normaliseCategory(category));
    }
    const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const rows = await sqlQuery(
      `SELECT \`id\`, \`slug\`, \`title\`, \`excerpt\`, ${contentField} \`category\`, \`author\`,
              \`imageUrl\` AS \`image\`, \`readMinutes\`, \`publishedAt\` AS \`date\`,
              \`isActive\`, \`sortOrder\`
         FROM \`BlogPost\`
         ${whereClause}
        ORDER BY \`publishedAt\` DESC, \`sortOrder\`
        ${limitClause}`,
      params,
    );

    return NextResponse.json(
      {
        success: true,
        data: rows.map((r) => ({ ...r, isActive: toBool(r.isActive) })),
      },
      // An admin listing is per-session, so it must not land in a shared cache.
      wantsContent ? undefined : publicCatalogCache(),
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to load blog posts", 500);
  }
}

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const title = String(body.title || "").trim();

    if (!title) {
      return NextResponse.json(
        { success: false, message: "title is required" },
        { status: 400 },
      );
    }

    // Fall back to slugifying the title, but Devanagari slugifies to "" — in
    // that case the author has to supply a slug explicitly.
    const slug = slugify(body.slug || title);
    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not derive a slug from the title — please provide one",
        },
        { status: 400 },
      );
    }

    const clash = await sqlOne("SELECT `id` FROM `BlogPost` WHERE `slug` = ? LIMIT 1", [slug]);
    if (clash) {
      return NextResponse.json(
        { success: false, message: `A post with the slug "${slug}" already exists` },
        { status: 409 },
      );
    }

    const id = String(body.id || newId()).trim();
    const imageUrl = body.imageUrl || body.image || null;

    await sqlExec(
      `INSERT INTO \`BlogPost\`
         (\`id\`, \`slug\`, \`title\`, \`excerpt\`, \`content\`, \`category\`,
          \`author\`, \`imageUrl\`, \`readMinutes\`, \`publishedAt\`, \`isActive\`, \`sortOrder\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        slug,
        title,
        body.excerpt ? String(body.excerpt).trim() : null,
        body.content ? String(body.content) : null,
        normaliseCategory(body.category),
        body.author ? String(body.author).trim() : "Cutis Path Lab",
        imageUrl ? String(imageUrl).trim() : null,
        toIntOr(body.readMinutes, 4),
        body.date || body.publishedAt || null,
        toBit(body.isActive !== false),
        toIntOr(body.sortOrder, 0),
      ],
    );

    return NextResponse.json(
      { success: true, message: "Blog post created", data: { id, slug } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to create blog post", 500);
  }
}
