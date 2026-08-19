import { NextResponse } from "next/server";
import { apiErrorResponse } from "@/lib/apiError";
import { publicCatalogCache } from "@/lib/publicApiCache";
import { requireAdmin } from "@/lib/adminAuth";
import { sqlExec, sqlOne } from "@/lib/mysql";

const SETTINGS_ID = "default";

function trimOrNull(value) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

/**
 * GET/PUT handlers for a single-row settings table.
 *
 * The header strip and the footer are separate tables with the same shape of
 * screen behind them, so the route logic lives here once. `columns` is the
 * allowlist the admin form may write — never anything from the request body.
 * `flags` are the TINYINT(1) columns, written as 0/1 and read back as booleans.
 */
export function siteSettingsHandlers({ table, columns, flags = [], label }) {
  const allColumns = [...columns, ...flags];
  const selectList = ["`id`", ...allColumns.map((c) => `\`${c}\``)].join(", ");

  async function readRow() {
    const row = await sqlOne(
      `SELECT ${selectList} FROM \`${table}\` WHERE \`id\` = ? LIMIT 1`,
      [SETTINGS_ID],
    );
    if (!row) return { id: SETTINGS_ID };
    for (const flag of flags) row[flag] = row[flag] === 1 || row[flag] === true;
    return row;
  }

  async function GET(request) {
    try {
      const isAdmin = !requireAdmin(request);
      const data = await readRow();
      return NextResponse.json(
        { success: true, data },
        isAdmin ? undefined : publicCatalogCache(),
      );
    } catch (error) {
      return apiErrorResponse(error, `Failed to load ${label} settings`, 500);
    }
  }

  async function PUT(request) {
    const denied = requireAdmin(request);
    if (denied) return denied;

    try {
      const body = await request.json();
      const values = [
        ...columns.map((column) => trimOrNull(body[column])),
        // An absent flag keeps its default of "on" rather than hiding the strip.
        ...flags.map((flag) => (body[flag] === false ? 0 : 1)),
      ];

      // Upsert, so the row is recreated if the seeded default was removed.
      await sqlExec(
        `INSERT INTO \`${table}\` (\`id\`, ${allColumns.map((c) => `\`${c}\``).join(", ")})
         VALUES (?, ${allColumns.map(() => "?").join(", ")})
         ON DUPLICATE KEY UPDATE
           ${allColumns.map((c) => `\`${c}\` = VALUES(\`${c}\`)`).join(", ")}`,
        [SETTINGS_ID, ...values],
      );

      return NextResponse.json({ success: true, message: `${label} settings saved` });
    } catch (error) {
      return apiErrorResponse(error, `Failed to save ${label} settings`, 500);
    }
  }

  return { GET, PUT };
}
