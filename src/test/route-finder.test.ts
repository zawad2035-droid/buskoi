import { describe, expect, it } from "vitest";

import { STOP_COORDINATES } from "@/data/stop-coordinates";
import { INTERCITY_OPERATORS } from "@/data/intercity-operators";
import { OPERATORS, letterOf, searchOperators } from "@/lib/operators";
import {
  BUSES,
  findDirectRides,
  findStop,
  findTransferRides,
  formatDuration,
  measurePath,
} from "@/lib/route-finder";

describe("route data", () => {
  it("loads all 110 routes from the new operator list", () => {
    expect(BUSES).toHaveLength(110);
  });

  it("gives every route a unique id", () => {
    expect(new Set(BUSES.map((b) => b.id)).size).toBe(BUSES.length);
  });

  it("has a map position for every stop", () => {
    const missing = BUSES.flatMap((b) => b.stops).filter((s) => !STOP_COORDINATES[s]);
    expect([...new Set(missing)]).toEqual([]);
  });

  it("no longer lists operators that were removed from the old list", () => {
    expect(BUSES.some((b) => b.operator === "Safety Druti")).toBe(false);
    expect(BUSES.some((b) => b.operator === "Suprovat")).toBe(false);
  });
});

describe("route search", () => {
  it("lists Shikhor Paribahan for Mirpur 10 to Farmgate", () => {
    expect(findDirectRides("Mirpur 10", "Farmgate").map((r) => r.bus.operator)).toContain("Shikhor Paribahan");
  });

  it("works in the reverse direction too", () => {
    const ride = findDirectRides("Farmgate", "Mirpur 10")[0];
    expect(ride?.stops[0]).toBe("Farmgate");
    expect(ride?.stops.at(-1)).toBe("Mirpur 10");
  });

  it("merges spelling variants of the same stop", () => {
    expect(findStop("Aminbazar")).toBe("Amin Bazar");
    expect(findStop("Wireless")).toBe("Wireless Gate");
  });

  it("keeps Taltola in Khilgaon separate from Taltola near Agargaon", () => {
    expect(findStop("Taltola (Khilgaon)")).toBe("Taltola (Khilgaon)");
    expect(findStop("Taltola")).toBe("Taltola");
  });

  it("finds a direct bus for each popular trip on the home page", () => {
    for (const [a, b] of [
      ["Mirpur 10", "Farmgate"],
      ["Uttara", "Shahbag"],
      ["Jatrabari", "Airport"],
      ["Mohammadpur", "Banasree"],
      ["Gulistan", "Savar"],
    ] as const) {
      expect(findDirectRides(a, b).length, `${a} → ${b}`).toBeGreaterThan(0);
    }
  });

  it("offers one-change trips when no single bus connects two areas", () => {
    expect(findDirectRides("Maowa", "Bhulta")).toHaveLength(0);
    expect(findTransferRides("Maowa", "Bhulta").length).toBeGreaterThan(0);
  });
});

describe("travel time estimate", () => {
  it("adds a time to every result", () => {
    const ride = findDirectRides("Mirpur 10", "Farmgate")[0];
    expect(ride?.durationMin).toBeGreaterThanOrEqual(20);
    expect(ride?.durationMin).toBeLessThanOrEqual(60);
  });

  it("is slower per km in the city core than on the highway", () => {
    const core = measurePath(["Gulistan", "Shahbag"], [STOP_COORDINATES["Gulistan"]!, STOP_COORDINATES["Shahbag"]!]);
    const highway = measurePath(["Nobinagar", "Chandra"], [STOP_COORDINATES["Nobinagar"]!, STOP_COORDINATES["Chandra"]!]);
    expect(core.durationMin / core.distanceKm).toBeGreaterThan(highway.durationMin / highway.distanceKm);
  });

  it("includes changing time on one-change trips", () => {
    const t = findTransferRides("Maowa", "Bhulta")[0]!;
    expect(t.durationMin).toBeGreaterThanOrEqual(t.first.durationMin + t.second.durationMin);
  });

  it("formats hours and minutes", () => {
    expect(formatDuration(45)).toBe("45 min");
    expect(formatDuration(60)).toBe("1 hr");
    expect(formatDuration(340)).toBe("5 hr 40 min");
  });
});

describe("operator directory", () => {
  it("is sorted A to Z by company name", () => {
    const names = OPERATORS.map((o) => o.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })));
  });

  it("groups an operator's lines under one company", () => {
    const alif = OPERATORS.find((o) => o.name === "Alif Enterprise");
    expect(alif?.routes).toHaveLength(3);
  });

  it("lists long-distance companies without routes and without duplicates", () => {
    const hanif = OPERATORS.find((o) => o.name === "Hanif Enterprise");
    expect(hanif?.kind).toBe("intercity");
    expect(hanif?.routes).toHaveLength(0);
    expect(new Set(INTERCITY_OPERATORS.map((n) => n.toLowerCase())).size).toBe(INTERCITY_OPERATORS.length);
  });

  it("filters by letter and by name", () => {
    expect(searchOperators("", "B").every((o) => letterOf(o.name) === "B")).toBe(true);
    expect(searchOperators("brtc").map((o) => o.name)).toContain("BRTC");
  });
});

import { serviceBadges } from "@/lib/service-badges";

describe("service badges", () => {
  const labels = (s: string, op = "") => serviceBadges(s, op).map((b) => b.label);
  it("labels DTCA franchise routes, with AC when air-conditioned", () => {
    expect(labels("DTCA Franchise (Non-AC)")).toEqual(["DTCA Franchise"]);
    expect(labels("DTCA Franchise (AC)")).toEqual(["DTCA Franchise", "AC"]);
  });
  it("labels semi-seating and BRTC routes", () => {
    expect(labels("Non-Franchise (Semi-Seating)")).toEqual(["Semi-Seating"]);
    expect(labels("State-Owned (Women-Only)", "BRTC")).toEqual(["BRTC"]);
  });
});
