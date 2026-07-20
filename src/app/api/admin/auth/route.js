import { NextResponse } from "next/server";
import {
  clearAdminSessionCookie,
  createAdminSessionCookie,
  getAdminSession,
  requireAdmin,
  verifyAdminCredentials,
} from "@/lib/adminAuth";

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
    return NextResponse.json(
      { success: false, message: error.message || "Login failed" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set(clearAdminSessionCookie());
  return response;
}
