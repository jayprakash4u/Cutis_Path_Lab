import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { requireAdmin } from "@/lib/adminAuth";
import { toBit, toIntOr } from "@/lib/adminSql";
import { newId, sqlOne, sqlQuery, sqlTransaction, toBool } from "@/lib/mysql";

const SETTINGS_ID = "default";

/** Columns the admin form may write, in insert order. */
const SETTINGS_COLUMNS = [
  "heroTagline",
  "introHeading",
  "introLead",
  "introBody",
  "missionHeading",
  "missionBody",
  "missionImage",
  "visionHeading",
  "visionBody",
  "visionImage",
  "statsHeading",
  "certsHeading",
  "certsIntro",
];

/** Badge artwork lives in the page component; only these keys are accepted. */
const ICON_KEYS = new Set(["nabl", "iso", "cap"]);

function trimOrNull(value) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

function parseStats(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => ({
      value: String(item?.value || "").trim(),
      label: String(item?.label || "").trim(),
      sortOrder: toIntOr(item?.sortOrder, index),
      isActive: item?.isActive !== false,
    }))
    .filter((stat) => stat.value && stat.label);
}

function parseAccreditations(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      const iconKey = String(item?.iconKey || "").trim().toLowerCase();
      return {
        title: String(item?.title || "").trim(),
        body: String(item?.body || "").trim() || null,
        iconKey: ICON_KEYS.has(iconKey) ? iconKey : "nabl",
        sortOrder: toIntOr(item?.sortOrder, index),
        isActive: item?.isActive !== false,
      };
    })
    .filter((cert) => cert.title);
}

export async function GET(request) {
  try {
    const isAdmin = !requireAdmin(request);
    const liveOnly = isAdmin ? "" : "WHERE `isActive` = 1";

    const settings = await sqlOne(
      `SELECT \`id\`, ${SETTINGS_COLUMNS.map((c) => `\`${c}\``).join(", ")}
         FROM \`SiteAbout\`
        WHERE \`id\` = ?`,
      [SETTINGS_ID],
    );

    const stats = await sqlQuery(
      `SELECT \`id\`, \`value\`, \`label\`, \`sortOrder\`, \`isActive\`
         FROM \`AboutStat\` ${liveOnly}
        ORDER BY \`sortOrder\``,
    );

    const accreditations = await sqlQuery(
      `SELECT \`id\`, \`title\`, \`body\`, \`iconKey\`, \`sortOrder\`, \`isActive\`
         FROM \`AboutAccreditation\` ${liveOnly}
        ORDER BY \`sortOrder\``,
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          ...(settings || { id: SETTINGS_ID }),
          stats: stats.map((s) => ({ ...s, isActive: toBool(s.isActive) })),
          accreditations: accreditations.map((a) => ({
            ...a,
            isActive: toBool(a.isActive),
          })),
        },
      },
      isAdmin ? undefined : publicCatalogCache(),
    );
  } catch (error) {
    return apiErrorResponse(error, "Failed to load about settings", 500);
  }
}

export async function PUT(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const stats = parseStats(body.stats);
    const accreditations = parseAccreditations(body.accreditations);
    const values = SETTINGS_COLUMNS.map((column) => trimOrNull(body[column]));

    await sqlTransaction(async (conn) => {
      await conn.exec(
        `INSERT INTO \`SiteAbout\` (\`id\`, ${SETTINGS_COLUMNS.map((c) => `\`${c}\``).join(", ")})
         VALUES (?, ${SETTINGS_COLUMNS.map(() => "?").join(", ")})
         ON DUPLICATE KEY UPDATE
           ${SETTINGS_COLUMNS.map((c) => `\`${c}\` = VALUES(\`${c}\`)`).join(", ")}`,
        [SETTINGS_ID, ...values],
      );

      // Replace-all: the admin form owns both lists in full.
      await conn.exec("DELETE FROM `AboutStat`");
      for (const stat of stats) {
        await conn.exec(
          "INSERT INTO `AboutStat` (`id`, `value`, `label`, `sortOrder`, `isActive`) VALUES (?, ?, ?, ?, ?)",
          [newId(), stat.value, stat.label, stat.sortOrder, toBit(stat.isActive)],
        );
      }

      await conn.exec("DELETE FROM `AboutAccreditation`");
      for (const cert of accreditations) {
        await conn.exec(
          "INSERT INTO `AboutAccreditation` (`id`, `title`, `body`, `iconKey`, `sortOrder`, `isActive`) VALUES (?, ?, ?, ?, ?, ?)",
          [
            newId(),
            cert.title,
            cert.body,
            cert.iconKey,
            cert.sortOrder,
            toBit(cert.isActive),
          ],
        );
      }
    });

    return NextResponse.json({
      success: true,
      message: "About page saved",
      data: { stats: stats.length, accreditations: accreditations.length },
    });
  } catch (error) {
    return apiErrorResponse(error, "Failed to save about settings", 500);
  }
}
