import { RAW_BUSES } from "@/data/bus-routes";
import { STOP_COORDINATES } from "@/data/stop-coordinates";

/** Different spellings in the list that mean the same stop. */
const STOP_ALIASES: Record<string, string> = {
  "Agargaon (IDB)": "Agargaon",
  Aminbazar: "Amin Bazar",
  "Arambagh (Notre Dame College)": "Arambagh",
  Ashulia: "Ashulia Bazar",
  Basabo: "Bashabo",
  "Bashundhara (300 Feet Gate)": "Bashundhara",
  "Chashara (Narayanganj)": "Chashara",
  "Chiriyakhana (Zoo)": "Chiriyakhana",
  "National Zoo (Chiriyakhana)": "Chiriyakhana",
  "Dhaur Bridge": "Dhour",
  "Farmgate / Khejur Bagan / Khamar Bari": "Farmgate",
  "Janapoth Moor": "Janapath Moor",
  Jashimuddin: "Jashimuddin (Uttara)",
  "Kanchpur Bridge": "Kanchpur",
  "Malibagh Moor": "Malibagh",
  Merul: "Merul Badda",
  "Mirpur 14 Bus Stand": "Mirpur 14",
  "Mirpur Sony Cinema Hall": "Sony Cinema Hall",
  "Mohammadpur Bus Stand": "Mohammadpur",
  Nabinagar: "Nobinagar",
  "North Badda": "Uttar Badda",
  "Notun Bazar (Coca-Cola)": "Notun Bazar",
  "Rajlakshmi (Uttara)": "Rajlakshmi",
  "Rampura Bazar": "Rampura",
  "Rupnagar Abashik": "Rupnagar",
  Wireless: "Wireless Gate",
};

/** Buses don't fly: straight-line distance is stretched to approximate the road. */
export const ROAD_FACTOR = 1.3;

/**
 * Normal (non-live) journey-time model. Each stretch between two stops gets a typical bus
 * speed for where it is — slowest in the city core, faster on the outskirts and highways,
 * fastest on the elevated expressway — plus a short halt at every stop in between.
 */
const CITY_CENTRE: [number, number] = [23.745, 90.405];
const SPEED_ZONES: Array<{ withinKm: number; kmh: number }> = [
  { withinKm: 4, kmh: 11 }, // Motijheel, Shahbag, Farmgate core
  { withinKm: 9, kmh: 14 }, // inner city: Mirpur, Mohakhali, Jatrabari
  { withinKm: 16, kmh: 20 }, // outer city: Uttara, Gabtoli, Demra
];
const HIGHWAY_KMH = 30;
const EXPRESSWAY_KMH = 40;
const EXPRESSWAY_STOPS = new Set(["Kawla (Dhaka Elevated Expressway)"]);
export const STOP_HALT_MIN = 0.75;
export const TRANSFER_WAIT_MIN = 8;

type LatLng = [number, number];

export type Bus = {
  id: string;
  /** Display name: operator plus line when an operator runs several lines. */
  name: string;
  operator: string;
  line?: string;
  nameBn?: string;
  service: string;
  endpoints: string;
  stops: string[];
  /** Map position of each stop (interpolated for stops without a known position). */
  points: LatLng[];
};

export type DirectRide = {
  bus: Bus;
  stops: string[];
  distanceKm: number;
  durationMin: number;
};

export type TransferRide = {
  first: DirectRide;
  second: DirectRide;
  changeAt: string;
  distanceKm: number;
  durationMin: number;
};

export function canonicalStop(stop: string): string {
  const trimmed = stop.trim();
  return STOP_ALIASES[trimmed] ?? trimmed;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Known positions, with gaps filled evenly between the nearest known neighbours. */
function resolvePoints(stops: string[]): LatLng[] {
  const known = stops.map((s) => STOP_COORDINATES[s]);
  return stops.map((_, i) => {
    const here = known[i];
    if (here) return here;
    let p = i - 1;
    while (p >= 0 && !known[p]) p--;
    let n = i + 1;
    while (n < stops.length && !known[n]) n++;
    const prev = p >= 0 ? known[p] : undefined;
    const next = n < stops.length ? known[n] : undefined;
    if (prev && next) {
      const t = (i - p) / (n - p);
      return [prev[0] + (next[0] - prev[0]) * t, prev[1] + (next[1] - prev[1]) * t];
    }
    return prev ?? next ?? CITY_CENTRE;
  });
}

export const BUSES: Bus[] = RAW_BUSES.map((b) => {
  const stops = b.stops
    .map(canonicalStop)
    .filter((s, i, all) => i === 0 || s !== all[i - 1]);
  const name = b.line ? `${b.operator} · ${b.line}` : b.operator;
  return {
    id: slug(name),
    name,
    operator: b.operator,
    ...(b.line ? { line: b.line } : {}),
    ...(b.nameBn ? { nameBn: b.nameBn } : {}),
    service: b.service,
    endpoints: b.endpoints,
    stops,
    points: resolvePoints(stops),
  };
});

export const ALL_STOPS: string[] = Array.from(new Set(BUSES.flatMap((b) => b.stops))).sort((a, b) =>
  a.localeCompare(b, "en", { numeric: true }),
);

export function findStop(input: string): string | undefined {
  const wanted = canonicalStop(input).toLowerCase();
  return ALL_STOPS.find((s) => s.toLowerCase() === wanted);
}

function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function segmentSpeedKmh(a: LatLng, b: LatLng, aName: string, bName: string): number {
  if (EXPRESSWAY_STOPS.has(aName) || EXPRESSWAY_STOPS.has(bName)) return EXPRESSWAY_KMH;
  const mid: LatLng = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const fromCentre = haversineKm(mid, CITY_CENTRE);
  return SPEED_ZONES.find((z) => fromCentre <= z.withinKm)?.kmh ?? HIGHWAY_KMH;
}

/** Distance (km, 0.1 precision) and normal journey time (min, nearest 5) through points in order. */
export function measurePath(stops: string[], points: LatLng[]): { distanceKm: number; durationMin: number } {
  let km = 0;
  let minutes = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (!a || !b) continue;
    const segKm = haversineKm(a, b) * ROAD_FACTOR;
    km += segKm;
    minutes += (segKm / segmentSpeedKmh(a, b, stops[i - 1] ?? "", stops[i] ?? "")) * 60;
  }
  minutes += Math.max(0, stops.length - 2) * STOP_HALT_MIN;
  return { distanceKm: Math.round(km * 10) / 10, durationMin: roundMinutes(minutes) };
}

/** Approximate road distance through stops that all have a known position. */
export function pathDistanceKm(stops: string[]): number {
  return measurePath(stops, resolvePoints(stops)).distanceKm;
}

function roundMinutes(min: number): number {
  return Math.max(5, Math.round(min / 5) * 5);
}

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

function rideOn(bus: Bus, from: string, to: string): DirectRide | null {
  const i = bus.stops.indexOf(from);
  const j = bus.stops.indexOf(to);
  if (i < 0 || j < 0 || i === j) return null;
  const forward = i < j;
  const stops = forward ? bus.stops.slice(i, j + 1) : bus.stops.slice(j, i + 1).reverse();
  const points = forward ? bus.points.slice(i, j + 1) : bus.points.slice(j, i + 1).reverse();
  return { bus, stops, ...measurePath(stops, points) };
}

/** Every bus that stops at both places, shortest ride first. */
export function findDirectRides(fromInput: string, toInput: string): DirectRide[] {
  const from = canonicalStop(fromInput);
  const to = canonicalStop(toInput);
  return BUSES.map((bus) => rideOn(bus, from, to))
    .filter((r): r is DirectRide => r !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm || a.durationMin - b.durationMin);
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
        const durationMin = first.durationMin + TRANSFER_WAIT_MIN + second.durationMin;
        const key = `${busA.id}>${busB.id}`;
        const existing = best.get(key);
        if (!existing || distanceKm < existing.distanceKm) {
          best.set(key, { first, second, changeAt, distanceKm, durationMin: roundMinutes(durationMin) });
        }
      }
    }
  }

  return [...best.values()].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit);
}
