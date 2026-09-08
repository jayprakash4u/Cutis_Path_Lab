import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { persistUploadedImage, UPLOAD_FOLDERS } from "@/lib/uploadedImages";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const EXT_BY_TYPE = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

/**
 * Every admin image upload lands here: same size cap, same type allowlist, same
 * random filename. `folder` is caller-controlled — a name from the route, never
 * anything out of the request. Bytes are stored in MySQL so live can serve them
 * even when the host filesystem is read-only.
 */
export async function saveUploadedImage(request, folder) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    if (!UPLOAD_FOLDERS.has(folder)) {
      return NextResponse.json(
        { success: false, message: "Unknown upload folder" },
        { status: 400 },
      );
    }

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
    const bytes = Buffer.from(await file.arrayBuffer());

    await persistUploadedImage({
      folder,
      filename,
      mimeType: file.type,
      bytes,
    });

    return NextResponse.json({
      success: true,
      message: "Image uploaded",
      data: { url: `/api/media/${folder}/${filename}`, filename },
    });
  } catch (error) {
    return apiErrorResponse(error, "Upload failed", 500);
  }
}

/** Route factory for the fixed-folder endpoints. */
export function imageUploadRoute(folder) {
  return (request) => saveUploadedImage(request, folder);
}
