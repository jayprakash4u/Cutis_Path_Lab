import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { canUseNextImage } from "@/lib/optimisableImage";

/** Two letters from the name, for members added before their photo is ready. */
function initials(name) {
  return String(name || "")
    .replace(/^(dr|prof|mr|mrs|ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function MemberPhoto({ src, name }) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-sky-50">
        <span className="text-2xl font-bold tracking-wide text-sky-600" aria-hidden="true">
          {initials(name) || "•"}
        </span>
      </div>
    );
  }

  if (canUseNextImage(src)) {
    return (
      <Image
        src={src}
        alt={name || ""}
        fill
        className="object-cover object-top"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={name || ""} className="h-full w-full object-cover object-top" />;
}

function MemberCard({ member }) {
  const card = (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-[#FF6B6B] bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-card-hover">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
        <MemberPhoto src={member.imageUrl} name={member.title} />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-sm font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-sky-700 sm:text-base">
          {member.title}
        </h3>

        {member.badge ? (
          <p className="mt-0.5 text-xs font-semibold text-sky-600 sm:text-sm">{member.badge}</p>
        ) : null}

        {member.note ? (
          <p className="mt-0.5 text-[0.7rem] uppercase tracking-wide text-slate-400">
            {member.note}
          </p>
        ) : null}

        {member.description ? (
          <p className="mt-2.5 flex-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
            {member.description}
          </p>
        ) : null}
      </div>
    </article>
  );

  if (!member.linkUrl) return card;

  return (
    <Link
      href={member.linkUrl}
      className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
    >
      {card}
    </Link>
  );
}

/**
 * The people band. Unlike the other sections this has no built-in fallback
 * copy — inventing staff would be worse than showing nothing — so it renders
 * only once members are added in Admin → Home page → Our team.
 */
export default function TeamSection({ section, items }) {
  const members = items || [];
  if (members.length === 0) return null;

  return (
    <Section tone="tint">
      <SectionHeading
        title={section?.title || "Meet the team behind your reports"}
        subtitle={
          section?.subtitle ||
          "Pathologists, technologists and support staff who review every sample that comes through the lab."
        }
      />

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {members.map((member) => (
          <li key={member.id || member.title} className="h-full">
            <MemberCard member={member} />
          </li>
        ))}
      </ul>

      {section?.ctaLabel && section?.ctaHref ? (
        <div className="mt-8 flex justify-center">
          <Link
            href={section.ctaHref}
            className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-sky-700"
          >
            {section.ctaLabel}
          </Link>
        </div>
      ) : null}
    </Section>
  );
}
