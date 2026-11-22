import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/route-finder";
import { initialsOf, letterOf, OPERATORS, searchOperators, type Operator } from "@/lib/operators";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { RouteStops } from "./RouteStops";
import { measureRoute } from "./measure";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LETTERS_WITH_OPERATORS = new Set(OPERATORS.map((o) => letterOf(o.name)));

export function OperatorDirectory({ onPickRoute }: { onPickRoute: () => void }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | undefined>();
  const [open, setOpen] = useState<Operator | null>(null);

  const list = useMemo(() => searchOperators(query, letter), [query, letter]);
  const groups = useMemo(() => {
    const map = new Map<string, Operator[]>();
    for (const op of list) {
      const l = letterOf(op.name);
      map.set(l, [...(map.get(l) ?? []), op]);
    }
    return [...map.entries()];
  }, [list]);

  const cityCount = OPERATORS.filter((o) => o.kind === "city").length;

  return (
    <section id="operators" className="mx-auto mt-24 max-w-5xl scroll-mt-6" aria-labelledby="operators-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon-lime">Bus operators</p>
          <h2 id="operators-title" className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Every operator, <span className="text-neon">A to Z</span>
          </h2>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-neon-cyan">{cityCount}</span> city · {" "}
          <span className="text-neon-pink">{OPERATORS.length - cityCount}</span> long-distance
        </p>
      </div>

      <div className="panel mt-6 rounded-3xl p-4 sm:p-5">
        <label className="relative block">
          <span className="sr-only">Search operators by name</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search operators, e.g. Alif or BRTC"
            className="h-12 w-full rounded-xl border border-border bg-background/60 pr-10 pl-11 text-base text-foreground outline-none transition-all placeholder:text-muted-foreground/70 focus:border-neon-cyan focus:glow-cyan"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </label>

        <nav
          aria-label="Filter by first letter"
          className="-mx-1 mt-4 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible"
        >
          <LetterButton active={!letter} onClick={() => setLetter(undefined)} label="All" />
          {LETTERS.map((l) => (
            <LetterButton
              key={l}
              label={l}
              active={letter === l}
              available={LETTERS_WITH_OPERATORS.has(l)}
              onClick={() => setLetter(letter === l ? undefined : l)}
            />
          ))}
        </nav>

        <div className="mt-5 max-h-[34rem] overflow-y-auto pr-1" aria-live="polite">
          {groups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center">
              <p className="font-display text-lg">No operators found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {letter && !query
                  ? `No operator in BusKoi starts with “${letter}” yet.`
                  : "Try a different name or clear the letter filter."}
              </p>
            </div>
          ) : (
            groups.map(([l, ops]) => (
              <div key={l} className="mb-5 last:mb-0">
                <h3 className="sticky top-0 z-10 mb-2 bg-card/95 py-1 font-display text-sm font-bold text-neon-cyan backdrop-blur">
                  {l}
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {ops.map((op) => (
                    <li key={op.id}>
                      <OperatorTile op={op} onOpen={() => setOpen(op)} />
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        City operators show their routes. Long-distance companies are listed by name only: BusKoi doesn't have their routes yet.
      </p>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="panel max-h-[85vh] max-w-2xl overflow-y-auto rounded-2xl border-border p-5 sm:p-6">
          {open && <OperatorRoutes op={open} onPick={() => { setOpen(null); onPickRoute(); }} />}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function LetterButton({
  label,
  active,
  available = true,
  onClick,
}: {
  label: string;
  active: boolean;
  available?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={available ? undefined : "No operators yet"}
      className={cn(
        "grid h-9 min-w-9 shrink-0 place-items-center rounded-lg border px-2 font-mono text-sm transition-all",
        active
          ? "border-neon-cyan bg-primary text-primary-foreground glow-cyan"
          : available
            ? "border-border text-foreground hover:border-neon-cyan hover:text-neon-cyan"
            : "border-transparent text-muted-foreground/40 hover:text-muted-foreground",
      )}
    >
      {label}
    </button>
  );
}

function Initials({ op }: { op: Operator }) {
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-xl font-display text-xs font-bold",
        op.kind === "city" ? "bg-accent text-neon-cyan" : "bg-secondary text-neon-pink",
      )}
      aria-hidden
    >
      {initialsOf(op.name)}
    </span>
  );
}

function OperatorTile({ op, onOpen }: { op: Operator; onOpen: () => void }) {
  const body = (
    <>
      <Initials op={op} />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{op.name}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {op.kind === "city" ? (
            <>
              {op.nameBn && <span className="font-bangla text-neon-pink">{op.nameBn} · </span>}
              {op.routes.length} {op.routes.length === 1 ? "route" : "routes"}
            </>
          ) : (
            "Long-distance coach · routes not listed"
          )}
        </span>
      </span>
    </>
  );

  if (op.kind === "intercity") {
    return <div className="flex items-center gap-3 rounded-xl border border-border/60 p-3 opacity-80">{body}</div>;
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition-all hover:border-neon-cyan hover:bg-accent/40 active:scale-[0.99]"
    >
      {body}
      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-neon-cyan" />
    </button>
  );
}

function OperatorRoutes({ op, onPick }: { op: Operator; onPick: () => void }) {
  return (
    <>
      <DialogHeader className="text-left">
        <div className="flex items-center gap-3 pr-6">
          <Initials op={op} />
          <div className="min-w-0">
            <DialogTitle className="font-display text-xl">{op.name}</DialogTitle>
            {op.nameBn && <p className="font-bangla text-neon-pink">{op.nameBn}</p>}
          </div>
        </div>
        <DialogDescription>
          {op.routes.length} {op.routes.length === 1 ? "route" : "routes"} in Dhaka. Distances and times are normal estimates.
        </DialogDescription>
      </DialogHeader>
      <ul className="space-y-3">
        {op.routes.map((bus) => {
          const first = bus.stops[0] ?? "";
          const last = bus.stops[bus.stops.length - 1] ?? "";
          const m = measureRoute(bus);
          return (
            <li key={bus.id} className="rounded-xl border border-border bg-background/40 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  {bus.line && <p className="font-mono text-xs uppercase tracking-widest text-neon-lime">{bus.line}</p>}
                  <p className="font-semibold">{bus.endpoints}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {bus.service} · {bus.stops.length} stops · ≈ {m.distanceKm.toFixed(1)} km · ≈{" "}
                    {formatDuration(m.durationMin)} end to end
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <RouteStops stops={bus.stops} />
              </div>
              <Link
                to="/"
                search={{ from: first, to: last }}
                onClick={onPick}
                className={cn(buttonVariants({ variant: "glass", size: "sm" }), "mt-4")}
              >
                Search {first} → {last}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
