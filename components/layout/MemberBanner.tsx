"use client";

import { useEffect, useState } from "react";
import type { AnnouncementContent } from "@/lib/content/types";
import { STOREWIDE_DISCOUNT_PERCENTAGE } from "@/lib/config/coupons";

/**
 * Dismissible, persistent member-offer strip: the storewide 10% (same code as
 * the popup, via the content layer). Paper ground, hairline rule, mono label.
 * Dismissal is remembered per-code in sessionStorage, so closing it hides it
 * for the session and it returns next session. This is the "banner" half of
 * the brief's banner + popup discount pair.
 */
const DISMISS_KEY = "vjs-member-dismissed";

export function MemberBanner({ content }: { content: AnnouncementContent }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!content.enabled) return;
    setVisible(
      window.sessionStorage.getItem(DISMISS_KEY) !== content.code,
    );
  }, [content.enabled, content.code]);

  if (!content.enabled || !visible) return null;

  return (
    <div className="relative border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-2 px-10 py-2 text-center">
        <span className="meta text-ink">
          Bli medlem · {STOREWIDE_DISCOUNT_PERCENTAGE}% rabatt
        </span>
        <span className="meta font-medium text-ink">
          {content.code}
        </span>
      </div>
      <button
        type="button"
        aria-label="Stäng meddelande"
        onClick={() => {
          window.sessionStorage.setItem(DISMISS_KEY, content.code);
          setVisible(false);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-ink/50 transition hover:text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
