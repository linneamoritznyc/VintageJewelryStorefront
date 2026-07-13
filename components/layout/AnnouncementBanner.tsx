"use client";

import { useEffect, useState } from "react";
import type { AnnouncementContent } from "@/lib/content/types";

/**
 * Dismissible storewide discount banner. Dismissal is remembered in
 * sessionStorage (keyed by the active code), so closing it hides it for the
 * rest of the browser session but it returns next session, same dismiss
 * semantics as the email popup. Content comes from the owner-editable content
 * layer (`lib/content`), so text/code/on-off are editable in Shopify once
 * live. Shares its code with the email popup.
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
    const dismissed = window.sessionStorage.getItem(DISMISS_KEY) === content.code;
    setVisible(!dismissed);
  }, [content.enabled, content.code]);

  if (!content.enabled || !visible) return null;

  return (
    <div className="relative border-b border-ink/10 bg-sand/70 text-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-10 py-2 text-center text-xs font-medium uppercase tracking-[0.14em]">
        <span>
          {content.message}{" "}
          <span className="ml-1 border-b border-ink pb-px font-semibold">
            {content.code}
          </span>
        </span>
      </div>
      <button
        type="button"
        aria-label="Stäng meddelande"
        onClick={() => {
          window.sessionStorage.setItem(DISMISS_KEY, content.code);
          setVisible(false);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink/50 transition hover:bg-ink/10 hover:text-ink"
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
