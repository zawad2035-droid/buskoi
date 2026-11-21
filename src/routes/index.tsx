import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowDownUp, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { StopPicker } from "@/components/buskoi/StopPicker";
import { DirectRideCard, TransferRideCard } from "@/components/buskoi/RideCards";
import { ALL_STOPS, BUSES, findDirectRides, findStop, findTransferRides } from "@/lib/route-finder";

type SearchParams = { from?: string; to?: string };

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
          "Pick where you are and where you're going in Dhaka. BusKoi shows every bus that runs the route, its stops and the approximate distance.",
      },
      { property: "og:title", content: "BusKoi — Find which Dhaka bus goes your way" },
      {
        property: "og:description",
        content: "Search Dhaka bus routes by area: see which operators run it, every stop, and the distance.",
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

  useEffect(() => {
    setFrom(search.from);
    setTo(search.to);
  }, [search.from, search.to]);

  const searched = search.from && search.to ? { from: search.from, to: search.to } : null;

  const results = useMemo(() => {
    if (!searched || searched.from === searched.to) return null;
    const direct = findDirectRides(searched.from, searched.to);
    const transfers = direct.length === 0 ? findTransferRides(searched.from, searched.to) : [];
    return { direct, transfers };
  }, [searched?.from, searched?.to]);

  const canSearch = Boolean(from && to && from !== to);

  const submit = () => {
    if (!from || !to) return;
    navigate({ search: { from, to } });
  };

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
        <div className="hidden gap-4 font-mono text-xs text-muted-foreground sm:flex">
          <span>
            <span className="text-neon-cyan">{BUSES.length}</span> buses
          </span>
          <span>
            <span className="text-neon-lime">{ALL_STOPS.length}</span> stops
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24">
        <section className="pt-8 pb-10 text-center sm:pt-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-neon-lime animate-pulse-dot" /> Dhaka city bus routes
          </p>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Which bus goes
            <br />
            <span className="text-neon">your way?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
            Choose where you're starting and where you're headed. We'll show every bus on that road and how far it is.
          </p>
        </section>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
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
              }}
              className="absolute top-1/2 right-6 z-10 size-10 -translate-y-1/2 rounded-full md:static md:translate-y-0"
            >
              <ArrowDownUp className="md:rotate-90" />
            </Button>
            <div className="flex-1">
              <StopPicker label="To" placeholder="Destination" value={to} onChange={setTo} tone="pink" />
            </div>
          </div>
          <Button type="submit" variant="neon" size="xl" disabled={!canSearch} className="mt-4 w-full">
            <Search /> Find buses
          </Button>
          {from && to && from === to && (
            <p className="mt-3 text-center text-sm text-neon-pink">Pick two different areas.</p>
          )}
        </form>

        {!results && (
          <section className="mx-auto mt-10 max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Try a popular trip</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map(([a, b]) => (
                <Link
                  key={`${a}-${b}`}
                  to="/"
                  search={{ from: a, to: b }}
                  className="panel rounded-full px-4 py-2 text-sm transition-all hover:border-neon-cyan hover:text-neon-cyan"
                >
                  {a} <span className="text-neon-pink">→</span> {b}
                </Link>
              ))}
            </div>
          </section>
        )}

        {results && searched && (
          <section className="mx-auto mt-12 max-w-3xl" aria-live="polite">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Results</p>
                <h2 className="mt-1 font-display text-2xl font-semibold">
                  <span className="text-neon-cyan">{searched.from}</span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="text-neon-pink">{searched.to}</span>
                </h2>
              </div>
              {results.direct.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{results.direct.length}</span>{" "}
                  {results.direct.length === 1 ? "bus goes" : "buses go"} direct
                </p>
              )}
            </div>

            {results.direct.length > 0 ? (
              <div className="space-y-4">
                {results.direct.map((ride, i) => (
                  <DirectRideCard key={ride.bus.id} ride={ride} index={i} fastest={i === 0 && results.direct.length > 1} />
                ))}
              </div>
            ) : results.transfers.length > 0 ? (
              <>
                <div className="panel mb-4 flex items-start gap-3 rounded-2xl p-4 text-sm">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-neon-lime" />
                  <p className="text-muted-foreground">
                    No single bus runs this trip. These options use two buses with one change on the way.
                  </p>
                </div>
                <div className="space-y-4">
                  {results.transfers.map((ride, i) => (
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
          </section>
        )}

        <p className="mx-auto mt-16 max-w-xl text-center text-xs text-muted-foreground">
          Distances are estimated along the stops each bus passes, so real road distance may differ a little.
        </p>
      </main>
    </div>
  );
}
