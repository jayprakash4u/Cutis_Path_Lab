import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const EXT_BY_TYPE = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, message: "Please choose an image file" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, message: "Only JPG, PNG, WebP, or GIF images are allowed" },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, message: "Image must be 5 MB or smaller" },
        { status: 400 },
      );
    }

    const ext = EXT_BY_TYPE[file.type] || ".jpg";
    const filename = `${randomUUID()}${ext}`;
    // Same folder the existing 36 cover images live in.
    const dir = path.join(process.cwd(), "public", "images", "blogs");
    await mkdir(dir, { recursive: true });

    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), bytes);

    const url = `/images/blogs/${filename}`;
    return NextResponse.json({
      success: true,
      message: "Cover image uploaded",
      data: { url, filename },
    });
  } catch (error) {
    return apiErrorResponse(error, "Upload failed", 500);
  }
}
