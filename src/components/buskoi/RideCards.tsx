import { ArrowRightLeft, Bus as BusIcon, Clock, MapPin, Repeat } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDuration, type DirectRide, type TransferRide } from "@/lib/route-finder";
import { RouteStops } from "./RouteStops";

/** Distance and normal journey time shown side by side. */
export function TripMetrics({
  km,
  min,
  tone = "cyan",
  className,
}: {
  km: number;
  min: number;
  tone?: "cyan" | "lime";
  className?: string;
}) {
  return (
    <dl className={cn("grid grid-cols-2 gap-2 sm:min-w-56", className)}>
      <div className="rounded-xl border border-border bg-background/50 px-3 py-2">
        <dt className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <MapPin className="size-3" /> Distance
        </dt>
        <dd
          className={cn(
            "mt-0.5 font-display text-2xl font-bold",
            tone === "cyan" ? "text-neon-cyan text-glow-cyan" : "text-neon-lime",
          )}
        >
          {km.toFixed(1)}
          <span className="ml-1 text-sm font-medium text-muted-foreground">km</span>
        </dd>
      </div>
      <div className="rounded-xl border border-border bg-background/50 px-3 py-2">
        <dt className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <Clock className="size-3" /> Est. time
        </dt>
        <dd className="mt-0.5 font-display text-2xl font-bold text-neon-pink text-glow-pink">
          <span className="whitespace-nowrap">{formatDuration(min)}</span>
        </dd>
      </div>
    </dl>
  );
}

function BusTitle({ ride }: { ride: DirectRide }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-display text-xl font-semibold">{ride.bus.name}</h3>
        {ride.bus.nameBn && <span className="font-bangla text-lg text-neon-pink">{ride.bus.nameBn}</span>}
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-neon-cyan">
            <BusIcon className="size-5" />
          </div>
          <BusTitle ride={ride} />
        </div>
        <TripMetrics km={ride.distanceKm} min={ride.durationMin} />
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
        <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
          {ride.bus.service}
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
        <TripMetrics km={ride.distanceKm} min={ride.durationMin} tone="lime" />
      </div>
      <div className="mt-5 grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
        {[ride.first, ride.second].map((leg, i) => (
          <div key={leg.bus.id}>
            <p className="mb-3 font-mono text-xs text-muted-foreground">
              LEG {i + 1} · {leg.bus.name}
              {leg.bus.nameBn ? ` (${leg.bus.nameBn})` : ""} · {leg.distanceKm.toFixed(1)} km ·{" "}
              {formatDuration(leg.durationMin)}
            </p>
            <RouteStops stops={leg.stops} />
          </div>
        ))}
      </div>
    </article>
  );
}
