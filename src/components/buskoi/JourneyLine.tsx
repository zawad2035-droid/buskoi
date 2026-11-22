import { Bus as BusIcon } from "lucide-react";

/** Short one-off animation joining the start and destination when results arrive. */
export function JourneyLine() {
  return (
    <div className="relative my-5 flex items-center gap-3" aria-hidden>
      <span className="size-3 shrink-0 rounded-full bg-neon-cyan glow-cyan animate-pin-pop" />
      <div className="relative h-0.5 flex-1 overflow-visible">
        <span className="route-line-x absolute inset-0 origin-left rounded-full animate-draw-line" />
        <span className="absolute top-1/2 left-0 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-neon-lime animate-travel">
          <BusIcon className="size-3.5" />
        </span>
      </div>
      <span className="size-3 shrink-0 rounded-full bg-neon-pink glow-pink animate-pin-pop [animation-delay:450ms]" />
    </div>
  );
}

/** Shown only while a search is still being worked out. */
export function SearchingState() {
  return (
    <div role="status" className="panel mx-auto mt-12 max-w-3xl rounded-2xl p-6 text-center animate-rise">
      <div className="mx-auto flex max-w-sm items-center gap-3" aria-hidden>
        <span className="size-2.5 rounded-full bg-neon-cyan glow-cyan" />
        <span className="dash-flow h-0.5 flex-1 rounded-full" />
        <span className="size-2.5 rounded-full bg-neon-pink glow-pink" />
      </div>
      <p className="mt-4 font-display text-base">Finding the best routes for you…</p>
      <p className="mt-1 text-sm text-muted-foreground">Connecting your journey</p>
    </div>
  );
}
