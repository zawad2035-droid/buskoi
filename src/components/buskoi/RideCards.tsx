import { useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRightLeft, Bus as BusIcon, ChevronDown, Clock, MapPin, Repeat } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDuration, type DirectRide, type TransferRide } from "@/lib/route-finder";
import { serviceBadges } from "@/lib/service-badges";
import { CountUp } from "./CountUp";
import { RideTimeline } from "./RideTimeline";

/** Distance and normal journey time shown side by side; `countUp` animates the numbers in. */
export function TripMetrics({
  km,
  min,
  tone = "cyan",
  countUp = false,
  className,
}: {
  km: number;
  min: number;
  tone?: "cyan" | "lime";
  countUp?: boolean;
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
          {countUp ? <CountUp value={km} format={(n) => n.toFixed(1)} /> : km.toFixed(1)}
          <span className="ml-1 text-sm font-medium text-muted-foreground">km</span>
        </dd>
      </div>
      <div className="rounded-xl border border-border bg-background/50 px-3 py-2">
        <dt className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <Clock className="size-3" /> Est. time
        </dt>
        <dd className="mt-0.5 font-display text-2xl font-bold text-neon-pink text-glow-pink">
          <span className="whitespace-nowrap">
            {countUp ? <CountUp value={min} format={(n) => formatDuration(Math.round(n))} /> : formatDuration(min)}
          </span>
        </dd>
      </div>
    </dl>
  );
}

const BADGE_TONE = {
  cyan: "border-neon-cyan/50 text-neon-cyan",
  pink: "border-neon-pink/50 text-neon-pink",
  lime: "border-neon-lime/50 text-neon-lime",
  muted: "border-border text-muted-foreground",
} as const;

export function ServiceBadges({ service, operator }: { service: string; operator: string }) {
  return (
    <>
      {serviceBadges(service, operator).map((b) => (
        <span
          key={b.label}
          title={service}
          className={cn("rounded-full border px-2.5 py-1 font-mono text-xs", BADGE_TONE[b.tone])}
        >
          {b.label}
        </span>
      ))}
    </>
  );
}

/** Card whose header toggles a smoothly expanding body. */
function ExpandableCard({
  index,
  hoverTone,
  header,
  meta,
  children,
}: {
  index: number;
  hoverTone: "cyan" | "pink";
  header: ReactNode;
  meta: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const toggle = () => setOpen((o) => !o);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <motion.article
      layout={reduce ? false : "position"}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: reduce ? 0 : 0.15 + index * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn(
        "panel rounded-2xl transition-colors",
        hoverTone === "cyan" ? "hover:border-neon-cyan" : "hover:border-neon-pink",
        open && (hoverTone === "cyan" ? "border-neon-cyan/60" : "border-neon-pink/60"),
      )}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={onKey}
        className="cursor-pointer rounded-2xl p-5 outline-none focus-visible:glow-cyan sm:p-6"
      >
        {header}
        <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-xs">
          {meta}
          <span className="ml-auto inline-flex items-center gap-1 text-muted-foreground">
            {open ? "Hide stops" : "Show stops"}
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduce ? 0 : 0.25 }}>
              <ChevronDown className="size-3.5" />
            </motion.span>
          </span>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="mx-5 border-t border-border pt-5 pb-5 sm:mx-6 sm:pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export function DirectRideCard({ ride, index, fastest }: { ride: DirectRide; index: number; fastest: boolean }) {
  return (
    <ExpandableCard
      index={index}
      hoverTone="cyan"
      header={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-neon-cyan">
              <BusIcon className="size-5" />
            </div>
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
          </div>
          <TripMetrics km={ride.distanceKm} min={ride.durationMin} />
        </div>
      }
      meta={
        <>
          {fastest && (
            <span className="rounded-full bg-neon-lime px-2.5 py-1 font-semibold text-primary-foreground">
              SHORTEST
            </span>
          )}
          <ServiceBadges service={ride.bus.service} operator={ride.bus.operator} />
          <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">
            {ride.stops.length - 1} stops
          </span>
        </>
      }
    >
      <RideTimeline stops={ride.stops} />
    </ExpandableCard>
  );
}

export function TransferRideCard({ ride, index }: { ride: TransferRide; index: number }) {
  return (
    <ExpandableCard
      index={index}
      hoverTone="pink"
      header={
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
      }
      meta={
        <>
          <ServiceBadges service={ride.first.bus.service} operator={ride.first.bus.operator} />
          <span className="text-muted-foreground">+</span>
          <ServiceBadges service={ride.second.bus.service} operator={ride.second.bus.operator} />
        </>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {[ride.first, ride.second].map((leg, i) => (
          <div key={leg.bus.id}>
            <p className="mb-3 font-mono text-xs text-muted-foreground">
              LEG {i + 1} · {leg.bus.name}
              {leg.bus.nameBn ? ` (${leg.bus.nameBn})` : ""} · {leg.distanceKm.toFixed(1)} km ·{" "}
              {formatDuration(leg.durationMin)}
            </p>
            <RideTimeline
              stops={leg.stops}
              startLabel={i === 0 ? "Board here" : "Change here"}
              endLabel={i === 0 ? "Change here" : "Get off here"}
            />
          </div>
        ))}
      </div>
    </ExpandableCard>
  );
}
