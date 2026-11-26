import { useEffect, useState } from "react";

/** Seconds left until `endsAt` (epoch ms), ticking once a second. 0 when null or past. */
export function useCountdown(endsAt: number | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (endsAt === null) return;
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0); // refresh immediately for the new deadline
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [endsAt]);

  if (endsAt === null) return 0;
  return Math.max(0, Math.ceil((endsAt - now) / 1000));
}

export function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}
