import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import {
  clearAdminSessionCookie,
  createAdminSessionCookie,
  getAdminSession,
  requireAdmin,
  verifyAdminCredentials,
} from "@/lib/adminAuth";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const session = getAdminSession(request);
  return NextResponse.json({
    success: true,
    data: { username: session.u, authenticated: true },
  });
}

export async function POST(request) {
  const limited = rateLimit(request, {
    key: "admin-login",
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (limited) return limited;

  try {
    const body = await request.json();
    const username = String(body.username || body.user || "").trim();
    const password = String(body.password || "");

    const result = verifyAdminCredentials(username, password);
    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged in",
      data: { username },
    });
    const cookie = createAdminSessionCookie(username);
    response.cookies.set(cookie);
    return response;
  } catch (error) {
    return apiErrorResponse(error, "Login failed", 500, "POST /api/admin/auth");
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set(clearAdminSessionCookie());
  return response;
}
