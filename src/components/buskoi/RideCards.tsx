import { ArrowRightLeft, Bus as BusIcon, Repeat } from "lucide-react";

import type { DirectRide, TransferRide } from "@/lib/route-finder";
import { RouteStops } from "./RouteStops";

function Distance({ km, tone = "cyan" }: { km: number; tone?: "cyan" | "lime" }) {
  return (
    <div className="text-right">
      <div
        className={
          tone === "cyan"
            ? "font-display text-3xl font-bold text-neon-cyan text-glow-cyan"
            : "font-display text-3xl font-bold text-neon-lime"
        }
      >
        {km.toFixed(1)}
        <span className="ml-1 text-base font-medium text-muted-foreground">km</span>
      </div>
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">approx.</div>
    </div>
  );
}

function BusTitle({ ride }: { ride: DirectRide }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-display text-xl font-semibold">{ride.bus.name}</h3>
        {ride.bus.nameBn && (
          <span className="font-bangla text-lg text-neon-pink">{ride.bus.nameBn}</span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        <ArrowRightLeft className="mr-1.5 inline size-3.5 align-[-2px]" />
        Full route: {ride.bus.endpoints}
      </p>
    </div>
  );
}

export function DirectRideCard({ ride, index, fastest }: { ride: DirectRide; index: number; fastest: boolean }) {
  return (
    <article
      className="panel animate-rise rounded-2xl p-5 transition-all hover:border-neon-cyan sm:p-6"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-neon-cyan">
            <BusIcon className="size-5" />
          </div>
          <BusTitle ride={ride} />
        </div>
        <Distance km={ride.distanceKm} />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-xs">
        {fastest && (
          <span className="rounded-full bg-neon-lime px-2.5 py-1 font-semibold text-primary-foreground">
            SHORTEST
          </span>
        )}
        <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
          {ride.stops.length - 1} stops
        </span>
      </div>
      <div className="mt-5 border-t border-border pt-5">
        <RouteStops stops={ride.stops} />
      </div>
    </article>
  );
}

export function TransferRideCard({ ride, index }: { ride: TransferRide; index: number }) {
  return (
    <article
      className="panel animate-rise rounded-2xl p-5 transition-all hover:border-neon-pink sm:p-6"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-neon-pink">2 buses · 1 change</p>
          <h3 className="mt-1 font-display text-lg font-semibold">
            {ride.first.bus.name} <span className="text-muted-foreground">→</span> {ride.second.bus.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Repeat className="size-3.5" /> Change bus at{" "}
            <span className="font-semibold text-neon-lime">{ride.changeAt}</span>
          </p>
        </div>
        <Distance km={ride.distanceKm} tone="lime" />
      </div>
      <div className="mt-5 grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
        {[ride.first, ride.second].map((leg, i) => (
          <div key={leg.bus.id}>
            <p className="mb-3 font-mono text-xs text-muted-foreground">
              LEG {i + 1} · {leg.bus.name}
              {leg.bus.nameBn ? ` (${leg.bus.nameBn})` : ""} · {leg.distanceKm.toFixed(1)} km
            </p>
            <RouteStops stops={leg.stops} />
          </div>
        ))}
      </div>
    </article>
  );
}
