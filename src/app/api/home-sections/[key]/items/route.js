import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { toBit, toIntOr } from "@/lib/adminSql";
import { newId, sqlExec, sqlOne } from "@/lib/mysql";

export async function POST(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { key } = await params;
    const sectionKey = String(key || "").trim();
    const body = await request.json();

    const section = await sqlOne(
      "SELECT `sectionKey` FROM `HomeSection` WHERE `sectionKey` = ? LIMIT 1",
      [sectionKey],
    );
    if (!section) {
      return NextResponse.json(
        { success: false, message: "Home section not found" },
        { status: 404 },
      );
    }

    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json(
        { success: false, message: "title is required" },
        { status: 400 },
      );
    }

    const text = (value) => (value ? String(value).trim() : null);
    const id = String(body.id || newId()).trim();

    await sqlExec(
      `INSERT INTO \`HomeSectionItem\`
         (\`id\`, \`sectionKey\`, \`title\`, \`description\`, \`badge\`, \`note\`,
          \`iconKey\`, \`imageUrl\`, \`mobileImageUrl\`, \`linkUrl\`, \`isActive\`, \`sortOrder\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        sectionKey,
        title,
        text(body.description),
        text(body.badge),
        text(body.note),
        text(body.iconKey),
        text(body.imageUrl),
        text(body.mobileImageUrl),
        text(body.linkUrl),
        toBit(body.isActive !== false),
        toIntOr(body.sortOrder, 0),
      ],
    );

    return NextResponse.json(
      { success: true, message: "Item created", data: { id } },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to create item", 500);
  }
}
