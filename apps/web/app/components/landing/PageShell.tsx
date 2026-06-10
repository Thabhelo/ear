"use client";

import { motion } from "framer-motion";
import { CSSProperties, ReactNode } from "react";
import LandingNav from "./LandingNav";
import LandingFooter from "./LandingFooter";

export const fontHeading = "'Bricolage Grotesque', sans-serif";
export const fontBody = "'Inter Tight', sans-serif";

export function PageShell({
  active,
  children,
  footer = true,
  maxWidth = 1080,
}: {
  active?: string;
  children: ReactNode;
  footer?: boolean;
  maxWidth?: number;
}) {
  return (
    <div
      className="relative min-h-screen"
      style={{ background: "linear-gradient(179deg, #EDF0F5 -43.55%, #FFFFFF 90.05%)" }}
    >
      <LandingNav active={active} />
      <main
        className="r-pad-x"
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth,
          margin: "0 auto",
          padding: "140px 40px 120px",
        }}
      >
        {children}
      </main>
      {footer ? <LandingFooter /> : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  const words = title.split(" ");
  return (
    <div style={{ textAlign: align, marginBottom: 56 }}>
      {eyebrow ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            fontFamily: fontBody,
            fontSize: 14,
            fontWeight: 400,
            color: "rgba(0,0,0,0.55)",
            margin: "0 0 18px",
          }}
        >
          {eyebrow}
        </motion.p>
      ) : null}
      <h1
        className="r-section-h2"
        style={{
          fontFamily: fontHeading,
          fontSize: 56,
          fontWeight: 200,
          lineHeight: 1.05,
          letterSpacing: "-2.2px",
          color: "#111111",
          margin: `0 ${align === "center" ? "auto" : "0"} 18px`,
          maxWidth: 760,
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, filter: "blur(10px)", y: 18 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.55, delay: i * 0.045, ease: "easeOut" }}
            style={{ display: "inline-block", marginRight: "0.22em" }}
          >
            {word}
          </motion.span>
        ))}
      </h1>
      {sub ? (
        <motion.p
          initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: fontBody,
            fontSize: 15,
            fontWeight: 400,
            lineHeight: 1.65,
            color: "rgba(0,0,0,0.5)",
            maxWidth: 460,
            margin: align === "center" ? "0 auto" : 0,
          }}
        >
          {sub}
        </motion.p>
      ) : null}
    </div>
  );
}

/** Selectable pill chip. */
export function Chip({
  label,
  icon,
  selected,
  onClick,
  size = "md",
}: {
  label: string;
  icon?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  size?: "md" | "lg";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: size === "lg" ? 46 : 38,
        padding: size === "lg" ? "0 20px" : "0 16px",
        borderRadius: 9999,
        border: selected ? "1px solid #111111" : "1px solid rgba(0,0,0,0.12)",
        background: selected ? "#111111" : "rgba(255,255,255,0.8)",
        color: selected ? "#FFFFFF" : "rgba(0,0,0,0.75)",
        fontFamily: fontBody,
        fontSize: size === "lg" ? 14 : 13,
        fontWeight: selected ? 500 : 400,
        cursor: "pointer",
        transition: "background 0.22s ease, color 0.22s ease, border-color 0.22s ease, transform 0.22s ease",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = "rgba(0,0,0,0.35)";
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/** Card surface in the landing language. */
export function Surface({
  children,
  style,
  hover,
  onClick,
  selected,
}: {
  children: ReactNode;
  style?: CSSProperties;
  hover?: boolean;
  onClick?: () => void;
  selected?: boolean;
}) {
  const base: CSSProperties = {
    position: "relative",
    borderRadius: 24,
    border: selected ? "1.5px solid #111111" : "1px solid rgba(0,0,0,0.07)",
    background: "rgba(255,255,255,0.85)",
    boxShadow: selected ? "0 20px 50px rgba(15,23,42,0.12)" : "0 12px 32px rgba(15,23,42,0.05)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.2s ease",
    ...(onClick ? { cursor: "pointer", textAlign: "left" as const } : {}),
    ...style,
  };
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      style={base}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 24px 56px rgba(15,23,42,0.12)";
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = selected
            ? "0 20px 50px rgba(15,23,42,0.12)"
            : "0 12px 32px rgba(15,23,42,0.05)";
        }
      }}
    >
      {children}
    </Tag>
  );
}

/** Inline status / error note. */
export function Note({ kind = "info", children }: { kind?: "info" | "error" | "success"; children: ReactNode }) {
  const palette = {
    info: { color: "rgba(0,0,0,0.6)", border: "rgba(0,0,0,0.1)", bg: "rgba(0,0,0,0.03)" },
    error: { color: "#B3402A", border: "rgba(232,100,42,0.4)", bg: "rgba(232,100,42,0.06)" },
    success: { color: "#1F9D63", border: "rgba(52,209,122,0.4)", bg: "rgba(52,209,122,0.07)" },
  }[kind];
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 14,
        border: `1px solid ${palette.border}`,
        background: palette.bg,
        color: palette.color,
        fontFamily: fontBody,
        fontSize: 13,
        lineHeight: 1.5,
        padding: "10px 16px",
      }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: fontBody,
        fontSize: 13,
        fontWeight: 400,
        letterSpacing: "0.4px",
        color: "rgba(0,0,0,0.45)",
        margin: "0 0 14px",
      }}
    >
      {children}
    </p>
  );
}
