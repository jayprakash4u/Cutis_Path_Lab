import Image from "next/image";

/** Accurate srcset hint — banners sit in a 1920px-wide frame on large screens. */
const BANNER_SIZES = "(min-width: 1920px) 1920px, 100vw";

/**
 * Wide poster banners — same image on all screen sizes.
 * Uses unoptimized originals so embedded text/strokes stay sharp on desktop.
 */
export default function PagePosterHero({
  src,
  alt,
  width,
  height,
  priority = true,
}) {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative mx-auto w-full max-w-[1920px] leading-none">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          unoptimized
          sizes={BANNER_SIZES}
          className="block h-auto w-full max-w-full object-contain"
        />
      </div>
    </section>
  );
}
