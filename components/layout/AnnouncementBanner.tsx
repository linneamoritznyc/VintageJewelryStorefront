"use client";

import { useEffect, useState } from "react";
import type { AnnouncementContent } from "@/lib/content/types";

/**
 * Persistent, dismissible storewide discount banner. Dismissal is remembered in
 * localStorage (keyed by the active code) so it stays hidden until a new
 * campaign changes the code. Content comes from the owner-editable content
 * layer (`lib/content`), so text/code/on-off are editable in Shopify once live.
 * Shares its code with the email popup.
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
    <div className="relative bg-gradient-to-r from-fuchsia-deep via-fuchsia-brand to-fuchsia-hot text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-10 py-2 text-center text-sm font-semibold">
        <span aria-hidden className="animate-sparkle">
          ✦
        </span>
        <span>
          {content.message}{" "}
          <span className="rounded-pill bg-white/25 px-2 py-0.5 font-bold tracking-wide">
            {content.code}
          </span>
        </span>
      </div>
      <button
        type="button"
        aria-label="Stäng meddelande"
        onClick={() => {
          window.localStorage.setItem(DISMISS_KEY, content.code);
          setVisible(false);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
