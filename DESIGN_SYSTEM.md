# Cutis Path Lab — Design System

Source of truth for color, type, spacing, and the handful of shared UI
patterns every page is built from. If you're adding a new section or
component, check here before inventing a new value — almost everything
you need already exists as a token or a pattern below.

Tokens are defined once, in two places that must stay in sync:

- `tailwind.config.ts` → `theme.extend.colors` — use these as Tailwind
  utility classes (`bg-brand-600`, `text-accent-500`, ...) everywhere
  they reach: `className` on any element.
- `src/app/globals.css` → `:root` custom properties — the same values,
  for the few spots Tailwind classes can't reach: inline SVG
  `stroke`/`fill` attributes, `style={{ }}` props, third-party widgets.

Never hardcode a hex value in a component. If a value isn't a token
yet, add it to `tailwind.config.ts` first.

## Color

### The two palettes

**`brand`** (blue, hue 226, sampled from the logo — `brand-600 = #3750A4`)
is the site's color. It carries headings, body links, primary buttons,
active/selected state, borders, dividers, and the line-work in every
icon illustration. When in doubt, use brand.

**`accent`** (crimson, hue 351 — `accent-500 = #C62F45`) exists to be
spent rarely. It is not "the second brand color" to alternate with blue
— it's a flag for the one thing on a screen that should read as
different from everything else. Overusing it is what made the site feel
"too red" before this pass; the fix wasn't deleting the color, it was
tightening where it's allowed to appear.

### Where accent is allowed

Every current use of `accent-*` in the codebase falls into one of these
five cases. Adding a new one should fit one of them too — if it
doesn't, use brand instead.

1. **One secondary action next to a primary brand button.** The primary
   action stays `bg-brand-600`; the secondary sits beside it in accent so
   the pair reads as "the main thing" vs. "the alternate path" — never
   two competing reds, never accent alone.
   Examples: Navbar's "Report" button next to the search field, Hero's
   "Contact Us" next to "Book Test Now".
2. **A small-caps caption that names a role**, sitting directly under a
   name or title. Examples: doctor specialty (`DoctorReferrals`), team
   member badge (`TeamSection`), testimonial reviewer role
   (`Testimonials`).
3. **A single decorative mark**, used once per instance, not repeated
   across a grid. Example: the quote-mark icon on a doctor's testimonial
   card.
4. **A category/type tag** on a test, package, or offer card — a small
   pill naming what kind of thing the card is (`TestsInOffers`,
   `PackageCard`). Note this is *not* the discount percentage — "X%
   OFF" savings badges use green (`text-green-600`) sitewide, which is
   its own separate, standard convention and not part of the
   brand/accent system.
5. **Functional state**, which is a UX convention, not a brand choice:
   form validation errors, the `*` on a required field. These stay red
   regardless of the brand palette because that's what users expect.
6. **The footer's social icon cluster** (`Footer`) — a fixed set of 2–4
   icon buttons, not a repeated content grid, kept solid `accent-500`
   at rest (not just on hover) so they read as social links rather than
   blending into the rest of the blue footer.

### Where accent is *not* allowed

- Card borders, top/bottom accent bars, or ring outlines repeated across
  a grid of cards (doctor cards, service cards, testimonial cards all
  use `brand-500` borders now, not `accent-500`).
- Section dividers, underline strips under headings, bullet points —
  anything that appears on every page or every list item. Use
  `brand-500` (or `brand-200`/`brand-300` for something subtler).
- Icon fills/strokes used as the default state of a repeated icon set
  (service icons, tech icons, health-tip icons). These use `brand-400`
  as their "detail" tone against `brand-600` line-work — a two-tone
  *blue* language, not blue-plus-red.
- Primary CTAs — "Book Now", "Confirm Booking", "Proceed", step headers
  in a multi-step flow. These are the main action on the screen, so they
  take `brand-600`, matching the header/logo blue. Accent is for the
  secondary path only (case 1 above).
- Background "glow" decoration on dark panels (Testimonials, Book a
  Test, Lab Technology) — these use a soft `brand-400` blur now, not a
  coral one. A glow is decoration, not a flagged element.

### Neutrals

Body text, borders, and muted backgrounds come from Tailwind's default
`slate` scale (`text-slate-900` headings-on-white, `text-slate-600`
body copy, `text-slate-400` muted/disabled, `border-slate-200` card
borders). Don't invent grays outside this scale.

Page-section background rhythm alternates two tones only (see `Section`
below): `surface` (`#FFFFFF`) and `surface-tint` (`#F5F7FD`, a whisper
of brand blue, not neutral gray). There's a third, `surface-muted`
(`#F1F5F9`), used sparingly for input fills and disabled states.

## Typography

Defined in `tailwind.config.ts` → `theme.extend.fontSize`. Use the
named scale, not raw `text-[Npx]`, for anything that should track the
system if it's retuned:

| Token | Size | Use |
|---|---|---|
| `h1` | 36px / 700 | Page/hero titles |
| `h2` | 30px / 700 | Section titles |
| `h3` | 24px / 700 | Subsection titles |
| `h4` | 20px / 600 | Card/component titles |
| `body-lg` | 18px / 400 | Large body text |
| `body` | 16px / 400 | Regular body text |
| `body-bold` | 16px / 600 | Bold body text |
| `small` | 14px / 400 | Small text |
| `small-bold` | 14px / 600 | Bold small text |
| `tiny` | 12px / 400 | Tiny text (captions, meta) |

In practice, most section headings actually go through the shared
`SectionHeading` component (below), which already picks the right
responsive size — reach for the raw scale only when building something
that component doesn't cover.

## Spacing & layout

- **Page width**: `max-w-shell` (1440px), applied via `Section`'s
  `width="shell"`. Don't hardcode `max-w-7xl`/`max-w-6xl` in a new
  section — it will drift from every other section's edges.
- **Section rhythm**: `Section`'s `size` prop — `default`
  (`py-12 sm:py-16 lg:py-20`) for most sections, `compact`
  (`py-8 sm:py-10 lg:py-14`) for dense strips (offer rails, category
  chips).
- **Named spacing tokens** (`space-xs` through `space-3xl`) exist in the
  config for the rare case you need spacing outside Tailwind's default
  scale — reach for the default scale (`gap-4`, `p-6`, ...) first.

## Shadows

Three tiers, nothing bespoke — defined in `tailwind.config.ts` →
`theme.extend.boxShadow`:

- `shadow-card` — resting card elevation.
- `shadow-card-hover` — hover elevation, pairs with
  `hover:-translate-y-0.5` or similar.
- `shadow-float` — deeper, for elements that visually float over other
  content (the About section's layered photos).

## Shared components

- **`Section` / `SectionHeading`** (`src/components/ui/Section.jsx`) —
  every page section goes through these. `Section` fixes width,
  vertical rhythm, and tone (`white` / `tint` / `muted`) so bands stay
  consistent down the page; `SectionHeading` fixes the eyebrow-free
  title + accent underline + subtitle pattern (the underline is
  `brand-500`, per the rule above — not accent).
- **`Card` primitives** (`src/components/ui/Card.jsx`) — `InfoCard` and
  `PackageCard` for the contact/packages patterns. Card header bars use
  `bg-brand-600`, matching the primary-action color.
- **`CarouselButton` / `CarouselDots`** — shared prev/next and pager
  controls for every horizontally-scrolling band (team, referrals,
  testimonials, lab technology).

## Icon illustrations

Every hand-drawn icon set (`QuickActions`, `LabTechnology`'s
`TechIcon`, `AboutUsSection`'s `AboutIcon`, `HealthTips`) follows the
same construction: a 48–80px grid, ~2px primary stroke in
`brand-600` (`#3750A4`), a lighter `brand-400` (`#647DCE`) picking out
the one or two details that name the icon. Keep new icons in that
language — don't introduce a third icon color, and don't reach for
accent here (see "Where accent is not allowed" above).

## When you're not sure

1. Is this the main action on the screen? → `brand-600`.
2. Is this decoration that repeats (a border, a divider, an icon)? →
   `brand`, not accent.
3. Is this one of the five accent cases above? → `accent-500`, used
   once, not spread across a list.
4. Still unsure? Default to brand. Under-using accent is easy to fix
   later; over-using it is the thing this document exists to prevent.
