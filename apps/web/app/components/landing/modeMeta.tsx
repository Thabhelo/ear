import type { CSSProperties, ReactNode } from "react";
import type { ModeId } from "../../lib/catalog";

type ModeStyle = {
  gradient: [string, string];
  fg: string;
  tint: string;
  glyph: ReactNode;
};

const stroke = {
  fill: "none",
  stroke: "#FFFFFF",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const
};

export const MODE_META: Record<ModeId, ModeStyle> = {
  just_listen: {
    gradient: ["#FF9A5C", "#E8642A"],
    fg: "#E8642A",
    tint: "rgba(232,100,42,0.12)",
    glyph: (
      <g {...stroke}>
        <circle cx="7" cy="12" r="1.1" fill="#FFFFFF" stroke="none" />
        <path d="M10.8 8.6a4.8 4.8 0 0 1 0 6.8" />
        <path d="M13.9 6.1a8.3 8.3 0 0 1 0 11.8" opacity="0.85" />
        <path d="M17 3.9a11.5 11.5 0 0 1 0 16.2" opacity="0.55" />
      </g>
    )
  },
  conversation: {
    gradient: ["#7C96FF", "#4F6EF0"],
    fg: "#5B79F0",
    tint: "rgba(110,139,255,0.14)",
    glyph: (
      <g {...stroke}>
        <path d="M4.2 6.6a2.4 2.4 0 0 1 2.4-2.4h6a2.4 2.4 0 0 1 2.4 2.4v3.2a2.4 2.4 0 0 1-2.4 2.4H9l-2.6 2.2v-2.2h-.4a2.4 2.4 0 0 1-2.4-2.4Z" />
        <path d="M17.6 9.6h.2a2.4 2.4 0 0 1 2.4 2.4v3.2a2.4 2.4 0 0 1-2.4 2.4h-.4v2.2l-2.6-2.2h-3.6a2.4 2.4 0 0 1-2.2-1.5" opacity="0.75" />
      </g>
    )
  },
  deep_talk: {
    gradient: ["#FF7E96", "#D6455D"],
    fg: "#D6455D",
    tint: "rgba(214,69,93,0.12)",
    glyph: (
      <g {...stroke}>
        <path d="M12 19.2C7.4 15.6 4.4 13 4.4 9.9 4.4 7.6 6.2 5.9 8.3 5.9c1.5 0 2.9.8 3.7 2 .8-1.2 2.2-2 3.7-2 2.1 0 3.9 1.7 3.9 4 0 3.1-3 5.7-7.6 9.3Z" />
        <path d="M7.6 11.4h2.2l1.1-1.9 1.5 3.4 1.1-1.5h2.3" opacity="0.9" />
      </g>
    )
  },
  silent_company: {
    gradient: ["#9298C9", "#5A5E8C"],
    fg: "#63668C",
    tint: "rgba(99,102,140,0.13)",
    glyph: (
      <g {...stroke}>
        <path d="M19.2 14.2A7.8 7.8 0 1 1 9.8 4.8a6.3 6.3 0 0 0 9.4 9.4Z" />
        <circle cx="16.6" cy="6.4" r="0.9" fill="#FFFFFF" stroke="none" opacity="0.9" />
        <circle cx="19.4" cy="9.6" r="0.6" fill="#FFFFFF" stroke="none" opacity="0.6" />
      </g>
    )
  },
  study_buddy: {
    gradient: ["#3FCF8C", "#1F9D63"],
    fg: "#1F9D63",
    tint: "rgba(31,157,99,0.12)",
    glyph: (
      <g {...stroke}>
        <path d="M12 7.1c-1.5-1.2-3.6-1.8-6.4-1.8v12c2.8 0 4.9.6 6.4 1.8 1.5-1.2 3.6-1.8 6.4-1.8v-12c-2.8 0-4.9.6-6.4 1.8Z" />
        <path d="M12 7.1v12" opacity="0.8" />
        <path d="M8.2 9.3c1 .1 1.9.3 2.6.6M8.2 12.1c1 .1 1.9.3 2.6.6" opacity="0.6" />
      </g>
    )
  },
  game_mode: {
    gradient: ["#C084FC", "#9333EA"],
    fg: "#A055E0",
    tint: "rgba(177,98,232,0.12)",
    glyph: (
      <g {...stroke}>
        <path d="M7.8 7.6h8.4a4.6 4.6 0 0 1 4.5 5.5l-.5 2.6a2.9 2.9 0 0 1-5 1.4l-1-1.1h-4.4l-1 1.1a2.9 2.9 0 0 1-5-1.4l-.5-2.6a4.6 4.6 0 0 1 4.5-5.5Z" />
        <path d="M8.6 10.4v3M7.1 11.9h3" />
        <circle cx="15.4" cy="11" r="0.85" fill="#FFFFFF" stroke="none" />
        <circle cx="17.4" cy="13" r="0.85" fill="#FFFFFF" stroke="none" />
      </g>
    )
  }
};

/** Polished gradient tile with a hand-drawn glyph. */
export function ModeGlyph({
  mode,
  size = 44,
  radius,
  style
}: {
  mode: ModeId;
  size?: number;
  radius?: number;
  style?: CSSProperties;
}) {
  const meta = MODE_META[mode];
  const [c1, c2] = meta.gradient;
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: radius ?? Math.round(size * 0.32),
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 2px rgba(0,0,0,0.12), 0 4px 10px ${c2}40`,
        ...style
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={Math.round(size * 0.58)}
        height={Math.round(size * 0.58)}
        style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))" }}
      >
        {meta.glyph}
      </svg>
    </span>
  );
}
