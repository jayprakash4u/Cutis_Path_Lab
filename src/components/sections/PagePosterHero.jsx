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
  // Optional portrait-ish crop for phones. Wide posters are only ~10:1, which
  // is a thin strip on a narrow screen.
  mobileSrc,
  mobileWidth,
  mobileHeight,
  mobileUpTo = 639,
}) {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative mx-auto w-full max-w-[1920px] leading-none">
        {mobileSrc ? (
          /*
            <picture> rather than two <Image>s toggled with `hidden`: CSS only
            hides an element, it does not stop the download, so that approach
            would pull both posters on every device. Here the browser fetches
            exactly one. next/image is not lost in practice — these banners are
            `unoptimized` either way, to keep embedded text crisp.
          */
          <picture>
            <source
              media={`(max-width: ${mobileUpTo}px)`}
              srcSet={mobileSrc}
              width={mobileWidth}
              height={mobileHeight}
            />
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              fetchPriority={priority ? "high" : undefined}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="block h-auto w-full max-w-full object-contain"
            />
          </picture>
        ) : (
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
        )}
      </div>
    </section>
  );
}
