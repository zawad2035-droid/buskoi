import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/** Vertical neon line of stops; the middle collapses when the ride is long. */
export function RouteStops({ stops }: { stops: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = stops.length > 5;
  const hidden = collapsible && !expanded ? stops.length - 2 : 0;
  const shown = hidden > 0 ? [stops[0] ?? "", stops[stops.length - 1] ?? ""] : stops;

  return (
    <div className="relative pl-6">
      <span className="route-line absolute top-2 bottom-2 left-[5px] w-0.5 rounded-full" aria-hidden />
      <ol className="space-y-2">
        {shown.map((stop, i) => {
          const isFirst = i === 0;
          const isLast = i === shown.length - 1;
          return (
            <li key={`${stop}-${i}`} className="relative">
              <span
                className={cn(
                  "absolute top-2.5 -left-6 size-3 -translate-y-1/2 rounded-full border-2 border-background",
                  isFirst ? "bg-neon-cyan glow-cyan" : isLast ? "bg-neon-pink glow-pink" : "bg-muted-foreground",
                )}
                aria-hidden
              />
              <span
                className={cn(
                  "text-sm",
                  isFirst || isLast ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {stop}
              </span>
              {isFirst && hidden > 0 && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="mt-2 flex items-center gap-1 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <ChevronDown className="size-3" /> {hidden} stops in between
                </button>
              )}
            </li>
          );
        })}
      </ol>
      {collapsible && expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-3 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          Hide stops
        </button>
      )}
    </div>
  );
}
