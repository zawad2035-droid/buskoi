import { measurePath, type Bus } from "@/lib/route-finder";

const cache = new Map<string, ReturnType<typeof measurePath>>();

/** Whole-route distance and normal time, end to end. */
export function measureRoute(bus: Bus) {
  const hit = cache.get(bus.id);
  if (hit) return hit;
  const m = measurePath(bus.stops, bus.points);
  cache.set(bus.id, m);
  return m;
}
