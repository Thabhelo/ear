"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type FAQ = { q: string; a: string };

const faqs: FAQ[] = [
  {
    q: "Is this therapy or counseling?",
    a: "No. Ear is human presence, not treatment. It is not therapy, medical advice, crisis counseling, or a substitute for emergency services. If you are in crisis, please contact local emergency services or a crisis line.",
  },
  {
    q: "Are calls really recorded?",
    a: "Yes, every call is recorded for safety, quality assurance, and dispute resolution. You consent before joining, and recordings are stored privately and encrypted. No consent, no call.",
  },
  {
    q: "How does priority bidding work?",
    a: "Your place in the queue is set by your bid plus a waiting-time bonus. Bid more to connect sooner, or wait and let the bonus carry you forward. Subscribers also get standing priority.",
  },
  {
    q: "Can a call run longer than I paid for?",
    a: "Sometimes. If nobody is waiting and energy permits, calls may continue past the purchased time at no extra charge. It is a grace extension, never a guarantee.",
  },
  {
    q: "What gets someone banned?",
    a: "Threats, harassment, sexual misconduct, hate speech, fraud, and doxxing earn a permanent ban with no appeal. Lesser misconduct earns a standard ban, which is eligible for a paid manual review. The review fee buys a review, not reinstatement.",
  },
];

const Pill = ({ index, open }: { index: number; open: boolean }) => (
  <div
    style={{
      display: "inline-flex",
      padding: "6px 12px",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 20,
      border: "1px solid rgba(0,0,0,0.10)",
      background: "#FFFFFF",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      boxShadow:
        "0 12px 28px 0 rgba(15, 23, 42, 0.10), 0 4px 10px 0 rgba(15, 23, 42, 0.06)",
      flexShrink: 0,
    }}
  >
    <span
      style={{
        fontFamily: "'Inter Tight', sans-serif",
        fontSize: 12,
        color: "rgba(0,0,0,0.85)",
        lineHeight: 1,
      }}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
    <span
      aria-hidden
      style={{
        width: 10,
        height: 10,
        position: "relative",
        display: "inline-block",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 1.2,
          background: open ? "#E8642A" : "rgba(0,0,0,0.85)",
          transform: "translateY(-50%)",
          transition: "background 0.3s",
        }}
      />
      <span
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: 1.2,
          background: open ? "#E8642A" : "rgba(0,0,0,0.85)",
          transform: `translateX(-50%) rotate(${open ? "90deg" : "0deg"})`,
          transformOrigin: "center",
          transition: "transform 0.35s ease, background 0.3s",
        }}
      />
    </span>
  </div>
);

const FAQItem = ({ item, index, open, onToggle }: { item: FAQ; index: number; open: boolean; onToggle: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      style={{
        position: "relative",
        borderRadius: 20,
        background: "#F7F8FA",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "rgba(15, 23, 42, 0.06) 4px 16px 36px",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={onToggle}
    >
      {/* Volumetric orange glow — masked by overflow:hidden */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 730,
          height: 480,
          borderRadius: "50%",
          background: "rgb(255, 205, 170)",
          filter: "blur(75px)",
          top: -420,
          left: "39%",
          opacity: open ? 0.85 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "22px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 18,
              fontWeight: 400,
              color: "#111111",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {item.q}
          </h3>
          <Pill index={index} open={open} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateRows: open ? "1fr" : "0fr",
            transition: "grid-template-rows 0.45s ease",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.6,
                color: "rgba(0,0,0,0.65)",
                margin: 0,
                paddingTop: 4,
                maxWidth: 760,
              }}
            >
              {item.a}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Section7 = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const headingLines = ["Got questions?", "We've got answers."];

  return (
    <section
      style={{
        background: "#FFFFFF",
        padding: "120px 0 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "center", padding: "0 40px", marginBottom: 64 }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14,
            color: "rgba(0,0,0,0.55)",
            margin: "0 0 20px",
          }}
        >
          FAQs
        </motion.p>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 72,
            fontWeight: 200,
            lineHeight: 1.05,
            letterSpacing: "-2px",
            color: "#111111",
            maxWidth: 820,
            margin: "0 auto 20px",
          }}
          className="r-s7-h2"
        >
          {headingLines.map((line, li) => (
            <span key={li} style={{ display: "block" }}>
              {line.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 18 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: (li * 3 + i) * 0.055, ease: "easeOut" }}
                  style={{ display: "inline-block", marginRight: "0.2em" }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15,
            color: "rgba(0,0,0,0.5)",
            maxWidth: 460,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          How Ear keeps calls safe, fair, and worth your time.
        </motion.p>
      </div>

      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "0 40px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
        className="r-s7-list"
      >
        {faqs.map((item, i) => (
          <FAQItem
            key={i}
            item={item}
            index={i}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
};

export default Section7;
