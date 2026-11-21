import { RAW_BUSES } from "@/data/bus-routes";
import { STOP_COORDINATES } from "@/data/stop-coordinates";

/** Different spellings in the list that mean the same stop. */
const STOP_ALIASES: Record<string, string> = {
  "Azimpur Etimkhana Moor": "Azimpur",
  "Uttara House Building": "House Building",
  Gazipur: "Gazipur Chourasta",
  "Malibagh Moor": "Malibagh",
  "Rampura Bazar": "Rampura",
};

/** Buses don't fly: straight-line distance is stretched to approximate the road. */
export const ROAD_FACTOR = 1.3;

export type Bus = {
  id: string;
  name: string;
  nameBn?: string;
  endpoints: string;
  stops: string[];
};

export type DirectRide = {
  bus: Bus;
  stops: string[];
  distanceKm: number;
};

export type TransferRide = {
  first: DirectRide;
  second: DirectRide;
  changeAt: string;
  distanceKm: number;
};

export function canonicalStop(stop: string): string {
  const trimmed = stop.trim();
  return STOP_ALIASES[trimmed] ?? trimmed;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const BUSES: Bus[] = RAW_BUSES.map((b) => ({
  id: slug(b.name),
  name: b.name,
  ...(b.nameBn ? { nameBn: b.nameBn } : {}),
  endpoints: b.endpoints,
  stops: b.stops.map(canonicalStop),
}));

export const ALL_STOPS: string[] = Array.from(new Set(BUSES.flatMap((b) => b.stops))).sort((a, b) =>
  a.localeCompare(b, "en", { numeric: true }),
);

export function findStop(input: string): string | undefined {
  const wanted = canonicalStop(input).toLowerCase();
  return ALL_STOPS.find((s) => s.toLowerCase() === wanted);
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Approximate road distance travelled through the given stops in order, rounded to 0.1 km. */
export function pathDistanceKm(stops: string[]): number {
  let total = 0;
  for (let i = 1; i < stops.length; i++) {
    const a = STOP_COORDINATES[stops[i - 1] ?? ""];
    const b = STOP_COORDINATES[stops[i] ?? ""];
    if (a && b) total += haversineKm(a, b);
  }
  return Math.round(total * ROAD_FACTOR * 10) / 10;
}

function rideOn(bus: Bus, from: string, to: string): DirectRide | null {
  const i = bus.stops.indexOf(from);
  const j = bus.stops.indexOf(to);
  if (i < 0 || j < 0 || i === j) return null;
  const stops = i < j ? bus.stops.slice(i, j + 1) : bus.stops.slice(j, i + 1).reverse();
  return { bus, stops, distanceKm: pathDistanceKm(stops) };
}

/** Every bus that stops at both places, shortest ride first. */
export function findDirectRides(fromInput: string, toInput: string): DirectRide[] {
  const from = canonicalStop(fromInput);
  const to = canonicalStop(toInput);
  return BUSES.map((bus) => rideOn(bus, from, to))
    .filter((r): r is DirectRide => r !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/** Two-bus journeys with one change, best (shortest) option per pair of buses. */
export function findTransferRides(fromInput: string, toInput: string, limit = 6): TransferRide[] {
  const from = canonicalStop(fromInput);
  const to = canonicalStop(toInput);
  if (from === to) return [];
  const best = new Map<string, TransferRide>();

  for (const busA of BUSES) {
    if (!busA.stops.includes(from) || busA.stops.includes(to)) continue;
    for (const changeAt of busA.stops) {
      if (changeAt === from) continue;
      for (const busB of BUSES) {
        if (busB.id === busA.id || busB.stops.includes(from)) continue;
        const first = rideOn(busA, from, changeAt);
        const second = rideOn(busB, changeAt, to);
        if (!first || !second) continue;
        const distanceKm = Math.round((first.distanceKm + second.distanceKm) * 10) / 10;
        const key = `${busA.id}>${busB.id}`;
        const existing = best.get(key);
        if (!existing || distanceKm < existing.distanceKm) {
          best.set(key, { first, second, changeAt, distanceKm });
        }
      }
    }
  }

  return [...best.values()].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit);
}
