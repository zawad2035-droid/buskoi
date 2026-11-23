import { motion, useReducedMotion } from "framer-motion";
import { Bus as BusIcon } from "lucide-react";

const EASE = [0.65, 0, 0.35, 1] as const;

/** One-off animation: the teal-to-pink route line draws from start to destination. */
export function JourneyLine() {
  const reduce = useReducedMotion();
  const t = (duration: number, delay = 0) => (reduce ? { duration: 0 } : { duration, delay, ease: EASE });

  return (
    <div className="relative my-5 flex items-center gap-3" aria-hidden>
      <motion.span
        className="size-3 shrink-0 rounded-full bg-neon-cyan glow-cyan"
        initial={reduce ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={t(0.3, 0.1)}
      />
      <div className="relative h-0.5 flex-1">
        <span className="absolute inset-0 rounded-full bg-border" />
        <motion.span
          className="route-line-x absolute inset-0 origin-left rounded-full"
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={t(0.8, 0.2)}
        />
        <motion.span
          className="absolute top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-border bg-card text-neon-lime"
          initial={reduce ? false : { left: "0%", opacity: 0 }}
          animate={{ left: "calc(100% - 1.75rem)", opacity: 1 }}
          transition={t(0.8, 0.2)}
        >
          <BusIcon className="size-3.5" />
        </motion.span>
      </div>
      <motion.span
        className="size-3 shrink-0 rounded-full bg-neon-pink glow-pink"
        initial={reduce ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={t(0.3, 0.9)}
      />
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
