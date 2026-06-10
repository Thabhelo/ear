"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ASSETS = "https://qclay.design/lovable/reticla/section-5";

const DOT_COUNT = 46;

const useWave = (speed: number, phase = 0) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    let id: number;
    const start = performance.now();
    const loop = (now: number) => {
      setT((now - start) / 1000);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);
  const center = (DOT_COUNT - 1) / 2;
  return Array.from({ length: DOT_COUNT }, (_, i) => {
    const d = Math.abs(i - center);
    const v = Math.sin(t * speed - d * 0.45 + phase);
    return Math.max(0, v);
  });
};

const EqualizerRow = ({ values }: { values: number[] }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 2.5 }}>
    {values.map((v, i) => {
      // Lerp light grey dots toward orange based on intensity
      const r = Math.round(200 + (232 - 200) * v);
      const g = Math.round(200 + (100 - 200) * v);
      const b = Math.round(200 + (42 - 200) * v);
      const a = 0.35 + 0.65 * v;
      return (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            flexShrink: 0,
            background: `rgba(${r}, ${g}, ${b}, ${a})`,
          }}
        />
      );
    })}
  </div>
);

const CheckIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    style={{ marginTop: 1, flexShrink: 0 }}
    aria-hidden
  >
    <circle cx="8" cy="8" r="7.5" stroke="rgba(0,0,0,0.25)" />
    <path d="M4.8 8.2l2.1 2.1 4.3-4.6" stroke="#E8642A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HEADING = "Connect your moment with a real human presence.";
const TABS = ["Just Listen", "Deep Talk", "Study Buddy", "Game Mode"];
const CHECKLIST = [
  "Pick the mode that fits your moment, from venting to silence",
  "Consent to recording once, then just be yourself on the call",
  "Calls can run past your time when nobody is waiting, free",
];

const Section5 = () => {
  const router = useRouter();
  const row1 = useWave(6, 0);
  const row2 = useWave(5, 1.2);

  return (
    <section
      style={{
        background: "#FFFFFF",
        padding: "80px 0 80px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <div className="r-pad-x" style={{ textAlign: "center", marginBottom: 64 }}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: "block",
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 13,
            fontWeight: 400,
            color: "rgba(0,0,0,0.40)",
            letterSpacing: "0.5px",
            marginBottom: 14,
          }}
        >
          How it flows
        </motion.span>

        <h2
          className="r-s5-h2"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 66,
            fontWeight: 300,
            lineHeight: 1.06,
            letterSpacing: "-2px",
            color: "#111111",
            maxWidth: 720,
            margin: "0 auto 16px",
            textAlign: "center",
          }}
        >
          {HEADING.split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: "blur(10px)", y: 18 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.05 }}
              style={{ display: "inline-block", marginRight: "0.2em" }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15,
            fontWeight: 400,
            lineHeight: 1.65,
            color: "rgba(0,0,0,0.45)",
            textAlign: "center",
            maxWidth: 420,
            margin: "0 auto",
          }}
        >
          Stop scrolling for distraction. Pick a mode, pay for the time you want, and connect with a real person right now.
        </motion.p>
      </div>

      {/* Two columns */}
      <div
        className="r-s5-grid r-pad-x"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          maxWidth: 1280,
          margin: "0 auto",
          gap: 80,
        }}
      >
        {/* LEFT */}
        <div style={{ flex: 1, maxWidth: 480, paddingTop: 20 }}>
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: "block",
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "2px",
              color: "rgba(0,0,0,0.35)",
              marginBottom: 16,
            }}
          >
            CALLS
          </motion.span>

          <motion.h3
            initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 48,
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              color: "#111111",
              marginBottom: 20,
            }}
          >
            Someone real on the line, in minutes.
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(0,0,0,0.50)",
              marginBottom: 32,
            }}
          >
            Quick Call, Standard, or Long Call. You choose the length, the mode, and how much the moment is worth to you.
          </motion.p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            {CHECKLIST.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <CheckIcon />
                <span
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: "rgba(0,0,0,0.70)",
                  }}
                >
                  {text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="r-s5-right"
          style={{ flex: 1, maxWidth: 580, display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              position: "relative",
              height: 560,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 16,
                overflow: "hidden",
                background: "linear-gradient(165deg, #FDEFE4 0%, #F2ECFA 50%, #E4EEF9 100%)",
              }}
            />

            {/* Card + tabs wrapper */}
            <div
              style={{
                position: "absolute",
                top: 48,
                left: 32,
                right: 32,
                zIndex: 10,
              }}
            >
              {/* Session card */}
              <div
                style={{
                  position: "relative",
                  background: "rgba(255,255,255,0.78)",
                  backdropFilter: "blur(60px)",
                  WebkitBackdropFilter: "blur(60px)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 24,
                  padding: "24px 24px 20px",
                  boxShadow: "0 20px 60px rgba(15,23,42,0.14)",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ marginBottom: 14 }}>
                    <div
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: 20,
                        fontWeight: 300,
                        color: "#111111",
                        marginBottom: 12,
                      }}
                    >
                      Deep Talk session
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 33,
                          height: 33,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #E8642A, #FFB37A)",
                          color: "#FFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        E
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: "'Inter Tight', sans-serif",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#111111",
                          }}
                        >
                          Your host
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span
                            style={{
                              fontFamily: "'Inter Tight', sans-serif",
                              fontSize: 11,
                              fontWeight: 400,
                              color: "rgba(0,0,0,0.40)",
                            }}
                          >
                            Connected: Tonight at 21:38
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Equalizer row */}
                  <div
                    style={{
                      margin: "14px 0 14px",
                      position: "relative",
                      border: "1px solid rgba(0,0,0,0.10)",
                      borderRadius: 999,
                      padding: "6px 14px 6px 6px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#111111",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        gap: 2.5,
                        marginRight: 12,
                      }}
                    >
                      <span style={{ width: 2, height: 9, background: "#FFF", borderRadius: 1 }} />
                      <span style={{ width: 2, height: 9, background: "#FFF", borderRadius: 1 }} />
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        overflow: "hidden",
                        WebkitMaskImage:
                          "linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
                        maskImage:
                          "linear-gradient(to right, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
                      }}
                    >
                      <EqualizerRow values={row1} />
                      <EqualizerRow values={row2} />
                    </div>
                    <div
                      style={{
                        marginLeft: 12,
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 11,
                        fontWeight: 400,
                        color: "rgba(0,0,0,0.45)",
                        flexShrink: 0,
                      }}
                    >
                      32:43
                    </div>
                  </div>

                  {/* Session details block */}
                  <div style={{ paddingTop: 4 }}>
                    <div
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: 20,
                        fontWeight: 300,
                        color: "#111111",
                        marginBottom: 10,
                      }}
                    >
                      This session
                    </div>
                    <p
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 12,
                        fontWeight: 400,
                        lineHeight: 1.6,
                        color: "rgba(0,0,0,0.55)",
                        marginBottom: 10,
                      }}
                    >
                      25 minutes purchased. Nobody in the queue behind you, so a grace extension is on the table.
                    </p>
                    <div
                      style={{
                        height: 8,
                        width: "85%",
                        borderRadius: 4,
                        backgroundImage:
                          "linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 75%)",
                        backgroundSize: "200% 100%",
                        animation: "s5-shimmer 2s linear infinite",
                      }}
                    />
                    <div
                      style={{
                        height: 8,
                        width: "65%",
                        borderRadius: 4,
                        marginTop: 6,
                        backgroundImage:
                          "linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.09) 50%, rgba(0,0,0,0.04) 75%)",
                        backgroundSize: "200% 100%",
                        animation: "s5-shimmer 2s linear infinite",
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "'Inter Tight', sans-serif",
                        fontSize: 12,
                        fontWeight: 400,
                        lineHeight: 1.6,
                        color: "rgba(0,0,0,0.30)",
                        marginTop: 10,
                      }}
                    >
                      Recorded with your consent for safety and quality. Either side can leave at any time, no explanation needed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom tabs */}
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {TABS.map((label, i) => (
                  <motion.button
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    onClick={() => router.push("/modes")}
                    style={{
                      borderRadius: 40,
                      border: "1px solid rgba(0,0,0,0.12)",
                      background: "rgba(255,255,255,0.80)",
                      backdropFilter: "blur(48.5px)",
                      WebkitBackdropFilter: "blur(48.5px)",
                      display: "flex",
                      height: 40,
                      padding: "10px 18px",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 13,
                      fontWeight: 400,
                      color: "rgba(0,0,0,0.75)",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#111111";
                      e.currentTarget.style.borderColor = "rgba(0,0,0,0.30)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(0,0,0,0.75)";
                      e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                    }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Second block — card on the LEFT */}
      <div
        className="r-s5-grid r-pad-x"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          maxWidth: 1280,
          margin: "120px auto 0",
          gap: 80,
        }}
      >
        {/* LEFT — queue card stack */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="r-s5-left-card"
          style={{ flex: 1, maxWidth: 580, display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              position: "relative",
              height: 560,
              borderRadius: 16,
              overflow: "hidden",
              background: "linear-gradient(200deg, #E7F0FA 0%, #F4EFFB 50%, #FCE9DD 100%)",
            }}
          >
            {/* back card — queue list */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                top: "48%",
                width: "70%",
                right: "18%",
                zIndex: 2,
                borderRadius: 18,
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 30px 60px rgba(15,23,42,0.18)",
                padding: "18px 20px",
              }}
            >
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 400, color: "#111", marginBottom: 12 }}>
                Current queue
              </div>
              {[
                { pos: "1", bid: "$8.00" },
                { pos: "2", bid: "$5.00" },
                { pos: "3", bid: "$3.00" },
              ].map((row) => (
                <div
                  key={row.pos}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "9px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 13,
                    color: "rgba(0,0,0,0.6)",
                  }}
                >
                  <span>#{row.pos} in line</span>
                  <span style={{ color: "#E8642A", fontWeight: 500 }}>{row.bid}</span>
                </div>
              ))}
            </motion.div>

            {/* front card — your bid */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                top: "26%",
                width: "55%",
                right: 24,
                zIndex: 3,
                borderRadius: 18,
                background: "#111111",
                color: "#FFF",
                boxShadow: "0 30px 60px rgba(15,23,42,0.28)",
                padding: "18px 20px",
              }}
            >
              <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>
                Your priority bid
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 34, fontWeight: 300, letterSpacing: -1 }}>
                $10.00
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 11,
                  color: "#FFB37A",
                  border: "1px solid rgba(255,179,122,0.5)",
                  borderRadius: 9999,
                  padding: "3px 10px",
                }}
              >
                Moves you to #1
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT — text */}
        <div style={{ flex: 1, maxWidth: 480, paddingTop: 20 }}>
          <motion.span
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              display: "block",
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "2px",
              color: "rgba(0,0,0,0.35)",
              marginBottom: 16,
            }}
          >
            QUEUE
          </motion.span>

          <motion.h3
            initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 48,
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: "-1.5px",
              color: "#111111",
              marginBottom: 20,
            }}
          >
            Bid what the moment is worth to you.
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.7,
              color: "rgba(0,0,0,0.50)",
              marginBottom: 32,
            }}
          >
            The queue is a live market. Higher bids connect sooner, and waiting earns you a bonus so nobody gets stuck at the back.
          </motion.p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid rgba(0,0,0,0.08)",
              marginBottom: 32,
            }}
          >
            {[
              "See the live queue and place a bid to move up",
              "Waiting-time bonus protects patient callers from starvation",
              "Subscribers get standing priority on every session",
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "16px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <CheckIcon />
                <span
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: "rgba(0,0,0,0.70)",
                  }}
                >
                  {text}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={() => router.push("/pricing")}
            style={{
              borderRadius: 9999,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(0,0,0,0.04)",
              padding: "12px 22px",
              cursor: "pointer",
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 14,
              fontWeight: 400,
              color: "#111111",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.04)";
            }}
          >
            See pricing
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Section5;
