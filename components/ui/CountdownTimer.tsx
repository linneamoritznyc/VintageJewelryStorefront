"use client";

import { useEffect, useState } from "react";

/**
 * Reusable, configurable countdown to a fixed end-time. Usable on homepage,
 * category and product surfaces. Smooth (updates once per second via a single
 * interval, renders fixed-width digit cells so it never reflows/flickers).
 *
 * SSR-safe: renders nothing time-sensitive until mounted, so server and client
 * markup match on first paint.
 */

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function computeRemaining(endMs: number, nowMs: number): Remaining {
  const diff = Math.max(0, endMs - nowMs);
  const done = diff <= 0;
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    done,
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function Cell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="min-w-[2.2ch] rounded-lg bg-ink/90 px-2 py-1.5 text-center font-sans text-lg font-bold tabular-nums text-cream sm:text-xl">
        {value}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-plum-soft">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({
  endsAt,
  className = "",
  compact = false,
  onComplete,
}: {
  /** ISO timestamp of when the sale ends. */
  endsAt: string;
  className?: string;
  /** Compact inline variant (no day cell, tighter). */
  compact?: boolean;
  onComplete?: () => void;
}) {
  const endMs = Date.parse(endsAt);
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    // First tick on mount, then every second.
    const update = () => setRemaining(computeRemaining(endMs, Date.now()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [endMs]);

  useEffect(() => {
    if (remaining?.done) onComplete?.();
  }, [remaining?.done, onComplete]);

  // Pre-hydration / not-yet-mounted placeholder keeps layout stable.
  if (!remaining) {
    return (
      <div
        className={`flex items-center gap-2 ${className}`}
        aria-hidden
        style={{ visibility: "hidden" }}
      >
        <Cell value="00" label="dgr" />
      </div>
    );
  }

  if (remaining.done) {
    return (
      <div className={`text-sm font-semibold text-fuchsia-deep ${className}`}>
        Kampanjen har avslutats
      </div>
    );
  }

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-sans font-bold tabular-nums ${className}`}
        aria-label="Tid kvar av kampanjen"
      >
        {remaining.days > 0 && <span>{remaining.days}d</span>}
        <span>{pad(remaining.hours)}</span>:
        <span>{pad(remaining.minutes)}</span>:
        <span>{pad(remaining.seconds)}</span>
      </span>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 ${className}`}
      role="timer"
      aria-label="Tid kvar av kampanjen"
    >
      {remaining.days > 0 && <Cell value={pad(remaining.days)} label="dgr" />}
      <Cell value={pad(remaining.hours)} label="tim" />
      <Cell value={pad(remaining.minutes)} label="min" />
      <Cell value={pad(remaining.seconds)} label="sek" />
    </div>
  );
}
