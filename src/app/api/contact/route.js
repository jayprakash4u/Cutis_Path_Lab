import { NextResponse } from "next/server";
import { escapeSql, newId, sqlExec } from "@/lib/sqlserver";
import { contactCreateSchema } from "@/lib/validation/contact";
import { parseOrErrors } from "@/lib/validation/common";
import { validationError } from "@/lib/validation/http";

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = parseOrErrors(contactCreateSchema, {
      name: body.name ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      subject: body.subject ?? "",
      message: body.message ?? "",
    });

    if (!parsed.ok) {
      return validationError({
        message: parsed.message,
        errors: parsed.errors,
      });
    }

    const { name, email, phone, subject, message } = parsed.data;
    const id = newId();

    await sqlExec(`
      INSERT INTO dbo.ContactMessage (id, name, email, phone, subject, message)
      VALUES (
        ${escapeSql(id)},
        ${escapeSql(name)},
        ${escapeSql(email)},
        ${phone ? escapeSql(phone) : "NULL"},
        ${subject ? escapeSql(subject) : "NULL"},
        ${escapeSql(message)}
      );
    `);

    return NextResponse.json(
      { success: true, message: "Message saved", data: { id } },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/contact", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to save message" },
      { status: 500 },
    );
  }
}
