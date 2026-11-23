export type ServiceBadge = { label: string; tone: "cyan" | "pink" | "lime" | "muted" };

/** Short badges for a route's service type, e.g. "DTCA Franchise (AC)" → DTCA Franchise + AC. */
export function serviceBadges(service: string, operator = ""): ServiceBadge[] {
  const badges: ServiceBadge[] = [];
  if (/^State-Owned/i.test(service) || /^BRTC\b/i.test(operator)) badges.push({ label: "BRTC", tone: "lime" });
  if (/DTCA Franchise/i.test(service)) badges.push({ label: "DTCA Franchise", tone: "cyan" });
  if (/\bAC\b/.test(service) && !/Non-AC/i.test(service)) badges.push({ label: "AC", tone: "cyan" });
  if (/Semi-Seating/i.test(service)) badges.push({ label: "Semi-Seating", tone: "pink" });
  if (badges.length === 0) {
    const inner = service.match(/\(([^)]*)\)/)?.[1];
    badges.push({ label: inner ?? service, tone: "muted" });
  }
  return badges;
}
