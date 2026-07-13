"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Cookie-consent state (GDPR). Two levels are enough for this store:
 *   "all"        , necessary + analytics/marketing (GA, Meta Pixel may load)
 *   "necessary"  , strictly necessary only (nothing tracking loads)
 *   null         , the visitor has not chosen yet (show the banner)
 *
 * Necessary cookies (cart, consent choice itself) always work and are never
 * gated. Only analytics/marketing scripts read `status === "all"` before
 * loading, see components/marketing/Analytics.tsx.
 *
 * The choice is persisted in localStorage so it survives across sessions,
 * which is the correct behavior for a consent decision (unlike the banner
 * dismissal, this is a durable legal record of the visitor's choice).
 */

export type ConsentStatus = "all" | "necessary";

const STORAGE_KEY = "vjs-cookie-consent";

interface ConsentValue {
  /** null until the visitor has chosen (and until hydration completes). */
  status: ConsentStatus | null;
  /** True once we've read localStorage, so UI doesn't flash on first paint. */
  ready: boolean;
  accept: () => void;
  reject: () => void;
}

const ConsentContext = createContext<ConsentValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "all" || stored === "necessary") setStatus(stored);
    } catch {
      // storage unavailable, treat as undecided
    }
    setReady(true);
  }, []);

  const choose = useCallback((next: ConsentStatus) => {
    setStatus(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // non-fatal
    }
  }, []);

  const value = useMemo<ConsentValue>(
    () => ({
      status,
      ready,
      accept: () => choose("all"),
      reject: () => choose("necessary"),
    }),
    [status, ready, choose],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within a <ConsentProvider>");
  return ctx;
}
