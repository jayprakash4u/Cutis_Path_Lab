import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { requireAdmin } from "@/lib/adminAuth";
import { toBit, toIntOr } from "@/lib/adminSql";
import { newId, sqlOne, sqlQuery, sqlTransaction, toBool } from "@/lib/mysql";

const SETTINGS_ID = "default";

/** Columns the admin form is allowed to write, in insert order. */
const SETTINGS_COLUMNS = [
  "location",
  "phone",
  "whatsapp",
  "email",
  "hours",
  "emergencyNote",
  "mapEmbedUrl",
  "facebookUrl",
  "instagramUrl",
  "whatsappUrl",
  "xUrl",
  "linkedinUrl",
];

function trimOrNull(value) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

/**
 * Normalise the FAQ list posted by the admin form. Blank rows are dropped so
 * an empty trailing field never becomes an empty accordion item on the site.
 */
function parseFaqs(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => ({
      question: String(item?.question || "").trim(),
      answer: String(item?.answer || "").trim(),
      sortOrder: toIntOr(item?.sortOrder, index),
      isActive: item?.isActive !== false,
    }))
    .filter((faq) => faq.question && faq.answer);
}

export async function GET(request) {
  try {
    const isAdmin = !requireAdmin(request);

    const settings = await sqlOne(
      `SELECT \`id\`, \`location\`, \`phone\`, \`whatsapp\`, \`email\`, \`hours\`,
              \`emergencyNote\`, \`mapEmbedUrl\`, \`facebookUrl\`, \`instagramUrl\`,
              \`whatsappUrl\`, \`xUrl\`, \`linkedinUrl\`
         FROM \`SiteContact\`
        WHERE \`id\` = ?`,
      [SETTINGS_ID],
    );

    // The public page only ever shows live FAQs; admin needs the hidden ones too.
    const faqs = await sqlQuery(
      `SELECT \`id\`, \`question\`, \`answer\`, \`sortOrder\`, \`isActive\`
         FROM \`ContactFaq\`
         ${isAdmin ? "" : "WHERE `isActive` = 1"}
        ORDER BY \`sortOrder\`, \`question\``,
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          ...(settings || { id: SETTINGS_ID }),
          faqs: faqs.map((f) => ({ ...f, isActive: toBool(f.isActive) })),
        },
      },
      isAdmin ? undefined : publicCatalogCache(),
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to load contact settings", 500);
  }
}

export async function PUT(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const faqs = parseFaqs(body.faqs);

    const values = SETTINGS_COLUMNS.map((column) => trimOrNull(body[column]));

    await sqlTransaction(async (conn) => {
      // Upsert keeps this safe even if the seeded default row was removed.
      await conn.exec(
        `INSERT INTO \`SiteContact\` (\`id\`, ${SETTINGS_COLUMNS.map((c) => `\`${c}\``).join(", ")})
         VALUES (?, ${SETTINGS_COLUMNS.map(() => "?").join(", ")})
         ON DUPLICATE KEY UPDATE
           ${SETTINGS_COLUMNS.map((c) => `\`${c}\` = VALUES(\`${c}\`)`).join(", ")}`,
        [SETTINGS_ID, ...values],
      );

      // Replace-all: the form owns the whole list, same as package includes.
      await conn.exec("DELETE FROM `ContactFaq`");
      for (const faq of faqs) {
        await conn.exec(
          `INSERT INTO \`ContactFaq\`
             (\`id\`, \`question\`, \`answer\`, \`sortOrder\`, \`isActive\`)
           VALUES (?, ?, ?, ?, ?)`,
          [newId(), faq.question, faq.answer, faq.sortOrder, toBit(faq.isActive)],
        );
      }
    });

    return NextResponse.json({
      success: true,
      message: "Contact settings saved",
      data: { faqCount: faqs.length },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to save contact settings", 500);
  }
}
