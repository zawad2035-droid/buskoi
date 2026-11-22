import { INTERCITY_OPERATORS } from "@/data/intercity-operators";
import { BUSES, type Bus } from "@/lib/route-finder";

export type Operator = {
  id: string;
  name: string;
  nameBn?: string;
  /** City operators have routes in BusKoi; long-distance companies are listed by name only. */
  kind: "city" | "intercity";
  routes: Bus[];
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** First letter used for A–Z grouping; names starting with a digit go under "#". */
export function letterOf(name: string): string {
  const c = name.trim().charAt(0).toUpperCase();
  return c >= "A" && c <= "Z" ? c : "#";
}

function buildOperators(): Operator[] {
  const byName = new Map<string, Operator>();
  for (const bus of BUSES) {
    const key = bus.operator.toLowerCase();
    const existing = byName.get(key);
    if (existing) {
      existing.routes.push(bus);
      if (!existing.nameBn && bus.nameBn) existing.nameBn = bus.nameBn;
    } else {
      byName.set(key, {
        id: slug(bus.operator),
        name: bus.operator,
        ...(bus.nameBn ? { nameBn: bus.nameBn } : {}),
        kind: "city",
        routes: [bus],
      });
    }
  }
  for (const name of INTERCITY_OPERATORS) {
    const key = name.toLowerCase();
    if (!byName.has(key)) byName.set(key, { id: slug(name), name, kind: "intercity", routes: [] });
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
}

export const OPERATORS: Operator[] = buildOperators();

export function searchOperators(query: string, letter?: string): Operator[] {
  const q = query.trim().toLowerCase();
  return OPERATORS.filter((op) => {
    if (letter && letterOf(op.name) !== letter) return false;
    if (!q) return true;
    return op.name.toLowerCase().includes(q) || (op.nameBn ?? "").includes(q);
  });
}

export function initialsOf(name: string): string {
  const words = name.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  const first = words[0] ?? "";
  if (words.length === 1) return first.slice(0, 2).toUpperCase();
  return ((first[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}
