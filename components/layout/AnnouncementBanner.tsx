"use client";

import { useEffect, useState } from "react";
import type { AnnouncementContent } from "@/lib/content/types";

/**
 * Thin, minimal, centered announcement bar. Dismissal is remembered in
 * localStorage (keyed by the active code) so it stays hidden until a new
 * campaign changes the code. Shares its code with the email popup.
 */
const DISMISS_KEY = "vjs-announcement-dismissed";

export function AnnouncementBanner({
  content,
}: {
  content: AnnouncementContent;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!content.enabled) return;
    const dismissed = window.localStorage.getItem(DISMISS_KEY) === content.code;
    setVisible(!dismissed);
  }, [content.enabled, content.code]);

  if (!content.enabled || !visible) return null;

  return (
    <div className="relative border-b border-line bg-bg-panel text-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-10 py-2.5 text-center text-body italic">
        <span>{content.message}</span>
        <span className="mono not-italic font-medium">{content.code}</span>
      </div>
      <button
        type="button"
        aria-label="Stäng meddelande"
        onClick={() => {
          window.localStorage.setItem(DISMISS_KEY, content.code);
          setVisible(false);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-ink-muted transition hover:text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
