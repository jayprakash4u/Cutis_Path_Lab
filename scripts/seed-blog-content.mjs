/**
 * Fill in article bodies for posts that don't have one yet.
 *
 *   node scripts/seed-blog-content.mjs
 *
 * Additive and re-runnable: only writes to rows whose `content` is NULL or
 * empty, so anything already written in the admin console is never overwritten.
 * Pass --force to overwrite the posts listed below anyway.
 *
 * Add further articles to ARTICLES below, keyed by slug. The body format is the
 * small subset ArticleBody.jsx understands:
 *
 *   ## Heading      - bullet      1. numbered      **bold**
 *
 * Blank line separates paragraphs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const force = process.argv.includes("--force");

// Next loads .env itself; a standalone script has to do it by hand.
for (const file of [".env", ".env.local"]) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const ARTICLES = {
  "understanding-your-cbc-report": `*A single tube of blood, three different stories. Learning to read a CBC will not make you your own doctor — but it will make the conversation with yours a great deal shorter.*

A complete blood count, or **CBC**, is one of the most commonly ordered tests in any laboratory. It is often the first test a doctor asks for, because a single sample says something useful about three very different parts of your blood at once.

The report can look intimidating — a column of abbreviations next to a column of numbers. This guide explains what those rows are actually counting.

## What the report is telling you at a glance

| Row | What it counts | Commonly looked at for |
| --- | --- | --- |
| Haemoglobin | Oxygen-carrying protein | Anaemia |
| WBC | Immune system cells | Infection, inflammation |
| Platelets | Clotting fragments | Bleeding and bruising |
| MCV | Average red cell size | The type of anaemia |

## What a CBC measures

A CBC looks at the cells suspended in your blood, not the chemistry dissolved in it. The main rows are:

- **Haemoglobin (Hb)** — the protein inside red cells that carries oxygen around the body.
- **Red blood cells (RBC)** — how many oxygen-carrying cells are present in a given volume.
- **White blood cells (WBC)** — the cells of the immune system, which respond to infection and inflammation.
- **Platelets** — the fragments that let blood clot when a vessel is injured.
- **Haematocrit (HCT)** — the proportion of your blood, by volume, made up of red cells.
- **MCV, MCH and MCHC** — indices describing the average size of your red cells and how much haemoglobin each one carries.

Many reports also include a **differential**, which breaks the white cell count down into its types — neutrophils, lymphocytes, monocytes, eosinophils and basophils.

## Reading the reference range

Next to each result you will see a reference range. This is the span of values seen in most healthy people, and it is the single most misunderstood part of the report.

> A result marginally outside the reference range is common, and on its own it is rarely the finding that matters. What your doctor is reading is the pattern across the rows — and how it compares with your last report.

Two things are worth knowing. First, reference ranges differ between laboratories, because they depend on the analyser and the population the lab serves — a value flagged at one lab may sit inside the range at another. Always read a result against the range printed on that same report.

Second, ranges vary by age and sex. Haemoglobin norms differ between men and women, and children have their own values entirely. A result marginally outside the range is common and frequently means nothing on its own.

## What high or low values can suggest

A single number rarely gives an answer. Doctors read the rows together, alongside your symptoms and history. Broadly:

- **Low haemoglobin** is the usual signature of anaemia, which has many causes — iron deficiency being the most common.
- **A raised white cell count** often accompanies infection or inflammation, though it also rises with physical stress.
- **A low white cell count** can follow some viral infections or certain medications.
- **Low platelets** may mean bruising or bleeding more easily; high platelets can occur reactively after infection.
- **A low MCV** points toward smaller-than-usual red cells, which is typical of iron deficiency; a high MCV points the other way.

None of these is a diagnosis. They are directions for the next question your doctor asks.

## Before your test

A CBC needs no special preparation in most cases, but a few habits make the result cleaner:

1. Ask whether fasting is needed. It usually is not for a CBC alone, but it often is for the other tests ordered alongside it.
2. Drink water normally. Dehydration concentrates your blood and can nudge several values upward.
3. Mention any medication or supplement you take, particularly iron, B12 or anything affecting clotting.
4. Sit and rest for a few minutes before the sample is drawn.
5. Tell the phlebotomist if you have felt faint during a blood draw before.

## When you get the report

Take the whole report to whoever ordered it, not just the flagged rows. Trends matter more than single readings, so if you have had a CBC before, bring that one too — a value that has moved steadily across three reports tells a clearer story than any one number in isolation.`,
};

const {
  MYSQL_HOST = "localhost",
  MYSQL_PORT = "3306",
  MYSQL_USER = "root",
  MYSQL_PASSWORD = "",
  MYSQL_DATABASE,
  MYSQL_DB,
} = process.env;

const database = MYSQL_DATABASE || MYSQL_DB;
if (!database) {
  console.error("No MYSQL_DATABASE / MYSQL_DB in .env — nothing to connect to.");
  process.exit(1);
}

const conn = await mysql.createConnection({
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database,
});

let written = 0;
let skipped = 0;

for (const [slug, content] of Object.entries(ARTICLES)) {
  const [rows] = await conn.query(
    "SELECT `id`, CHAR_LENGTH(COALESCE(`content`, '')) AS len FROM `BlogPost` WHERE `slug` = ? LIMIT 1",
    [slug],
  );

  if (rows.length === 0) {
    console.log(`  no such post: ${slug}`);
    continue;
  }
  if (rows[0].len > 0 && !force) {
    console.log(`  already written, left alone: ${slug}`);
    skipped += 1;
    continue;
  }

  // readMinutes kept honest at roughly 200 words a minute.
  const words = content.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(words / 200));

  await conn.execute(
    "UPDATE `BlogPost` SET `content` = ?, `readMinutes` = ? WHERE `slug` = ?",
    [content, readMinutes, slug],
  );
  console.log(`  wrote ${words} words (${readMinutes} min): ${slug}`);
  written += 1;
}

// `empty` is a reserved word in MySQL 8, so the alias has to be quoted.
const [[stats]] = await conn.query(
  "SELECT COUNT(*) AS total, SUM(`content` IS NULL OR `content` = '') AS `empty` FROM `BlogPost`",
);

console.log(`\n${written} written, ${skipped} skipped.`);
console.log(`BlogPost: ${stats.total} posts, ${stats.empty} still without a body.`);

await conn.end();
