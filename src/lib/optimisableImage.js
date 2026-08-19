// Admins can paste an arbitrary image URL, and next/image throws on a host that
// isn't in next.config remotePatterns. Optimise the sources we know are
// configured; callers fall back to a plain <img> for anything else so one bad
// URL can't take a page down.
const OPTIMISED_IMAGE_HOSTS = ["images.unsplash.com", "plus.unsplash.com"];

export function canUseNextImage(src) {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    return OPTIMISED_IMAGE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}
