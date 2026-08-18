/**
 * Renders an article body written in the admin console's plain textarea.
 *
 * Deliberately NOT `dangerouslySetInnerHTML`. Blog content is stored as free
 * text, and rendering it as raw HTML would turn the admin editor into a stored
 * XSS vector against every reader of the site. Parsing to React elements means
 * anything that looks like a tag is escaped by React and shown as text.
 *
 * The supported markup is the small subset an author actually reaches for:
 *
 *   ## Heading                  (## through ####)
 *   - bullet / * bullet
 *   1. numbered
 *   > pull quote
 *   | Feature | Meaning |      table, second row is the --- separator
 *   | ---     | ---     |
 *   **bold**  *italic*
 *   blank line                  paragraph break
 */

const UNORDERED = /^[-*]\s+/;
const ORDERED = /^\d+[.)]\s+/;
const HEADING = /^(#{2,4})\s+(.*)$/;
const QUOTE = /^>\s?/;
const TABLE_ROW = /^\|.*\|$/;
/* The |---|:--:|---| line under a table's header row. */
const TABLE_DIVIDER = /^\|[\s:|-]+\|$/;

/** Splits `**bold**` and `*italic*` runs out of a line of text. */
function renderInline(text) {
  return String(text)
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, i) => {
      if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
}

/** `| a | b |` -> ["a", "b"] */
function splitRow(line) {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

/*
  ── Plain-text rescue ────────────────────────────────────────────────────────

  Authors write in a bare textarea, and most of them type prose, not markdown:
  a short line as a section title, and "Term: explanation" lines where a bullet
  list is meant. Rendered literally that is an undifferentiated wall of text.

  These two heuristics recover the structure the author clearly intended. They
  are applied ONLY to documents containing no explicit `##` heading — once
  someone formats a piece by hand, guessing on top of them would be wrong.
*/

/** "Blood Sugar Regulation: Active compounds in coriander seeds…" */
const DEFINITION = /^([A-Z][^:]{2,45}):\s+(\S.{15,})$/;

/** A short, unpunctuated line sitting above more content reads as a title. */
function looksLikeHeading(text, next) {
  if (!next) return false; // an article should not end on a heading
  if (text.length > 60) return false;
  if (/[.!?,;:]$/.test(text)) return false;
  if (text.split(/\s+/).length > 8) return false;
  return !DEFINITION.test(text);
}

function refineBlocks(blocks) {
  const out = [];

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];

    if (block.type !== "p") {
      out.push(block);
      continue;
    }

    // A run of "Term: explanation" paragraphs becomes one bullet list. Two or
    // more, so a lone sentence that happens to contain a colon is left alone.
    if (DEFINITION.test(block.text)) {
      const items = [];
      let j = i;
      while (j < blocks.length && blocks[j].type === "p" && DEFINITION.test(blocks[j].text)) {
        const [, term, rest] = DEFINITION.exec(blocks[j].text);
        items.push(`**${term}** — ${rest}`);
        j += 1;
      }
      if (items.length >= 2) {
        out.push({ type: "list", ordered: false, items });
        i = j - 1;
        continue;
      }
    }

    if (looksLikeHeading(block.text, blocks[i + 1])) {
      out.push({ type: "h", level: 2, text: block.text });
      continue;
    }

    out.push(block);
  }

  return out;
}

function parseBlocks(raw) {
  const lines = String(raw).replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];

  let paragraph = [];
  let list = null;
  let quote = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ type: "list", ordered: list.ordered, items: list.items });
      list = null;
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      blocks.push({ type: "quote", text: quote.join(" ") });
      quote = [];
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  // Indexed rather than for..of, because a table has to look ahead a line.
  for (let i = 0; i < lines.length; i += 1) {
    const text = lines[i].trim();

    if (!text) {
      flushAll();
      continue;
    }

    const heading = HEADING.exec(text);
    if (heading) {
      flushAll();
      blocks.push({ type: "h", level: heading[1].length, text: heading[2] });
      continue;
    }

    // A table is a header row, a divider, then body rows.
    if (TABLE_ROW.test(text) && TABLE_DIVIDER.test((lines[i + 1] || "").trim())) {
      flushAll();
      const head = splitRow(text);
      const rows = [];
      i += 2;
      while (i < lines.length && TABLE_ROW.test(lines[i].trim())) {
        rows.push(splitRow(lines[i].trim()));
        i += 1;
      }
      i -= 1;
      blocks.push({ type: "table", head, rows });
      continue;
    }

    if (QUOTE.test(text)) {
      flushParagraph();
      flushList();
      quote.push(text.replace(QUOTE, ""));
      continue;
    }

    const unordered = UNORDERED.test(text);
    const ordered = !unordered && ORDERED.test(text);

    if (unordered || ordered) {
      flushParagraph();
      flushQuote();
      // A switch between bullet and numbered starts a new list.
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push(text.replace(unordered ? UNORDERED : ORDERED, ""));
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(text);
  }

  flushAll();

  // Hand-formatted documents are left exactly as written.
  return /^##\s/m.test(raw) ? blocks : refineBlocks(blocks);
}

export default function ArticleBody({ content }) {
  const blocks = parseBlocks(content || "");
  if (blocks.length === 0) return null;

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === "h") {
          const Tag = block.level === 2 ? "h2" : block.level === 3 ? "h3" : "h4";
          return (
            <Tag
              key={i}
              className={
                block.level === 2
                  ? "scroll-mt-24 pt-3 text-base font-bold text-slate-900 sm:text-lg"
                  : "scroll-mt-24 pt-2 text-[15px] font-bold text-slate-800 sm:text-base"
              }
            >
              {renderInline(block.text)}
            </Tag>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={i}
              className="rounded-r-xl border-l-4 border-[#FF6B6B] bg-gray-50 px-5 py-4 text-[15px] italic leading-[1.8] text-slate-600"
            >
              {renderInline(block.text)}
            </blockquote>
          );
        }

        if (block.type === "table") {
          return (
            /* Wide content scrolls inside its own box — the page itself must
               never scroll sideways on a phone. */
            <div key={i} className="-mx-1 overflow-x-auto pb-1">
              <table className="w-full min-w-[30rem] border-collapse overflow-hidden rounded-xl border border-slate-200 text-left text-sm">
                <thead>
                  <tr className="bg-sky-50">
                    {block.head.map((cell, j) => (
                      <th
                        key={j}
                        scope="col"
                        className="border-b border-slate-200 px-4 py-3 font-bold text-slate-900"
                      >
                        {renderInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, j) => (
                    <tr key={j} className="border-b border-slate-100 last:border-0">
                      {row.map((cell, k) => (
                        <td
                          key={k}
                          className={`px-4 py-3 align-top leading-relaxed ${
                            k === 0 ? "font-semibold text-slate-800" : "text-slate-600"
                          }`}
                        >
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag key={i} className="space-y-2.5 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-[15px] leading-[1.75] text-slate-600">
                  {block.ordered ? (
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-sky-50 text-[11px] font-bold text-sky-700">
                      {j + 1}
                    </span>
                  ) : (
                    <span
                      className="mt-[0.55rem] h-1.5 w-1.5 flex-none rounded-full bg-[#FF6B6B]"
                      aria-hidden="true"
                    />
                  )}
                  <span className="min-w-0">{renderInline(item)}</span>
                </li>
              ))}
            </Tag>
          );
        }

        return (
          <p key={i} className="text-[15px] leading-[1.85] text-slate-600">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}
