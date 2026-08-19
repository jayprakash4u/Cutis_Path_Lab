import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { saveUploadedImage } from "@/lib/uploadRoute";

/**
 * Shared endpoint for the admin screens that keep an image URL in a text field.
 * The folder comes from the URL, so it is checked against this list — an
 * arbitrary value would let a caller write outside public/images.
 */
const FOLDERS = new Set([
  "about",
  "banners",
  "home",
  "packages",
  "services",
  "team",
  "testimonials",
  "tests",
]);

export async function POST(request, { params }) {
  // Authorise first, so the folder list isn't discoverable by an anonymous probe.
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { folder } = await params;
  const name = String(folder || "").trim();

  if (!FOLDERS.has(name)) {
    return NextResponse.json(
      { success: false, message: "Unknown upload folder" },
      { status: 400 },
    );
  }

  return saveUploadedImage(request, name);
}
