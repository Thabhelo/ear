"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const columns = [
  {
    title: "Menu",
    links: [
      { label: "Home", href: "/" },
      { label: "Modes", href: "/modes" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Start", href: "/start" },
      { label: "Queue", href: "/queue" },
      { label: "Safety", href: "/safety" },
    ],
  },
  {
    title: "Others",
    links: [
      { label: "Consent", href: "/consent" },
      { label: "Safety Policy", href: "/safety" },
      { label: "Get in line", href: "/start" },
    ],
  },
];

const LandingFooter = () => {
  return (
    <footer
      style={{
        position: "relative",
        background: "#FFFFFF",
        overflow: "hidden",
        paddingTop: 100,
      }}
    >
      {/* Soft warm gradient glow - smooth fade in on scroll */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 90% at 50% 115%, rgba(232,100,42,0.18) 0%, rgba(255,212,180,0.12) 38%, rgba(255,255,255,0) 75%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 60px",
          display: "flex",
          justifyContent: "space-between",
          gap: 60,
          flexWrap: "wrap",
        }}
      >
        {/* Left: logo + description */}
        <div style={{ maxWidth: 420 }}>
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: "-1px",
              color: "#111111",
            }}
          >
            Ear
          </span>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              fontWeight: 300,
              lineHeight: "20px",
              color: "rgba(0,0,0,0.55)",
              marginTop: 28,
              marginBottom: 28,
            }}
          >
            Someone real, whenever you need them. Pick a mode, join the queue,
            and connect with a human who actually picks up. No scheduling, no
            explaining, no waiting.
          </p>
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 13,
              fontWeight: 300,
              color: "rgba(0,0,0,0.40)",
              margin: 0,
            }}
          >
            © 2026 Ear. Not therapy, not crisis counseling, and not a
            substitute for emergency services.
          </p>
        </div>

        {/* Right: link columns */}
        <div style={{ display: "flex", gap: 110, flexWrap: "wrap" }}>
          {columns.map((col) => (
            <div key={col.title} style={{ minWidth: 130 }}>
              <div
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "rgba(0,0,0,0.45)",
                  marginBottom: 28,
                }}
              >
                {col.title}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: 18,
                        fontWeight: 400,
                        color: "#111111",
                        textDecoration: "none",
                        transition: "opacity 0.25s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Giant Ear wordmark - fills width, flush to edges */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: 80,
          width: "100%",
          lineHeight: 0,
          fontSize: 0,
        }}
      >
        <motion.svg
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          viewBox="0 0 1000 230"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          <text
            x="0"
            y="225"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="rgba(0,0,0,0.07)"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 320,
              fontWeight: 300,
            }}
          >
            Ear
          </text>
        </motion.svg>
      </div>
    </footer>
  );
};

export default LandingFooter;
