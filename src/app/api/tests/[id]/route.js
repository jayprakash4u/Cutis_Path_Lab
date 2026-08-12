import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { buildUpdate, toBit, toNumOrNull } from "@/lib/adminSql";
import { sqlExec, sqlOne, sqlTransaction, toBool } from "@/lib/mysql";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const testId = String(id || "").trim();

    const row = await sqlOne(
      `SELECT \`id\`, \`code\`, \`name\`, \`category\`, \`price\`, \`originalPrice\`,
              \`description\`, \`sampleType\`, \`fastingRequired\`, \`reportTime\`,
              \`parameters\`, \`popular\`, \`iconUrl\`
         FROM \`Test\` WHERE \`id\` = ? LIMIT 1`,
      [testId],
    );

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Test not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...row,
        fastingRequired: toBool(row.fastingRequired),
        popular: toBool(row.popular),
      },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load test", 500);
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const testId = String(id || "").trim();
    const body = await request.json();

    const fields = {};
    if (body.code != null) fields.code = String(body.code).trim();
    if (body.name != null) fields.name = String(body.name).trim();
    if (body.category != null) fields.category = String(body.category).trim();
    if (body.price != null) fields.price = toNumOrNull(body.price);
    if (body.originalPrice !== undefined) {
      fields.originalPrice = toNumOrNull(body.originalPrice);
    }
    if (body.description !== undefined) {
      fields.description = body.description ? String(body.description).trim() : null;
    }
    if (body.sampleType !== undefined) {
      fields.sampleType = body.sampleType ? String(body.sampleType).trim() : null;
    }
    if (body.fastingRequired !== undefined) {
      fields.fastingRequired = toBit(body.fastingRequired);
    }
    if (body.reportTime !== undefined) {
      fields.reportTime = body.reportTime ? String(body.reportTime).trim() : null;
    }
    if (body.parameters !== undefined) fields.parameters = toNumOrNull(body.parameters);
    if (body.popular !== undefined) fields.popular = toBit(body.popular);
    if (body.iconUrl !== undefined) {
      fields.iconUrl = body.iconUrl ? String(body.iconUrl).trim() : null;
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    const exists = await sqlOne("SELECT `id` FROM `Test` WHERE `id` = ? LIMIT 1", [testId]);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Test not found" },
        { status: 404 },
      );
    }

    const { clause, params: values } = buildUpdate(fields);
    await sqlExec(`UPDATE \`Test\` SET ${clause} WHERE \`id\` = ?`, [...values, testId]);

    return NextResponse.json({
      success: true,
      message: "Test updated",
      data: { id: testId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update test", 500);
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const testId = String(id || "").trim();

    const exists = await sqlOne("SELECT `id` FROM `Test` WHERE `id` = ? LIMIT 1", [testId]);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Test not found" },
        { status: 404 },
      );
    }

    // Booking/PackageTest/Offer references are ON DELETE SET NULL, but CategoryTest
    // cascades — clearing explicitly keeps the intent obvious.
    await sqlTransaction(async (tx) => {
      await tx.exec("DELETE FROM `CategoryTest` WHERE `testId` = ?", [testId]);
      await tx.exec("DELETE FROM `Test` WHERE `id` = ?", [testId]);
    });

    return NextResponse.json({
      success: true,
      message: "Test deleted",
      data: { id: testId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete test", 500);
  }
}
