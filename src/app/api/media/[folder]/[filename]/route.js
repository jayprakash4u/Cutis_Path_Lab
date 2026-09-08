import { serveUploadedImage } from "@/lib/uploadedImages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = serveUploadedImage;
