"use client";

import { useEffect, useState } from "react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/config/shipping";

/**
 * Top announcement bar in the inventory voice: ink ground, paper mono text.
 * It states real facts only (no discount, no manufactured urgency) and rotates
 * slowly between them. The 10% member offer lives in the dismissible member
 * banner and the popup instead, keeping the two surfaces distinct.
 */
const FACTS = [
  "Aldrig burna. Aldrig sålda.",
  `Fri frakt över ${FREE_SHIPPING_THRESHOLD} kr`,
  "14 dagars ångerrätt",
  "Ett exemplar av varje",
];

const ROTATE_MS = 4000;

export function AnnouncementBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % FACTS.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="bg-ink text-paper">
      <div className="mx-auto flex max-w-[1280px] items-center justify-center px-4 py-2 text-center">
        <span
          key={index}
          className="meta animate-fade-in text-paper/90"
          aria-live="polite"
        >
          {FACTS[index]}
        </span>
      </div>
    </div>
  );
}
