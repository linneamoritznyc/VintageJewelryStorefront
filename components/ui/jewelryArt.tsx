import type { ReactNode } from "react";

/**
 * Jewelry illustration library. Clean vector art for each product type, drawn
 * on a 0 0 200 200 canvas and centered around (100,100). Used as realistic
 * product imagery for the mock catalog — self-contained, instant-loading and
 * on-brand. When the live Shopify store is connected, real product photos from
 * the Shopify CDN replace these with no component changes.
 *
 * An image URL of the form `mock:<art>:<hue>` selects the art below; the hue
 * tints gemstones/enamel and the card background so pieces vary.
 */

type Metal = "gold" | "silver";

interface Palette {
  base: string;
  light: string;
  dark: string;
  pearl: string;
  pearlHi: string;
  gem: string;
  gemHi: string;
  gemDark: string;
}

function palette(metal: Metal, hue: number): Palette {
  const gold = { base: "#C9A24B", light: "#EBD79B", dark: "#9A7729" };
  const silver = { base: "#B9C0C7", light: "#EBEEF1", dark: "#828C95" };
  const m = metal === "silver" ? silver : gold;
  return {
    ...m,
    pearl: "#FBF6EE",
    pearlHi: "#FFFFFF",
    gem: `hsl(${hue} 65% 62%)`,
    gemHi: `hsl(${hue} 80% 78%)`,
    gemDark: `hsl(${hue} 55% 45%)`,
  };
}

/* --- reusable primitives --- */

function Pearl({ cx, cy, r, p }: { cx: number; cy: number; r: number; p: Palette }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={p.pearl} stroke={p.dark} strokeWidth={0.6} />
      <ellipse cx={cx - r * 0.32} cy={cy - r * 0.32} rx={r * 0.34} ry={r * 0.24} fill={p.pearlHi} opacity={0.9} />
    </g>
  );
}

function Gem({ cx, cy, r, p }: { cx: number; cy: number; r: number; p: Palette }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={p.gem} stroke={p.gemDark} strokeWidth={0.8} />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.3} fill={p.gemHi} opacity={0.85} />
    </g>
  );
}

function metalStroke(p: Palette, w = 6) {
  return { fill: "none", stroke: p.base, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
}

/* --- the art set --- */

const ART: Record<string, (p: Palette) => ReactNode> = {
  "earring-hoop": (p) => (
    <g {...metalStroke(p, 7)}>
      <circle cx={72} cy={104} r={34} />
      <circle cx={128} cy={104} r={34} />
      <circle cx={72} cy={66} r={3} fill={p.base} />
      <circle cx={128} cy={66} r={3} fill={p.base} />
    </g>
  ),
  "earring-drop": (p) => (
    <g>
      {[72, 128].map((x) => (
        <g key={x}>
          <line x1={x} y1={62} x2={x} y2={96} {...metalStroke(p, 3)} />
          <Gem cx={x} cy={60} r={5} p={p} />
          <Pearl cx={x} cy={112} r={16} p={p} />
        </g>
      ))}
    </g>
  ),
  "earring-star": (p) => (
    <g>
      {[72, 128].map((x) => (
        <g key={x} transform={`translate(${x} 100)`}>
          <path d="M0 -26 L7 -8 L26 -8 L11 4 L17 22 L0 11 L-17 22 L-11 4 L-26 -8 L-7 -8 Z" fill={p.base} stroke={p.dark} strokeWidth={1.2} strokeLinejoin="round" />
          <circle cx={0} cy={-4} r={4} fill={p.light} />
        </g>
      ))}
    </g>
  ),
  "earring-flower": (p) => (
    <g>
      {[72, 128].map((x) => (
        <g key={x} transform={`translate(${x} 100)`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-15} rx={8} ry={13} fill={p.gem} stroke={p.gemDark} strokeWidth={0.8} transform={`rotate(${a})`} />
          ))}
          <circle cx={0} cy={0} r={7} fill={p.light} stroke={p.dark} strokeWidth={0.8} />
        </g>
      ))}
    </g>
  ),
  "earring-chandelier": (p) => (
    <g>
      {[72, 128].map((x) => (
        <g key={x}>
          <Gem cx={x} cy={54} r={5} p={p} />
          <line x1={x - 16} y1={74} x2={x + 16} y2={74} {...metalStroke(p, 3)} />
          <line x1={x} y1={58} x2={x} y2={74} {...metalStroke(p, 3)} />
          {[-16, 0, 16].map((dx, i) => (
            <g key={dx}>
              <line x1={x + dx} y1={74} x2={x + dx} y2={90 + i * 4} {...metalStroke(p, 2)} />
              <path d={`M${x + dx} ${92 + i * 4} l6 8 l-6 12 l-6 -12 z`} fill={p.gem} stroke={p.gemDark} strokeWidth={0.8} />
            </g>
          ))}
        </g>
      ))}
    </g>
  ),
  "earring-triangle": (p) => (
    <g>
      {[72, 128].map((x) => (
        <g key={x}>
          <line x1={x} y1={60} x2={x} y2={78} {...metalStroke(p, 3)} />
          <path d={`M${x} 80 l22 40 l-44 0 z`} fill={p.gem} stroke={p.gemDark} strokeWidth={1.2} strokeLinejoin="round" />
        </g>
      ))}
    </g>
  ),
  "earring-moon": (p) => (
    <g>
      {[72, 128].map((x) => (
        <g key={x}>
          <line x1={x} y1={58} x2={x} y2={74} {...metalStroke(p, 3)} />
          <path d={`M${x + 6} 78 a24 24 0 1 0 0 44 a30 30 0 0 1 0 -44 z`} fill={p.base} stroke={p.dark} strokeWidth={1} />
        </g>
      ))}
    </g>
  ),
  "earring-cluster": (p) => (
    <g>
      {[72, 128].map((x) => (
        <g key={x}>
          <line x1={x} y1={60} x2={x} y2={78} {...metalStroke(p, 3)} />
          <Pearl cx={x - 10} cy={94} r={9} p={p} />
          <Pearl cx={x + 10} cy={94} r={9} p={p} />
          <Pearl cx={x} cy={110} r={10} p={p} />
        </g>
      ))}
    </g>
  ),
  "earring-tassel": (p) => (
    <g>
      {[72, 128].map((x) => (
        <g key={x}>
          <Gem cx={x} cy={58} r={5} p={p} />
          <circle cx={x} cy={74} r={6} fill={p.base} />
          {[-9, -4.5, 0, 4.5, 9].map((dx) => (
            <line key={dx} x1={x + dx} y1={80} x2={x + dx} y2={126} {...metalStroke(p, 2.4)} />
          ))}
        </g>
      ))}
    </g>
  ),
  "necklace-pearl": (p) => (
    <g>
      <path d="M40 66 Q100 150 160 66" {...metalStroke(p, 1.5)} />
      {Array.from({ length: 15 }).map((_, i) => {
        const t = i / 14;
        const cx = 40 + t * 120;
        const cy = 66 + Math.sin(Math.PI * t) * 78;
        return <Pearl key={i} cx={cx} cy={cy} r={8} p={p} />;
      })}
    </g>
  ),
  "necklace-chain": (p) => (
    <g>
      <path d="M46 64 Q100 156 154 64" {...metalStroke(p, 5)} />
      <path d="M46 64 Q100 156 154 64" fill="none" stroke={p.light} strokeWidth={1.5} strokeDasharray="2 6" strokeLinecap="round" />
      <circle cx={46} cy={64} r={5} fill={p.base} />
      <circle cx={154} cy={64} r={5} fill={p.base} />
    </g>
  ),
  "necklace-heart": (p) => (
    <g>
      <path d="M52 60 Q100 150 148 60" {...metalStroke(p, 4)} />
      <path d="M100 108 C86 92 66 100 66 118 C66 134 100 152 100 152 C100 152 134 134 134 118 C134 100 114 92 100 108 Z" fill={p.gem} stroke={p.gemDark} strokeWidth={1.5} />
      <ellipse cx={88} cy={116} rx={6} ry={4} fill={p.gemHi} opacity={0.8} transform="rotate(-30 88 116)" />
    </g>
  ),
  "necklace-moonstar": (p) => (
    <g>
      <path d="M52 60 Q100 150 148 60" {...metalStroke(p, 4)} />
      <path d="M96 116 a17 17 0 1 0 0 32 a21 21 0 0 1 0 -32 z" fill={p.base} stroke={p.dark} strokeWidth={1} />
      <path d="M124 108 l4 10 l11 0 l-9 7 l4 11 l-10 -7 l-10 7 l4 -11 l-9 -7 l11 0 z" fill={p.gem} stroke={p.gemDark} strokeWidth={0.8} />
    </g>
  ),
  "necklace-stone": (p) => (
    <g>
      <path d="M52 62 Q100 150 148 62" {...metalStroke(p, 4)} />
      <g transform="translate(100 128)">
        <path d="M0 -20 l14 10 l-6 24 l-16 0 l-6 -24 z" fill={p.gem} stroke={p.gemDark} strokeWidth={1.4} strokeLinejoin="round" />
        <path d="M0 -20 l14 10 l-14 6 l-14 -6 z" fill={p.gemHi} opacity={0.7} />
      </g>
    </g>
  ),
  "necklace-flower": (p) => (
    <g>
      <path d="M52 60 Q100 150 148 60" {...metalStroke(p, 4)} />
      <g transform="translate(100 126)">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse key={a} cx={0} cy={-14} rx={8} ry={12} fill={p.gem} stroke={p.gemDark} strokeWidth={0.8} transform={`rotate(${a})`} />
        ))}
        <circle cx={0} cy={0} r={8} fill={p.light} stroke={p.dark} strokeWidth={0.8} />
      </g>
    </g>
  ),
  "bracelet-pearl": (p) => (
    <g>
      <ellipse cx={100} cy={100} rx={62} ry={46} fill="none" stroke={p.dark} strokeWidth={0.6} opacity={0.4} />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <Pearl key={i} cx={100 + Math.cos(a) * 62} cy={100 + Math.sin(a) * 46} r={9} p={p} />;
      })}
    </g>
  ),
  "bracelet-link": (p) => (
    <g>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const cx = 100 + Math.cos(a) * 60;
        const cy = 100 + Math.sin(a) * 44;
        return (
          <rect key={i} x={cx - 11} y={cy - 8} width={22} height={16} rx={8} fill="none" stroke={p.base} strokeWidth={5} transform={`rotate(${(a * 180) / Math.PI + 90} ${cx} ${cy})`} />
        );
      })}
    </g>
  ),
  "bracelet-bangle": (p) => (
    <g>
      <ellipse cx={100} cy={100} rx={62} ry={46} fill="none" stroke={p.base} strokeWidth={11} />
      <ellipse cx={100} cy={100} rx={62} ry={46} fill="none" stroke={p.light} strokeWidth={3} opacity={0.7} />
    </g>
  ),
  "bracelet-tennis": (p) => (
    <g>
      <ellipse cx={100} cy={100} rx={62} ry={46} fill="none" stroke={p.base} strokeWidth={6} />
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        return <Gem key={i} cx={100 + Math.cos(a) * 62} cy={100 + Math.sin(a) * 46} r={5} p={p} />;
      })}
    </g>
  ),
  "bracelet-charm": (p) => (
    <g>
      <ellipse cx={100} cy={94} rx={60} ry={44} fill="none" stroke={p.base} strokeWidth={7} />
      <Pearl cx={64} cy={132} r={9} p={p} />
      <path d="M100 138 l5 9 l-10 0 z" fill={p.gem} stroke={p.gemDark} strokeWidth={0.8} />
      <circle cx={134} cy={130} r={7} fill={p.gem} stroke={p.gemDark} strokeWidth={0.8} />
    </g>
  ),
  "bracelet-braid": (p) => (
    <g>
      <ellipse cx={100} cy={100} rx={60} ry={44} fill="none" stroke={p.dark} strokeWidth={9} opacity={0.85} />
      <ellipse cx={100} cy={100} rx={60} ry={44} fill="none" stroke={p.base} strokeWidth={9} strokeDasharray="10 10" />
      <ellipse cx={100} cy={100} rx={60} ry={44} fill="none" stroke={p.light} strokeWidth={9} strokeDasharray="10 10" strokeDashoffset={10} opacity={0.7} />
    </g>
  ),
  anklet: (p) => (
    <g>
      <path d="M34 84 Q100 150 166 84" {...metalStroke(p, 3.5)} />
      {Array.from({ length: 9 }).map((_, i) => {
        const t = i / 8;
        const cx = 34 + t * 132;
        const cy = 84 + Math.sin(Math.PI * t) * 60;
        return <Pearl key={i} cx={cx} cy={cy} r={5} p={p} />;
      })}
    </g>
  ),
  "brooch-flower": (p) => (
    <g transform="translate(100 100)">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <ellipse key={a} cx={0} cy={-30} rx={12} ry={22} fill={p.gem} stroke={p.gemDark} strokeWidth={1} transform={`rotate(${a})`} />
      ))}
      <circle cx={0} cy={0} r={16} fill={p.base} stroke={p.dark} strokeWidth={1.2} />
      <circle cx={0} cy={0} r={8} fill={p.light} />
    </g>
  ),
  "brooch-butterfly": (p) => (
    <g transform="translate(100 100)">
      {[-1, 1].map((s) => (
        <g key={s} transform={`scale(${s} 1)`}>
          <path d="M4 0 C34 -34 54 -20 44 4 C40 16 20 18 4 6 Z" fill={p.gem} stroke={p.gemDark} strokeWidth={1.2} />
          <path d="M4 8 C30 8 44 22 38 36 C30 48 12 40 4 20 Z" fill={p.gemHi} stroke={p.gemDark} strokeWidth={1.2} />
        </g>
      ))}
      <rect x={-3} y={-30} width={6} height={64} rx={3} fill={p.base} />
      <circle cx={0} cy={-32} r={4} fill={p.base} />
    </g>
  ),
  "ring-signet": (p) => (
    <g>
      <circle cx={100} cy={112} r={44} fill="none" stroke={p.base} strokeWidth={12} />
      <ellipse cx={100} cy={64} rx={26} ry={20} fill={p.base} stroke={p.dark} strokeWidth={1.5} />
      <ellipse cx={100} cy={64} rx={16} ry={11} fill={p.light} opacity={0.7} />
    </g>
  ),
  "ring-pearl": (p) => (
    <g>
      <circle cx={100} cy={114} r={44} fill="none" stroke={p.base} strokeWidth={12} />
      <Pearl cx={100} cy={62} r={22} p={p} />
    </g>
  ),
  hairclip: (p) => (
    <g transform="rotate(-18 100 100)">
      <rect x={40} y={88} width={120} height={24} rx={12} fill={p.base} stroke={p.dark} strokeWidth={1.2} />
      <Pearl cx={64} cy={100} r={8} p={p} />
      <Pearl cx={90} cy={100} r={8} p={p} />
      <Pearl cx={116} cy={100} r={8} p={p} />
      <Pearl cx={142} cy={100} r={8} p={p} />
    </g>
  ),
  keyring: (p) => (
    <g>
      <circle cx={84} cy={92} r={34} fill="none" stroke={p.base} strokeWidth={8} />
      <line x1={112} y1={112} x2={132} y2={132} {...metalStroke(p, 4)} />
      <Pearl cx={140} cy={140} r={11} p={p} />
      <path d="M122 138 l5 9 l-10 0 z" fill={p.gem} stroke={p.gemDark} strokeWidth={0.8} />
    </g>
  ),
  "glasses-chain": (p) => (
    <g>
      <path d="M44 60 Q100 158 156 60" {...metalStroke(p, 3)} />
      {Array.from({ length: 11 }).map((_, i) => {
        const t = i / 10;
        const cx = 44 + t * 112;
        const cy = 60 + Math.sin(Math.PI * t) * 88;
        return <Gem key={i} cx={cx} cy={cy} r={3.5} p={p} />;
      })}
      <path d="M36 54 a10 10 0 1 0 0.1 0" {...metalStroke(p, 4)} />
      <path d="M164 54 a10 10 0 1 0 -0.1 0" {...metalStroke(p, 4)} />
    </g>
  ),
  giftbox: (p) => (
    <g>
      <rect x={52} y={92} width={96} height={72} rx={6} fill={p.gem} stroke={p.gemDark} strokeWidth={2} />
      <rect x={44} y={74} width={112} height={26} rx={6} fill={p.gemHi} stroke={p.gemDark} strokeWidth={2} />
      <rect x={92} y={74} width={16} height={90} fill={p.base} opacity={0.9} />
      <path d="M100 74 C86 52 60 56 72 72 C80 82 96 78 100 74 Z" fill={p.base} stroke={p.dark} strokeWidth={1} />
      <path d="M100 74 C114 52 140 56 128 72 C120 82 104 78 100 74 Z" fill={p.base} stroke={p.dark} strokeWidth={1} />
    </g>
  ),
};

/** Fallback for any unmapped key. */
function fallback(p: Palette): ReactNode {
  return <Gem cx={100} cy={100} r={40} p={p} />;
}

export function hasJewelryArt(art: string): boolean {
  return art in ART;
}

export function JewelryArt({
  art,
  hue = 320,
  metal = "gold",
}: {
  art: string;
  hue?: number;
  metal?: Metal;
}) {
  const p = palette(metal, hue);
  const draw = ART[art] ?? fallback;
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" role="presentation">
      <g style={{ filter: "drop-shadow(0 3px 4px rgba(42,27,46,0.18))" }}>{draw(p)}</g>
    </svg>
  );
}
