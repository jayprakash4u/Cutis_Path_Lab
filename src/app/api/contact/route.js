import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { sendContactNotification } from "@/lib/mail";
import { rateLimit } from "@/lib/rateLimit";
import { escapeSql, newId, sqlExec } from "@/lib/sqlserver";
import { contactCreateSchema } from "@/lib/validation/contact";
import { parseOrErrors } from "@/lib/validation/common";
import { validationError } from "@/lib/validation/http";

export async function POST(request) {
  const limited = rateLimit(request, {
    key: "contact",
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (limited) return limited;

  try {
    const body = await request.json();

    // Honeypot — bots often fill hidden fields
    if (body._honeypot || body.website) {
      return NextResponse.json(
        { success: true, message: "Message saved", data: { id: "ok" } },
        { status: 201 },
      );
    }

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

    const mail = await sendContactNotification({
      id,
      name,
      email,
      phone,
      subject,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message saved",
        data: { id, email: { labNotified: mail.sent } },
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to save message", 500, "POST /api/contact");
  }
}
