// Admins can paste an arbitrary image URL, and next/image throws on a host that
// isn't in next.config remotePatterns. Optimise the sources we know are
// configured; callers fall back to a plain <img> for anything else so one bad
// URL can't take a page down.
const OPTIMISED_IMAGE_HOSTS = ["images.unsplash.com", "plus.unsplash.com"];

const UPLOADED_FILE =
  /^\/(?:api\/media|images)\/[a-z-]+\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\./i;

export function canUseNextImage(src) {
  if (!src) return false;
  const pathOnly = src.split("?")[0];
  if (pathOnly.startsWith("/api/media/")) return false;
  if (UPLOADED_FILE.test(pathOnly)) return false;
  if (src.startsWith("/")) return true;
  try {
    return OPTIMISED_IMAGE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}
