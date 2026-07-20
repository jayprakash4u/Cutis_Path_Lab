import Image from "next/image";

export default function PagePosterHero({ src, alt, width, height, priority = true }) {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative mx-auto w-full max-w-[1920px]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="100vw"
          className="block h-[18vh] w-full object-cover object-center sm:h-auto sm:object-contain"
        />
      </div>
    </section>
  );
}
