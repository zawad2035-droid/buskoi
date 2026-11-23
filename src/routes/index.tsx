import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowDownUp, Loader2, RotateCcw, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { StopPicker } from "@/components/buskoi/StopPicker";
import { DirectRideCard, TransferRideCard, TripMetrics } from "@/components/buskoi/RideCards";
import { JourneyLine, SearchingState } from "@/components/buskoi/JourneyLine";
import { OperatorDirectory } from "@/components/buskoi/OperatorDirectory";
import {
  ALL_STOPS,
  BUSES,
  findDirectRides,
  findStop,
  findTransferRides,
  type DirectRide,
  type TransferRide,
} from "@/lib/route-finder";
import { OPERATORS } from "@/lib/operators";

type SearchParams = { from?: string; to?: string };

type Outcome = { ok: true; direct: DirectRide[]; transfers: TransferRide[] } | { ok: false };

/** Show the searching panel only if work takes longer than this; quick searches just transition. */
const LOADER_DELAY_MS = 150;

const SUGGESTIONS: Array<[string, string]> = [
  ["Mirpur 10", "Farmgate"],
  ["Uttara", "Shahbag"],
  ["Jatrabari", "Airport"],
  ["Mohammadpur", "Banasree"],
  ["Gulistan", "Savar"],
];

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): SearchParams => {
    const out: SearchParams = {};
    const from = typeof s["from"] === "string" ? findStop(s["from"]) : undefined;
    const to = typeof s["to"] === "string" ? findStop(s["to"]) : undefined;
    if (from) out.from = from;
    if (to) out.to = to;
    return out;
  },
  head: () => ({
    meta: [
      { title: "BusKoi — Find which Dhaka bus goes your way" },
      {
        name: "description",
        content:
          "Pick where you are and where you're going in Dhaka. BusKoi shows every bus that runs the route, its stops, the approximate distance and a normal journey time.",
      },
      { property: "og:title", content: "BusKoi — Find which Dhaka bus goes your way" },
      {
        property: "og:description",
        content: "Search Dhaka bus routes by area and browse every bus operator from A to Z.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const [from, setFrom] = useState<string | undefined>(search.from);
  const [to, setTo] = useState<string | undefined>(search.to);
  const [attempt, setAttempt] = useState(0);
  const [searching, setSearching] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [startFailed, setStartFailed] = useState(false);
  const scrollOnResult = useRef(false);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setFrom(search.from);
    setTo(search.to);
  }, [search.from, search.to]);

  const searched = search.from && search.to ? { from: search.from, to: search.to } : null;
  const resultKey = searched ? `${searched.from}|${searched.to}|${attempt}` : "";

  const outcome = useMemo<Outcome | null>(() => {
    if (!searched || searched.from === searched.to) return null;
    try {
      const direct = findDirectRides(searched.from, searched.to);
      const transfers = direct.length === 0 ? findTransferRides(searched.from, searched.to) : [];
      return { ok: true, direct, transfers };
    } catch (err) {
      console.error("Route search failed", err);
      return { ok: false };
    }
  }, [searched?.from, searched?.to, attempt]);

  // Results for the requested trip are ready: stop the searching state and bring them into view.
  useEffect(() => {
    setSearching(false);
    setShowLoader(false);
    if (scrollOnResult.current && resultsRef.current) {
      scrollOnResult.current = false;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      resultsRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [resultKey]);

  useEffect(() => {
    if (!searching) return;
    const t = window.setTimeout(() => setShowLoader(true), LOADER_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [searching]);

  const canSearch = Boolean(from && to && from !== to);

  const submit = () => {
    if (!from || !to || from === to || searching) return;
    setStartFailed(false);
    scrollOnResult.current = true;
    if (from === search.from && to === search.to) {
      setAttempt((a) => a + 1);
      return;
    }
    setSearching(true);
    navigate({ search: { from, to } }).catch((err: unknown) => {
      console.error("Could not start search", err);
      setSearching(false);
      setStartFailed(true);
    });
  };

  const reduceMotion = useReducedMotion();
  const [swapTurns, setSwapTurns] = useState(0);
  const best = outcome?.ok ? (outcome.direct[0] ?? outcome.transfers[0]) : undefined;

  return (
    <div className="bg-grid min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <Link to="/" search={{}} className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground glow-cyan">
            BK
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Bus<span className="text-neon-pink text-glow-pink">Koi</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
          <span className="hidden sm:inline">
            <span className="text-neon-cyan">{BUSES.length}</span> routes
          </span>
          <span className="hidden sm:inline">
            <span className="text-neon-lime">{ALL_STOPS.length}</span> stops
          </span>
          <a
            href="#operators"
            className="rounded-full border border-border px-3 py-1.5 transition-colors hover:border-neon-pink hover:text-neon-pink"
          >
            {OPERATORS.length} operators
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24">
        <section className="hero-dots pt-8 pb-10 text-center sm:pt-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-neon-lime animate-pulse-dot" /> Dhaka city bus routes
          </p>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Which bus goes
            <br />
            <span className="text-neon">your way?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
            Choose where you're starting and where you're headed. We'll show every bus on that road, how far it is and
            roughly how long it takes.
          </p>
        </section>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          aria-busy={searching}
          className="panel glow-soft mx-auto max-w-3xl rounded-3xl p-4 sm:p-5"
        >
          <div className="relative flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <StopPicker label="From" placeholder="Starting area" value={from} onChange={setFrom} tone="cyan" />
            </div>
            <Button
              type="button"
              variant="glass"
              size="icon"
              aria-label="Swap from and to"
              onClick={() => {
                setFrom(to);
                setTo(from);
                setSwapTurns((n) => n + 1);
              }}
              className="absolute top-1/2 right-6 z-10 size-10 -translate-y-1/2 rounded-full focus-visible:glow-cyan md:static md:translate-y-0"
            >
              <motion.span
                className="grid place-items-center"
                animate={{ rotate: swapTurns * 180 }}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20 }}
              >
                <ArrowDownUp className="md:rotate-90" />
              </motion.span>
            </Button>
            <div className="flex-1">
              <StopPicker label="To" placeholder="Destination" value={to} onChange={setTo} tone="pink" />
            </div>
          </div>
          <Button
            type="submit"
            variant="neon"
            size="xl"
            disabled={!canSearch || searching}
            className="mt-4 w-full"
          >
            {searching ? <Loader2 className="animate-spin" /> : <Search />}
            {searching ? "Searching bus routes…" : "Find buses"}
          </Button>
          {from && to && from === to && (
            <p className="mt-3 text-center text-sm text-neon-pink">Pick two different areas.</p>
          )}
        </form>

        {searching && showLoader && <SearchingState />}

        {startFailed && !searching && <SearchError onRetry={submit} />}

        {!outcome && !searching && !startFailed && (
          <section className="mx-auto mt-10 max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Try a popular trip</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map(([a, b]) => (
                <Link
                  key={`${a}-${b}`}
                  to="/"
                  search={{ from: a, to: b }}
                  onClick={() => {
                    scrollOnResult.current = true;
                  }}
                  className="panel rounded-full px-4 py-2 text-sm transition-all hover:border-neon-cyan hover:text-neon-cyan active:scale-95"
                >
                  {a} <span className="text-neon-pink">→</span> {b}
                </Link>
              ))}
            </div>
          </section>
        )}

        {outcome && searched && !searching && (
          <section
            key={resultKey}
            ref={resultsRef}
            className="mx-auto mt-12 max-w-3xl scroll-mt-6"
            aria-live="polite"
          >
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="panel glow-soft mb-6 rounded-3xl p-5 sm:p-6"
            >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Your trip</p>
                <h2 className="mt-1 font-display text-2xl font-semibold">
                  <span className="text-neon-cyan">{searched.from}</span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="text-neon-pink">{searched.to}</span>
                </h2>
              </div>
              {outcome.ok && outcome.direct.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{outcome.direct.length}</span>{" "}
                  {outcome.direct.length === 1 ? "bus goes" : "buses go"} direct
                </p>
              )}
            </div>

            <JourneyLine />

                {outcome.ok && best && (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-widest text-neon-lime">
                        {outcome.direct.length > 0 ? "Shortest direct bus" : "Shortest with one change"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Normal estimate without live traffic. Actual time varies with traffic, road conditions, stops,
                        weather and delays.
                      </p>
                    </div>
                    <TripMetrics km={best.distanceKm} min={best.durationMin} countUp className="shrink-0" />
                  </div>
                )}
            </motion.div>

            {!outcome.ok ? (
              <SearchError onRetry={() => setAttempt((a) => a + 1)} />
            ) : (
              <>

                {outcome.direct.length > 0 ? (
                  <div className="space-y-4">
                    {outcome.direct.map((ride, i) => (
                      <DirectRideCard
                        key={ride.bus.id}
                        ride={ride}
                        index={i}
                        fastest={i === 0 && outcome.direct.length > 1}
                      />
                    ))}
                  </div>
                ) : outcome.transfers.length > 0 ? (
                  <>
                    <div className="panel mb-4 flex items-start gap-3 rounded-2xl p-4 text-sm">
                      <Sparkles className="mt-0.5 size-4 shrink-0 text-neon-lime" />
                      <p className="text-muted-foreground">
                        No single bus runs this trip. These options use two buses with one change on the way (time
                        includes about 8 min to change).
                      </p>
                    </div>
                    <div className="space-y-4">
                      {outcome.transfers.map((ride, i) => (
                        <TransferRideCard key={`${ride.first.bus.id}-${ride.second.bus.id}`} ride={ride} index={i} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="panel rounded-2xl p-8 text-center">
                    <p className="font-display text-lg">No bus found for this trip</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      None of the listed buses connect these areas, even with one change. Try a nearby stop.
                    </p>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        <OperatorDirectory
          onPickRoute={() => {
            scrollOnResult.current = true;
          }}
        />

        <p className="mx-auto mt-16 max-w-xl text-center text-xs text-muted-foreground">
          Distances are estimated along the stops each bus passes. Travel times are normal estimates for typical Dhaka
          traffic, not live data, so your actual journey may be shorter or longer.
        </p>
      </main>
    </div>
  );
}

function SearchError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="panel mx-auto mt-6 max-w-3xl rounded-2xl p-6 text-center animate-rise">
      <AlertTriangle className="mx-auto size-6 text-neon-pink" />
      <p className="mt-3 font-display text-lg">Something went wrong with this search</p>
      <p className="mt-1 text-sm text-muted-foreground">Your trip is still selected. Try again.</p>
      <Button type="button" variant="glass" onClick={onRetry} className="mt-4">
        <RotateCcw /> Retry
      </Button>
    </div>
  );
}
