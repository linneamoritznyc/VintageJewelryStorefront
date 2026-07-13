"use client";

import { useEffect, useState } from "react";

/**
 * Reusable countdown for limited-time sales (homepage, category or product
 * surfaces). Configured with a fixed end time; renders nothing at all once
 * the deadline has passed or before the client has mounted (avoids
 * SSR/client mismatch flicker). Tabular numerals keep the tick smooth.
 */
function remaining(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function Countdown({
  endsAt,
  label,
  className = "",
}: {
  endsAt: string;
  label?: string;
  className?: string;
}) {
  const [time, setTime] = useState<ReturnType<typeof remaining>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(remaining(endsAt));
    const id = window.setInterval(() => setTime(remaining(endsAt)), 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  if (!mounted || !time) return null;

  const units: Array<[number, string]> = [
    [time.days, "dagar"],
    [time.hours, "tim"],
    [time.minutes, "min"],
    [time.seconds, "sek"],
  ];

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}>
      {label && (
        <span className="text-xs uppercase tracking-[0.18em] text-plum-soft">
          {label}
        </span>
      )}
      <div className="flex items-baseline gap-3">
        {units.map(([value, unit]) => (
          <span key={unit} className="flex items-baseline gap-1">
            <span className="font-display text-xl tabular-nums text-ink sm:text-2xl">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[11px] uppercase tracking-wide text-plum-soft">
              {unit}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
