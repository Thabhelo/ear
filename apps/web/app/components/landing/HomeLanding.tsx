"use client";

import { motion } from "framer-motion";
import { Headphones, MessageCircle, Heart, Moon, BookOpen, Gamepad2, Home, Phone, User, Sun, Layers, LayoutGrid, Folder, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LandingNav from "./LandingNav";
import MagneticButton from "./MagneticButton";
import Section4 from "./Section4";
import Section5 from "./Section5";
import Section6 from "./Section6";
import Section7 from "./Section7";
import LandingFooter from "./LandingFooter";

const useInView = <T extends HTMLElement>(threshold = 0.25) => {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current || inView) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { threshold },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [inView, threshold]);
  return { ref, inView };
};

const TYPING_QUESTIONS = [
  "Can someone just listen tonight?",
  "What does a quick call cost?",
  "Can we study together quietly?",
  "How fast can I get a call?",
];

const TypingPlaceholder = () => {
  const [text, setText] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = TYPING_QUESTIONS[qIndex];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 55);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1500);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), 30);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setQIndex((i) => (i + 1) % TYPING_QUESTIONS.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, qIndex]);

  return (
    <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.55)" }}>
      {text}
      <span
        style={{
          display: "inline-block",
          width: 1,
          height: "1em",
          background: "rgba(0,0,0,0.7)",
          marginLeft: 2,
          verticalAlign: "middle",
          animation: "ear-blink 1s step-end infinite",
        }}
      />
    </span>
  );
};

const titleLines = ["Someone real who", "actually picks up."];

const MODES_MARQUEE = [
  { label: "Just Listen", Icon: Headphones },
  { label: "Conversation", Icon: MessageCircle },
  { label: "Deep Talk", Icon: Heart },
  { label: "Silent Company", Icon: Moon },
  { label: "Study Buddy", Icon: BookOpen },
  { label: "Game Mode", Icon: Gamepad2 },
  { label: "Priority Queue", Icon: Layers },
];

const HomeLanding = () => {
  const router = useRouter();
  const block1 = useInView<HTMLDivElement>(0.2);
  const block2 = useInView<HTMLDivElement>(0.2);
  const block3 = useInView<HTMLDivElement>(0.2);
  const block4 = useInView<HTMLDivElement>(0.2);
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(179deg, #EDF0F5 -43.55%, #FFFFFF 90.05%)" }}
    >
      <LandingNav active="/" />

      {/* Hero section */}
      <section className="relative w-full" style={{ overflow: "hidden" }}>
        {/* Ambient color fields (light analog of the hero stones) */}
        <motion.div
          className="r-hero-stone"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: "-12%",
            top: "-10%",
            height: "70vh",
            width: "44%",
            background: "radial-gradient(closest-side, rgba(232,100,42,0.16), rgba(255,212,180,0.10), transparent)",
            filter: "blur(40px)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <motion.div
          className="r-hero-stone"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          style={{
            position: "absolute",
            right: "-12%",
            top: "-6%",
            height: "70vh",
            width: "44%",
            background: "radial-gradient(closest-side, rgba(110,139,255,0.14), rgba(190,205,255,0.10), transparent)",
            filter: "blur(40px)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.35, ease: "easeOut" }}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "-10%",
            width: "100%",
            maxWidth: 1460,
            height: "44vh",
            background: "radial-gradient(closest-side, rgba(255,179,122,0.18), rgba(244,239,251,0.14), transparent)",
            filter: "blur(48px)",
            transform: "translateX(-50%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Bottom gradient overlay anchored to hero */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "13vh",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.36) 36%, rgba(255,255,255,0.7) 65%, rgba(255,255,255,0.95) 100%)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />

        {/* Hero content */}
        <div
          className="r-hero-padtop relative flex flex-col items-center text-center"
          style={{ zIndex: 10, paddingTop: 130 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="inline-flex items-center"
            style={{
              gap: 8,
              background: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 9999,
              padding: "6px 14px",
              marginBottom: 24,
              boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#E8642A",
                flexShrink: 0,
                animation: "rec-blink 1.4s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "'Inter Tight', sans-serif",
                fontSize: 13,
                fontWeight: 400,
                color: "rgba(0,0,0,0.75)",
              }}
            >
              Someone real is listening
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            style={{
              margin: "0 auto 14px",
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "lowercase",
              color: "rgba(0,0,0,0.38)",
              textAlign: "center"
            }}
          >
            friendship-as-a-service
          </motion.p>

          <h1
            className="r-hero-h1"
            style={{
              width: 705,
              maxWidth: "100%",
              margin: "0 auto 20px",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 72,
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "64px",
              letterSpacing: "-3px",
              color: "#111111",
              textAlign: "center",
            }}
          >
            {titleLines.map((line, lineIdx) => (
              <div key={lineIdx} style={{ display: "block", whiteSpace: "nowrap" }}>
                {line.split(" ").map((word, i) => {
                  const delay = (lineIdx * 4 + i) * 0.055;
                  return (
                    <motion.span
                      key={`${lineIdx}-${i}`}
                      initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
                      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                      transition={{ duration: 0.55, delay, ease: "easeOut" }}
                      style={{ display: "inline-block", marginRight: "0.2em" }}
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </div>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
            className="r-hero-sub"
            style={{
              maxWidth: 420,
              margin: "0 auto 32px",
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.65,
              color: "rgba(0,0,0,0.55)",
              textAlign: "center",
            }}
          >
            Not schedule. Not explain. Not wait. Pick a mode and connect with a real human in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            className="r-hero-buttons flex items-center justify-center"
            style={{ gap: 12, marginBottom: 56 }}
          >
            <MagneticButton
              circleColor="rgba(0,0,0,0.05)"
              circleSize={300}
              className="r-cta-pulse"
              onClick={() => router.push("/modes")}
              style={{
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(0,0,0,0.10)",
                borderRadius: 9999,
                color: "#111111",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                height: 48,
                padding: "0 28px",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              See the modes
            </MagneticButton>

            <MagneticButton
              circleColor="rgba(255,255,255,0.15)"
              circleSize={300}
              className="r-cta-pulse"
              onClick={() => router.push("/start")}
              style={{
                background: "#111111",
                border: "1px solid transparent",
                boxSizing: "border-box",
                borderRadius: 9999,
                color: "#FFFFFF",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                height: 48,
                padding: "0 28px",
                cursor: "pointer",
              }}
            >
              Start a call
            </MagneticButton>
          </motion.div>

          {/* Hero product shot - mock call dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="r-hero-shot"
            style={{
              position: "relative",
              zIndex: 5,
              width: "100%",
              maxWidth: 990,
              margin: "0 auto",
              padding: "0 32px",
            }}
          >
            <div
              style={{
                width: "100%",
                borderRadius: "16px 16px 0 0",
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.08)",
                borderBottom: "none",
                boxShadow: "0 -4px 40px rgba(15,23,42,0.10), 0 24px 80px rgba(15,23,42,0.10)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                overflow: "hidden",
                textAlign: "left",
              }}
            >
              {/* window header */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 18px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF6D6D" }} />
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFCF5F" }} />
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#67D243" }} />
                <span style={{ marginLeft: 12, fontFamily: "'Inter Tight', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.4)" }}>
                  ear · live session
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 11,
                    color: "#E8642A",
                    border: "1px solid rgba(232,100,42,0.4)",
                    padding: "2px 10px",
                    borderRadius: 9999,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8642A", animation: "rec-blink 1.4s ease-in-out infinite" }} />
                  Recording
                </span>
              </div>
              {/* body */}
              <div style={{ display: "flex", minHeight: 320 }}>
                {/* left: queue */}
                <div style={{ width: "38%", borderRight: "1px solid rgba(0,0,0,0.06)", padding: "20px 22px" }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 400, color: "#111", marginBottom: 14 }}>
                    Queue
                  </div>
                  {[
                    { who: "You", mode: "Deep Talk", bid: "$10.00", you: true },
                    { who: "Caller 2", mode: "Just Listen", bid: "$5.00", you: false },
                    { who: "Caller 3", mode: "Game Mode", bid: "$3.00", you: false },
                  ].map((row) => (
                    <div
                      key={row.who}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        borderRadius: 12,
                        marginBottom: 8,
                        background: row.you ? "rgba(232,100,42,0.08)" : "rgba(0,0,0,0.03)",
                        border: row.you ? "1px solid rgba(232,100,42,0.30)" : "1px solid rgba(0,0,0,0.05)",
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "#111" }}>{row.who}</div>
                        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 11, color: "rgba(0,0,0,0.45)" }}>{row.mode}</div>
                      </div>
                      <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 12, color: row.you ? "#E8642A" : "rgba(0,0,0,0.55)", fontWeight: 500 }}>
                        {row.bid}
                      </span>
                    </div>
                  ))}
                </div>
                {/* right: call panel */}
                <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 400, color: "#111" }}>
                      Deep Talk · 25 min
                    </div>
                    <span
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 11,
                        color: "#34D17A",
                        border: "1px solid rgba(52,209,122,0.4)",
                        padding: "2px 10px",
                        borderRadius: 9999,
                      }}
                    >
                      Consent given
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      borderRadius: 16,
                      background: "linear-gradient(150deg, #FDEFE4 0%, #F4EFFB 60%, #E7F0FA 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: 12,
                      padding: 24,
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #E8642A, #FFB37A)",
                        color: "#FFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: 24,
                        fontWeight: 600,
                        boxShadow: "0 16px 40px rgba(232,100,42,0.35)",
                      }}
                    >
                      E
                    </div>
                    <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
                      Connected · 12:47 remaining
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 12, color: "#111", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(0,0,0,0.08)", padding: "6px 14px", borderRadius: 9999 }}>
                        Mute
                      </span>
                      <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 12, color: "#FFF", background: "#E8642A", padding: "6px 14px", borderRadius: 9999 }}>
                        Leave call
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modes marquee */}
      <section
        className="r-trusted"
        style={{
          position: "relative",
          zIndex: 30,
          background: "#FFFFFF",
          padding: "80px 0 64px",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 20,
            fontWeight: 500,
            color: "rgba(0,0,0,0.55)",
            marginBottom: 40,
          }}
        >
          World's first friendship-as-a-service.
        </p>
        <div
          style={{
            overflow: "hidden",
            width: "100%",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, #000 25%, #000 75%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0, #000 25%, #000 75%, transparent 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "max-content",
              animation: "marquee-x 35s linear infinite",
            }}
          >
            {[0, 1].map((dup) => (
              <div
                key={dup}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 80,
                  paddingRight: 80,
                  flexShrink: 0,
                }}
                aria-hidden={dup === 1}
              >
                {MODES_MARQUEE.map(({ label, Icon }) => (
                  <span
                    key={label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 12,
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 26,
                      fontWeight: 400,
                      letterSpacing: "-0.5px",
                      color: "rgba(0,0,0,0.45)",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} color="rgba(0,0,0,0.35)" />
                    {label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 - How Ear works */}
      <section
        className="r-section-pad r-pad-x"
        style={{
          position: "relative",
          zIndex: 30,
          background: "#FFFFFF",
          padding: "120px 0 120px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <p
            className="r-section-eyebrow"
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(0,0,0,0.55)",
              marginBottom: 18,
            }}
          >
            How Ear works
          </p>
          <h2
            className="r-section-h2"
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 64,
              fontWeight: 200,
              lineHeight: "68px",
              letterSpacing: "-2.5px",
              color: "#111111",
              margin: "0 auto 24px",
              maxWidth: 900,
            }}
          >
            Real presence,<br />on your own terms.
          </h2>
          <p
            className="r-section-sub"
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(0,0,0,0.55)",
              maxWidth: 460,
              margin: "0 auto",
            }}
          >
            Pick a mode, choose your time, join the queue. A real human picks up, and everything stays on the platform.
          </p>
        </div>

        <div
          style={{
            maxWidth: 1436,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "580px 832px",
            gap: 24,
            justifyContent: "center",
          }}
          className="r-grid-3"
        >
          {/* Block 1 - Text sessions */}
          <div ref={block1.ref} className="r-card-small">
            <div
              style={{
                opacity: block1.inView ? 1 : 0,
                filter: block1.inView ? "blur(0)" : "blur(12px)",
                transform: block1.inView ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.9s ease-out, filter 0.9s ease-out, transform 0.9s ease-out",
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                width: 580,
                height: 520,
                background: "linear-gradient(155deg, #FDEFE4 0%, #F8ECEF 55%, #F4EFFB 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="r-card-inner-fixed"
                style={{
                  position: "relative",
                  width: 454,
                  borderRadius: 24,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(255,255,255,0.78)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 500, color: "#111" }}>
                      Ear
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 11,
                        color: "#1F9D63",
                        border: "1px solid rgba(52,209,122,0.45)",
                        padding: "2px 8px",
                        borderRadius: 9999,
                      }}
                    >
                      Real human
                    </span>
                  </div>
                  <button
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 12,
                      color: "rgba(0,0,0,0.75)",
                      background: "rgba(0,0,0,0.04)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      padding: "5px 12px",
                      borderRadius: 9999,
                      cursor: "pointer",
                    }}
                  >
                    Text once
                  </button>
                </div>
                <p
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 18,
                    fontWeight: 400,
                    color: "#111111",
                    marginBottom: 14,
                  }}
                >
                  Start a conversation
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#111111",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <MessageCircle size={17} color="#FFFFFF" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "#111" }}>Text session</div>
                      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.5)" }}>
                        A real person on the other end
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 11,
                        color: "#E8642A",
                        border: "1px solid rgba(232,100,42,0.4)",
                        padding: "1px 8px",
                        borderRadius: 9999,
                        marginBottom: 2,
                        display: "inline-block",
                      }}
                    >
                      All day
                    </div>
                    <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.5)" }}>
                      Access
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 13,
                    fontWeight: 400,
                    lineHeight: "17px",
                    letterSpacing: "-0.3px",
                    marginLeft: 48,
                    marginBottom: 16,
                    color: "rgba(0,0,0,0.35)",
                  }}
                >
                  Hey, rough day? No pressure to explain anything. I&apos;m here. Tell me as much or as little as you want.
                </p>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    padding: "12px 16px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: 16,
                    background: "rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 2px 2px 0 rgba(0,0,0,0.04) inset",
                    width: "100%",
                  }}
                >
                  {block1.inView ? (
                    <TypingPlaceholder />
                  ) : (
                    <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.55)" }}>
                      Type your message
                    </span>
                  )}
                  <div
                    style={{
                      display: "inline-flex",
                      padding: "4px 10px",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      borderRadius: 20,
                      border: "1px solid rgba(0,0,0,0.10)",
                      background: "#FFFFFF",
                      boxShadow: "0 8px 20px rgba(15,23,42,0.10)",
                    }}
                  >
                    <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.85)", lineHeight: 1 }}>
                      Send
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 24,
                opacity: block1.inView ? 1 : 0,
                filter: block1.inView ? "blur(0)" : "blur(10px)",
                transition: "opacity 0.9s ease-out 0.3s, filter 0.9s ease-out 0.3s",
              }}
            >
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.55)", marginBottom: 8 }}>
                Text sessions
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 31, fontWeight: 300, color: "#111111", marginBottom: 10 }} className="r-block-h3">
                A real reply, not a bot
              </h3>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: "rgba(0,0,0,0.5)", lineHeight: 1.5, width: 354 }} className="r-text-fixed">
                Text once for a day of access, or subscribe for faster replies. Every message is answered by a human.
              </p>
            </div>
          </div>

          {/* Block 2 - Priority queue dashboard */}
          <div ref={block2.ref} className="r-card-large">
            <div
              style={{
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                width: 832,
                height: 520,
                background: "linear-gradient(140deg, #E7F0FA 0%, #F4EFFB 55%, #FDEFE4 100%)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "8%",
                  top: "12%",
                  right: "-2%",
                  bottom: 0,
                  borderRadius: "24px 0 0 0",
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(255,255,255,0.78)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  display: "flex",
                  overflow: "hidden",
                  clipPath: "inset(0 0 0 0)",
                  opacity: block2.inView ? 1 : 0,
                  transform: block2.inView ? "translateY(0)" : "translateY(40px)",
                  transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
                  boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
                }}
              >
                {/* Sidebar */}
                <div
                  style={{
                    paddingTop: 30,
                    paddingLeft: 24,
                    paddingRight: 20,
                    display: "flex",
                    gap: 20,
                    flexShrink: 0,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                    {[Home, Heart, Phone, GraduationCap, Folder, Layers, User, LayoutGrid, Sun].map((Icon, i) => (
                      <Icon
                        key={i}
                        size={20}
                        color="#111111"
                        style={{
                          opacity: block2.inView ? (i === 0 ? 1 : 0.4) : 0,
                          transform: block2.inView ? "translateX(0)" : "translateX(-12px)",
                          transition: `opacity 0.5s ease-out ${0.5 + i * 0.08}s, transform 0.5s ease-out ${0.5 + i * 0.08}s`,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ position: "relative", width: 1, alignSelf: "stretch", background: "rgba(0,0,0,0.08)" }}>
                    {/* active indicator for home (first icon) */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: -0.5,
                        width: 2,
                        height: 30,
                        background: "#111111",
                        borderRadius: 2,
                        opacity: block2.inView ? 1 : 0,
                        transform: block2.inView ? "translateY(0)" : "translateY(-12px)",
                        transition: "opacity 0.5s ease-out 1.3s, transform 0.5s ease-out 1.3s",
                      }}
                    />
                  </div>
                </div>
                {/* Main */}
                <div style={{ flex: 1, padding: "30px 24px 20px", display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, opacity: block2.inView ? 1 : 0, filter: block2.inView ? "blur(0)" : "blur(8px)", transition: "opacity 0.7s ease-out 0.6s, filter 0.7s ease-out 0.6s" }}>
                    <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: "rgba(0,0,0,0.5)" }}>
                      Queue/ <span style={{ color: "#111" }}>Live</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 12,
                          color: "rgba(0,0,0,0.75)",
                          background: "rgba(0,0,0,0.04)",
                          border: "1px solid rgba(0,0,0,0.08)",
                          padding: "5px 12px",
                          borderRadius: 9999,
                          cursor: "pointer",
                        }}
                      >
                        Raise bid
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, opacity: block2.inView ? 1 : 0, filter: block2.inView ? "blur(0)" : "blur(8px)", transition: "opacity 0.7s ease-out 0.75s, filter 0.7s ease-out 0.75s" }}>
                    <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 400, color: "#111111" }}>
                      You&apos;re #1 in line
                    </h4>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 11,
                        color: "rgba(0,0,0,0.7)",
                        background: "rgba(0,0,0,0.04)",
                        border: "1px solid rgba(0,0,0,0.08)",
                        padding: "3px 4px 3px 10px",
                        borderRadius: 9999,
                      }}
                    >
                      Estimated
                      <span
                        style={{
                          color: "#E8642A",
                          border: "1px solid rgba(232,100,42,0.5)",
                          borderRadius: 9999,
                          padding: "1px 7px",
                          fontSize: 10,
                        }}
                      >
                        ~4 min
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      borderRadius: 20,
                      background: "rgba(0,0,0,0.03)",
                      border: "1px solid rgba(0,0,0,0.05)",
                      padding: "20px 24px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, opacity: block2.inView ? 1 : 0, filter: block2.inView ? "blur(0)" : "blur(8px)", transition: "opacity 0.7s ease-out 0.85s, filter 0.7s ease-out 0.85s" }}>
                      <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, color: "#111111" }}>
                        What people pick
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 12,
                          color: "rgba(0,0,0,0.75)",
                          padding: "4px 8px",
                          borderRadius: 20,
                          border: "1px solid rgba(0,0,0,0.10)",
                          background: "rgba(255,255,255,0.6)",
                        }}
                      >
                        Data <span style={{ color: "rgba(0,0,0,0.5)" }}>Weekly ▾</span>
                      </span>
                    </div>
                    {/* Bars */}
                    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: 10, paddingBottom: 0, overflow: "hidden" }}>
                      {[
                        { label: "Just Listen", value: "40%", delta: "+15%", h: 280, accent: true },
                        { label: "Deep Talk", value: "24%", delta: "+7%", h: 246, accent: false },
                        { label: "Silent Company", value: "16%", delta: "+8%", h: 198, accent: false },
                        { label: "Game Mode", value: "20%", delta: "+3%", h: 230, accent: false },
                      ].map((b, i) => (
                        <div key={b.label} style={{ width: 152, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <div
                            style={{
                              color: "#111111",
                              fontSize: 10,
                              fontWeight: 400,
                              fontFamily: "'Inter Tight', sans-serif",
                              lineHeight: "normal",
                              marginBottom: 4,
                              opacity: block2.inView ? 1 : 0,
                              filter: block2.inView ? "blur(0)" : "blur(6px)",
                              transition: `opacity 0.6s ease-out ${1.0 + i * 0.1}s, filter 0.6s ease-out ${1.0 + i * 0.1}s`,
                            }}
                          >
                            {b.label}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: 6,
                              marginBottom: 6,
                              opacity: block2.inView ? 1 : 0,
                              filter: block2.inView ? "blur(0)" : "blur(6px)",
                              transition: `opacity 0.6s ease-out ${1.05 + i * 0.1}s, filter 0.6s ease-out ${1.05 + i * 0.1}s`,
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                fontSize: 20,
                                fontWeight: 300,
                                color: "#111111",
                                lineHeight: "normal",
                                letterSpacing: "-0.6px",
                              }}
                            >
                              {b.value}
                            </span>
                            <span
                              style={{
                                color: "#111111",
                                fontSize: 10,
                                fontWeight: 300,
                                lineHeight: "normal",
                                opacity: 0.5,
                              }}
                            >
                              {b.delta}
                            </span>
                          </div>
                          <div
                            style={{
                              position: "relative",
                              width: "100%",
                              height: b.h,
                              borderTop: b.accent ? "1px solid rgb(232, 100, 42)" : "1px solid rgba(0,0,0,0.4)",
                              background: "rgba(0,0,0,0.07)",
                              transformOrigin: "bottom",
                              transform: block2.inView ? "scaleY(1)" : "scaleY(0)",
                              transition: `transform 0.9s cubic-bezier(0.22,1,0.36,1) ${0.9 + i * 0.12}s`,
                            }}
                          >
                            {b.accent && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  height: "20%",
                                  background:
                                    "linear-gradient(rgba(232, 100, 42, 0.55) 0%, rgba(255, 119, 46, 0) 100%)",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Fade gradient above the entire dashboard */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "55%",
                  pointerEvents: "none",
                  zIndex: 3,
                  background:
                    "linear-gradient(rgba(255,255,255,0) 20%, rgb(255,255,255) 70%, rgb(252,252,253) 100%)",
                }}
              />
            </div>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "#E8642A", marginBottom: 8 }}>
                Priority queue
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 31, fontWeight: 300, color: "#111111", marginBottom: 10 }} className="r-block-h3">
                Bid to move up the line
              </h3>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: "rgba(0,0,0,0.5)", lineHeight: 1.5, width: 354 }} className="r-text-fixed">
                Your priority is your bid plus a waiting-time bonus, so patient callers never get stuck at the back.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row - Sessions (wide left) + Safety (narrow right) */}
        <div
          style={{
            maxWidth: 1436,
            margin: "32px auto 0",
            display: "grid",
            gridTemplateColumns: "832px 580px",
            gap: 24,
            justifyContent: "center",
          }}
          className="r-grid-3"
        >
          {/* Block 3 - Sessions */}
          <div ref={block3.ref} className="r-card-large">
            <div
              style={{
                opacity: block3.inView ? 1 : 0,
                transform: block3.inView ? "translateY(0)" : "translateY(40px)",
                transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                width: 832,
                height: 520,
                background: "linear-gradient(140deg, #FDEFE4 0%, #F8ECEF 50%, #E7F0FA 100%)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "6%",
                  top: "10%",
                  right: "-2%",
                  bottom: 0,
                  borderRadius: "24px 0 0 0",
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(255,255,255,0.78)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  padding: "28px 28px 0",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
                }}
              >
                <h4
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 28,
                    fontWeight: 300,
                    color: "#111111",
                    marginBottom: 22,
                    position: "relative",
                    zIndex: 1,
                    opacity: block3.inView ? 1 : 0,
                    filter: block3.inView ? "blur(0)" : "blur(8px)",
                    transition: "opacity 0.7s ease-out 0.3s, filter 0.7s ease-out 0.3s",
                  }}
                >
                  Minutes that fit the moment
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 16, flex: 1, position: "relative", zIndex: 1, minHeight: 0 }} className="r-cold-grid">
                  {/* Session picker panel */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      opacity: block3.inView ? 1 : 0,
                      transform: block3.inView ? "translateY(0)" : "translateY(20px)",
                      transition: "opacity 0.7s ease-out 0.45s, transform 0.7s ease-out 0.45s",
                    }}
                  >
                    {/* header pill */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        borderRadius: 16,
                        background: "rgba(0,0,0,0.04)",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 400, color: "#111111" }}>
                        Pick a session
                      </span>
                      <span
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "rgba(0,0,0,0.06)",
                          color: "rgba(0,0,0,0.7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          lineHeight: 1,
                        }}
                      >
                        +
                      </span>
                    </div>
                    {/* Recommendation row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px", marginTop: 4 }}>
                      <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 15, color: "rgba(0,0,0,0.85)" }}>
                        One-off sessions
                      </span>
                      <span
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 12,
                          color: "#E8642A",
                          border: "1px solid rgba(232,100,42,0.6)",
                          padding: "4px 14px",
                          borderRadius: 9999,
                        }}
                      >
                        No plan needed
                      </span>
                    </div>
                    <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "2px 4px 0" }} />
                    {/* Session rows */}
                    {[
                      { name: "Quick Call", when: "3 minutes · $2.99", type: "Call", Icon: Phone, bg: "rgba(0,0,0,0.04)" },
                      { name: "Standard Call", when: "25 minutes · $6.99", type: "Call", Icon: Headphones, bg: "rgba(255,255,255,0.6)" },
                    ].map((m, i) => (
                      <div
                        key={m.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          borderRadius: 16,
                          background: m.bg,
                          border: "1px solid rgba(0,0,0,0.06)",
                          opacity: block3.inView ? 1 : 0,
                          transform: block3.inView ? "translateX(0)" : "translateX(-10px)",
                          transition: `opacity 0.5s ease-out ${0.7 + i * 0.12}s, transform 0.5s ease-out ${0.7 + i * 0.12}s`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #111111, #444444)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <m.Icon size={16} color="#FFFFFF" />
                          </div>
                          <div>
                            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, fontWeight: 400, color: "#111111" }}>{m.name}</div>
                            <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 11, color: "rgba(0,0,0,0.5)" }}>
                              {m.when}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "5px 6px 5px 12px",
                            borderRadius: 9999,
                            border: "1px solid rgba(0,0,0,0.08)",
                            background: "rgba(0,0,0,0.03)",
                            fontFamily: "'Inter Tight', sans-serif",
                            fontSize: 11,
                            color: "rgba(0,0,0,0.6)",
                          }}
                        >
                          Type{" "}
                          <span
                            style={{
                              color: "rgba(0,0,0,0.85)",
                              border: "1px solid rgba(0,0,0,0.10)",
                              borderRadius: 9999,
                              padding: "2px 10px",
                              background: "rgba(255,255,255,0.7)",
                            }}
                          >
                            {m.type} ▾
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Grace extension panel */}
                  <div
                    style={{
                      position: "relative",
                      borderRadius: 24,
                      background: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      padding: "24px 20px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      overflow: "hidden",
                      opacity: block3.inView ? 1 : 0,
                      transform: block3.inView ? "translateY(0)" : "translateY(20px)",
                      transition: "opacity 0.7s ease-out 0.55s, transform 0.7s ease-out 0.55s",
                    }}
                  >
                    {/* warm glow */}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        top: -120,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 260,
                        height: 260,
                        borderRadius: "50%",
                        background: "rgba(255,179,122,0.45)",
                        filter: "blur(60px)",
                        pointerEvents: "none",
                        zIndex: 0,
                      }}
                    />
                    <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: -40 }}>
                      <div
                        className="route-circle"
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background: "rgba(0,0,0,0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Sun size={26} color="#E8642A" style={{ opacity: 0.85 }} />
                      </div>
                      <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, color: "#111111" }}>
                        Grace extension
                      </div>
                      <div
                        style={{
                          fontFamily: "'Inter Tight', sans-serif",
                          fontSize: 12,
                          color: "rgba(0,0,0,0.55)",
                          maxWidth: 200,
                          lineHeight: 1.5,
                        }}
                      >
                        When nobody is waiting, your call can keep going. Free.
                      </div>
                    </div>
                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        width: "70%",
                        height: 5,
                        borderRadius: 9999,
                        background: "rgba(0,0,0,0.08)",
                        overflow: "hidden",
                        marginTop: 20,
                        transform: "translateY(-5px)",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: block3.inView ? "55%" : "0%",
                          background: "linear-gradient(90deg, #C24A1A 0%, #E8642A 60%, #FFB37A 100%)",
                          borderRadius: 9999,
                          transition: "width 1.2s ease-out 1s",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Bottom fade */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "55%",
                  pointerEvents: "none",
                  zIndex: 3,
                  background:
                    "linear-gradient(rgba(255,255,255,0) 20%, rgb(255,255,255) 70%, rgb(252,252,253) 100%)",
                }}
              />
            </div>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "rgba(0,0,0,0.55)", marginBottom: 8 }}>
                Sessions
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 31, fontWeight: 300, color: "#111111", marginBottom: 10 }} className="r-block-h3">
                From 3 minutes to a whole hour
              </h3>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: "rgba(0,0,0,0.5)", lineHeight: 1.5, width: 460 }} className="r-text-fixed">
                Quick Call, Standard, Long Call, or a day of texting. One-off sessions are the easiest way to try Ear, and subscriptions buy you standing access.
              </p>
            </div>
          </div>

          {/* Block 4 - Safety / consent */}
          <div ref={block4.ref} className="r-card-small">
            <div
              style={{
                opacity: block4.inView ? 1 : 0,
                filter: block4.inView ? "blur(0)" : "blur(12px)",
                transform: block4.inView ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 0.9s ease-out, filter 0.9s ease-out, transform 0.9s ease-out",
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                width: 580,
                height: 520,
                background: "linear-gradient(155deg, #E9F6EE 0%, #E7F0FA 55%, #F4EFFB 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="r-card-inner-fixed"
                style={{
                  position: "relative",
                  width: 480,
                  borderRadius: 24,
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "rgba(255,255,255,0.82)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  overflow: "hidden",
                  boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
                }}
              >
                {/* mac header */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 5,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "16px 20px 8px",
                  }}
                >
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF6D6D" }} />
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFCF5F" }} />
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#67D243" }} />
                </div>

                <div style={{ position: "relative", zIndex: 5, padding: "14px 24px 24px" }}>
                  <h5
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 20,
                      fontWeight: 300,
                      color: "#111111",
                      marginBottom: 12,
                    }}
                  >
                    Recording consent
                  </h5>
                  <p
                    style={{
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 16,
                      fontWeight: 300,
                      color: "rgba(0,0,0,0.7)",
                      lineHeight: 1.5,
                      marginBottom: 18,
                    }}
                  >
                    This call is recorded for safety, quality assurance, and dispute resolution. By joining, you consent to being recorded. No consent, no call.
                  </p>

                  {/* Inner detail card */}
                  <div
                    style={{
                      borderRadius: 16,
                      background: "rgba(0,0,0,0.035)",
                      border: "1px solid rgba(0,0,0,0.06)",
                      padding: "18px 20px",
                    }}
                  >
                    {/* Header row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingBottom: 14, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 16, color: "#111", fontWeight: 400 }}>Session</div>
                      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 16, color: "#111", fontWeight: 400 }}>Participants</div>
                    </div>

                    {/* Mode row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "center", paddingTop: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 300, color: "rgba(0,0,0,0.5)" }}>Mode</div>
                        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 300, color: "#111" }}>Deep Talk</div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          opacity: block4.inView ? 1 : 0,
                          transform: block4.inView ? "translateX(0)" : "translateX(-10px)",
                          transition: "opacity 0.5s ease-out 0.5s, transform 0.5s ease-out 0.5s",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #E8642A, #FFB37A)", border: "2px solid #FFF" }} />
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #6E8BFF, #9DB4FF)", border: "2px solid #FFF", marginLeft: -10 }} />
                        </div>
                        <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 300, color: "#111" }}>You + host</span>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#67D243", marginLeft: "auto" }} />
                      </div>
                    </div>

                    {/* Length row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "center", paddingTop: 14 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 300, color: "rgba(0,0,0,0.5)" }}>Length</div>
                        <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, fontWeight: 300, color: "#111" }}>25 min</div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          opacity: block4.inView ? 1 : 0,
                          transform: block4.inView ? "translateX(0)" : "translateX(-10px)",
                          transition: "opacity 0.5s ease-out 0.65s, transform 0.5s ease-out 0.65s",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter Tight', sans-serif",
                            fontSize: 12,
                            color: "#1F9D63",
                            border: "1px solid rgba(52,209,122,0.45)",
                            padding: "3px 12px",
                            borderRadius: 9999,
                          }}
                        >
                          Both consented
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 13, color: "#1F9D63", marginBottom: 8 }}>
                Safety
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 31, fontWeight: 300, color: "#111111", marginBottom: 10 }} className="r-block-h3">
                Consent before every call
              </h3>
              <p style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: "rgba(0,0,0,0.5)", lineHeight: 1.5, width: 354 }} className="r-text-fixed">
                Every call is recorded with consent, both sides can leave anytime, and all contact stays on the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <LandingFooter />
    </div>
  );
};

export default HomeLanding;
