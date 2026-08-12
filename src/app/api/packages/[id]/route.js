import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { requireAdmin } from "@/lib/adminAuth";
import { buildUpdate, replacePackageIncludes, toNumOrNull } from "@/lib/adminSql";
import { sqlExec, sqlOne, sqlQuery } from "@/lib/mysql";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const packageId = String(id || "").trim();
    if (!packageId) {
      return NextResponse.json(
        { success: false, message: "Package id is required" },
        { status: 400 },
      );
    }

    const row = await sqlOne(
      `SELECT \`id\`, \`code\`, \`name\`, \`category\`, \`description\`, \`price\`,
              \`originalPrice\`, \`imageUrl\`, \`reportsTime\`, \`fasting\`, \`sampleType\`
         FROM \`Package\` WHERE \`id\` = ? LIMIT 1`,
      [packageId],
    );

    if (!row) {
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 },
      );
    }

    const includeRows = await sqlQuery(
      `SELECT pt.\`testName\`, pt.\`testId\`, pt.\`sortOrder\`,
              t.\`name\` AS linkedName, t.\`code\`, t.\`category\`, t.\`price\`
         FROM \`PackageTest\` pt
         LEFT JOIN \`Test\` t ON t.\`id\` = pt.\`testId\`
        WHERE pt.\`packageId\` = ?
        ORDER BY pt.\`sortOrder\``,
      [packageId],
    );

    const includeItems = includeRows.map((item) => ({
      testName: item.testName || item.linkedName || "",
      testId: item.testId || null,
      name: item.linkedName || item.testName || "",
      code: item.code || null,
      category: item.category || "Package",
      price: item.price ?? null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        id: row.id,
        code: row.code,
        name: row.name,
        category: row.category,
        description: row.description,
        price: row.price,
        originalPrice: row.originalPrice,
        image: row.imageUrl,
        imageUrl: row.imageUrl,
        reportsTime: row.reportsTime || "24-48 hrs",
        fasting: row.fasting || "10-12 hrs",
        sampleType: row.sampleType || "Blood",
        includes: includeItems.map((i) => i.testName),
        includeItems,
        tests: includeItems
          .filter((i) => i.testId)
          .map((i) => ({
            id: i.testId,
            name: i.name,
            category: i.category,
            price: i.price,
            code: i.code,
          })),
      },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to load package", 500);
  }
}

export async function PATCH(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const packageId = String(id || "").trim();
    const body = await request.json();

    const exists = await sqlOne("SELECT `id` FROM `Package` WHERE `id` = ? LIMIT 1", [
      packageId,
    ]);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 },
      );
    }

    const fields = {};
    if (body.code != null) fields.code = String(body.code).trim();
    if (body.name != null) fields.name = String(body.name).trim();
    if (body.category != null) fields.category = String(body.category).trim();
    if (body.description !== undefined) {
      fields.description = body.description ? String(body.description).trim() : null;
    }
    if (body.price != null) fields.price = toNumOrNull(body.price);
    if (body.originalPrice !== undefined) {
      fields.originalPrice = toNumOrNull(body.originalPrice);
    }
    if (body.imageUrl !== undefined || body.image !== undefined) {
      const v = body.imageUrl || body.image;
      fields.imageUrl = v ? String(v).trim() : null;
    }
    if (body.reportsTime != null) fields.reportsTime = String(body.reportsTime).trim();
    if (body.fasting != null) fields.fasting = String(body.fasting).trim();
    if (body.sampleType != null) fields.sampleType = String(body.sampleType).trim();

    if (Object.keys(fields).length > 0) {
      const { clause, params: values } = buildUpdate(fields);
      await sqlExec(`UPDATE \`Package\` SET ${clause} WHERE \`id\` = ?`, [
        ...values,
        packageId,
      ]);
    }

    if (body.includes !== undefined) {
      await replacePackageIncludes(packageId, body.includes);
    }

    return NextResponse.json({
      success: true,
      message: "Package updated",
      data: { id: packageId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to update package", 500);
  }
}

export async function DELETE(request, { params }) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await params;
    const packageId = String(id || "").trim();

    const exists = await sqlOne("SELECT `id` FROM `Package` WHERE `id` = ? LIMIT 1", [
      packageId,
    ]);
    if (!exists) {
      return NextResponse.json(
        { success: false, message: "Package not found" },
        { status: 404 },
      );
    }

    // PackageTest cascades; Booking.packageId and Offer.packageId are SET NULL.
    await sqlExec("DELETE FROM `Package` WHERE `id` = ?", [packageId]);

    return NextResponse.json({
      success: true,
      message: "Package deleted",
      data: { id: packageId },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to delete package", 500);
  }
}
