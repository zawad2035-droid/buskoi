import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/** Counts from 0 up to `value` once, then shows it formatted. */
export function CountUp({
  value,
  format,
  duration = 0.9,
  delay = 0.35,
}: {
  value: number;
  format: (n: number) => string;
  duration?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setShown(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setShown,
    });
    return () => controls.stop();
  }, [value, reduce, duration, delay]);

  return <span className="tabular-nums">{format(shown)}</span>;
}
