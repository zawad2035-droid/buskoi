import { describe, expect, it } from "vitest";

import { BUSES, findDirectRides, findStop, findTransferRides } from "@/lib/route-finder";

describe("route finder", () => {
  it("loads every bus operator from the uploaded list", () => {
    expect(BUSES).toHaveLength(25);
  });

  it("lists Safety Druti for Mirpur 10 to Azimpur", () => {
    const names = findDirectRides("Mirpur 10", "Azimpur").map((r) => r.bus.name);
    expect(names).toContain("Safety Druti");
  });

  it("works in the reverse direction too", () => {
    const ride = findDirectRides("Azimpur", "Mirpur 10").find((r) => r.bus.name === "Safety Druti");
    expect(ride?.stops[0]).toBe("Azimpur");
    expect(ride?.stops.at(-1)).toBe("Mirpur 10");
  });

  it("treats Azimpur Etimkhana Moor as Azimpur", () => {
    expect(findDirectRides("Azimpur", "Uttara House Building").map((r) => r.bus.name)).toContain("Suchona BRF");
    expect(findStop("Azimpur Etimkhana Moor")).toBe("Azimpur");
  });

  it("gives a plausible distance for Gulistan to Narayanganj", () => {
    const ride = findDirectRides("Gulistan", "Narayanganj")[0];
    expect(ride?.distanceKm).toBeGreaterThan(12);
    expect(ride?.distanceKm).toBeLessThan(25);
  });

  it("offers a one-change trip when no single bus connects two areas", () => {
    expect(findDirectRides("Mirpur 12", "Narayanganj")).toHaveLength(0);
    expect(findTransferRides("Mirpur 12", "Narayanganj").length).toBeGreaterThan(0);
  });
});
