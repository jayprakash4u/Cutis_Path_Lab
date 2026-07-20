import { NextResponse } from "next/server";

/**
 * JSON 400 for validation failures.
 * @param {{ message: string, errors?: Record<string, string> }} payload
 */
export function validationError(payload) {
  return NextResponse.json(
    {
      success: false,
      message: payload.message || "Validation failed",
      errors: payload.errors || {},
    },
    { status: 400 },
  );
}
