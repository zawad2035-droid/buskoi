import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Full stop-by-stop timeline for one ride: where to board, every stop on the way,
 * and where to get off. `changeAt` marks a transfer stop on two-bus trips.
 */
export function RideTimeline({
  stops,
  startLabel = "Board here",
  endLabel = "Get off here",
}: {
  stops: string[];
  startLabel?: string;
  endLabel?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <ol className="relative pl-7">
      <span className="route-line absolute top-3 bottom-3 left-[7px] w-0.5 rounded-full" aria-hidden />
      {stops.map((stop, i) => {
        const isStart = i === 0;
        const isEnd = i === stops.length - 1;
        const edge = isStart || isEnd;
        return (
          <motion.li
            key={`${stop}-${i}`}
            className={cn("relative", edge ? "py-2" : "py-1")}
            initial={reduce ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.25, delay: Math.min(i * 0.025, 0.5) }}
          >
            <span
              className={cn(
                "absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-card",
                edge ? "-left-7 size-4" : "-left-[25px] size-2.5",
                isStart ? "bg-neon-cyan glow-cyan" : isEnd ? "bg-neon-pink glow-pink" : "bg-muted-foreground/70",
              )}
              aria-hidden
            />
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className={cn(edge ? "font-semibold text-foreground" : "text-sm text-muted-foreground")}>
                {stop}
              </span>
              {edge && (
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-widest",
                    isStart ? "text-neon-cyan" : "text-neon-pink",
                  )}
                >
                  {isStart ? startLabel : endLabel}
                </span>
              )}
            </span>
          </motion.li>
        );
      })}
    </ol>
  );
}
