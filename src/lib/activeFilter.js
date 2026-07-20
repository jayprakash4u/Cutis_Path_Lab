import { requireAdmin } from "@/lib/adminAuth";

/**
 * Public APIs default to active records only.
 * ?active=false requires admin (draft/inactive content).
 */
export function resolveActiveFilter(request, searchParams) {
  const includeInactive = searchParams.get("active") === "false";
  if (includeInactive) {
    const denied = requireAdmin(request);
    if (denied) {
      return { denied, activeOnly: true };
    }
    return { denied: null, activeOnly: false };
  }
  return { denied: null, activeOnly: true };
}
