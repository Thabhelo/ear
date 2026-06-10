"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Clock, MessageSquareText, Phone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import MagneticButton from "../components/landing/MagneticButton";
import {
  PageHero,
  PageShell,
  Surface,
  fontBody,
  fontHeading
} from "../components/landing/PageShell";
import { oneOffs, subscriptions } from "../lib/catalog";

type Tab = "once" | "membership";

const FAQ = [
  {
    q: "Can I get extra free time?",
    a: "Yes. When nobody is waiting and energy permits, your call can keep going past the purchased time at no extra charge. It happens often on quiet nights, though it's never guaranteed."
  },
  {
    q: "Do I get a personal phone number?",
    a: "No. Everything stays on the platform. That boundary is what keeps Ear sustainable for everyone."
  },
  {
    q: "Is this therapy?",
    a: "No. Ear is real human presence. It is not therapy, dating, medical advice, crisis counseling, or an emergency service."
  }
];

function SegmentedControl({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const options: { id: Tab; label: string }[] = [
    { id: "membership", label: "Membership" },
    { id: "once", label: "One-time" }
  ];
  return (
    <div
      className="inline-flex items-center"
      style={{
        padding: 4,
        borderRadius: 9999,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.8)",
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)"
      }}
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setTab(option.id)}
          style={{
            position: "relative",
            padding: "10px 26px",
            borderRadius: 9999,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontFamily: fontBody,
            fontSize: 14,
            fontWeight: tab === option.id ? 500 : 400,
            color: tab === option.id ? "#FFFFFF" : "rgba(0,0,0,0.6)",
            transition: "color 0.25s ease",
            zIndex: 1
          }}
        >
          {tab === option.id && (
            <motion.span
              layoutId="pricing-tab-pill"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 9999,
                background: "#111111",
                zIndex: -1
              }}
            />
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
}

function OneOffCards({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="k-grid k-grid-4">
      {oneOffs.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
        >
          <Surface
            hover
            onClick={() => onPick(item.id)}
            style={{
              padding: 26,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 14
            }}
          >
            <div className="flex items-center" style={{ gap: 8 }}>
              {item.kind === "text" ? (
                <MessageSquareText size={16} color="rgba(0,0,0,0.45)" />
              ) : (
                <Phone size={16} color="rgba(0,0,0,0.45)" />
              )}
              <span
                style={{
                  fontFamily: fontBody,
                  fontSize: 13,
                  color: "rgba(0,0,0,0.5)"
                }}
              >
                {item.name}
              </span>
            </div>

            <div className="flex items-center" style={{ gap: 8 }}>
              <Clock size={18} color="#E8642A" strokeWidth={1.8} />
              <span
                style={{
                  fontFamily: fontHeading,
                  fontSize: 30,
                  fontWeight: 300,
                  letterSpacing: "-1px",
                  color: "#111111"
                }}
              >
                {item.duration}
              </span>
            </div>

            <p
              style={{
                fontFamily: fontBody,
                fontSize: 13,
                lineHeight: 1.55,
                color: "rgba(0,0,0,0.5)",
                margin: 0,
                flexGrow: 1
              }}
            >
              {item.detail}
            </p>

            <div
              className="flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 14 }}
            >
              <span>
                <span
                  style={{
                    fontFamily: fontHeading,
                    fontSize: 22,
                    fontWeight: 400,
                    letterSpacing: "-0.5px",
                    color: "#111111"
                  }}
                >
                  {item.price}
                </span>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: 12,
                    color: "rgba(0,0,0,0.4)",
                    marginLeft: 6
                  }}
                >
                  {item.priceNote}
                </span>
              </span>
              <ArrowRight size={16} color="rgba(0,0,0,0.4)" />
            </div>
          </Surface>
        </motion.div>
      ))}
    </div>
  );
}

function MembershipCards({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="k-grid k-grid-4" style={{ alignItems: "stretch" }}>
      {subscriptions.map((plan, i) => {
        const dark = plan.featured;
        return (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
          >
            <Surface
              hover
              onClick={() => onPick(plan.id)}
              style={{
                padding: 26,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                ...(dark
                  ? {
                      background: "#111111",
                      border: "1px solid #111111",
                      boxShadow: "0 24px 56px rgba(15,23,42,0.25)"
                    }
                  : {})
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: 13,
                    color: dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"
                  }}
                >
                  {plan.name}
                </span>
                {dark ? (
                  <span
                    style={{
                      fontFamily: fontBody,
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.4px",
                      color: "#FFD4B4",
                      background: "rgba(232,100,42,0.25)",
                      borderRadius: 9999,
                      padding: "4px 10px"
                    }}
                  >
                    Most popular
                  </span>
                ) : null}
              </div>

              <div>
                <span
                  style={{
                    fontFamily: fontHeading,
                    fontSize: 34,
                    fontWeight: 300,
                    letterSpacing: "-1.2px",
                    color: dark ? "#FFFFFF" : "#111111"
                  }}
                >
                  {plan.price}
                </span>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontSize: 13,
                    color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"
                  }}
                >
                  {plan.cadence}
                </span>
              </div>

              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: 13,
                  color: dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.55)",
                  margin: 0
                }}
              >
                {plan.tagline}
              </p>

              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 9, flexGrow: 1 }}>
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-center" style={{ gap: 8 }}>
                    <Check size={14} color={dark ? "#34D17A" : "#1F9D63"} strokeWidth={2.4} />
                    <span
                      style={{
                        fontFamily: fontBody,
                        fontSize: 13,
                        lineHeight: 1.45,
                        color: dark ? "rgba(255,255,255,0.78)" : "rgba(0,0,0,0.6)"
                      }}
                    >
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>

              <span
                className="inline-flex items-center justify-center"
                style={{
                  gap: 6,
                  borderRadius: 9999,
                  padding: "11px 0",
                  fontFamily: fontBody,
                  fontSize: 13,
                  fontWeight: 500,
                  background: dark ? "#FFFFFF" : "rgba(0,0,0,0.05)",
                  color: dark ? "#111111" : "#111111"
                }}
              >
                Choose {plan.name} <ArrowRight size={14} />
              </span>
            </Surface>
          </motion.div>
        );
      })}
    </div>
  );
}

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(
    searchParams.get("view") === "once" ? "once" : "membership"
  );

  return (
    <PageShell active="/pricing" maxWidth={1160}>
      <PageHero
        eyebrow="Pricing"
        title="Try it once. Keep it if it helps."
        sub="No accounts to manage, no hidden fees. Pay for a single session, or keep ongoing access with a membership."
      />

      <div className="flex justify-center" style={{ marginBottom: 44 }}>
        <SegmentedControl tab={tab} setTab={setTab} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {tab === "once" ? (
            <OneOffCards onPick={(id) => router.push(`/start?product=${id}`)} />
          ) : (
            <MembershipCards onPick={(id) => router.push(`/start?plan=${id}`)} />
          )}
        </motion.div>
      </AnimatePresence>

      <p
        style={{
          textAlign: "center",
          marginTop: 36,
          fontFamily: fontBody,
          fontSize: 13,
          color: "rgba(0,0,0,0.4)"
        }}
      >
        Every call includes its full purchased time. Quiet nights often run longer, on the house.
      </p>

      {/* FAQ */}
      <section style={{ marginTop: 110, maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
        <h2
          style={{
            fontFamily: fontHeading,
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: "-1px",
            color: "#111111",
            textAlign: "center",
            margin: "0 0 32px"
          }}
        >
          Fair questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQ.map((item) => (
            <Surface key={item.q} style={{ padding: "22px 26px" }}>
              <h3
                style={{
                  fontFamily: fontHeading,
                  fontSize: 17,
                  fontWeight: 400,
                  color: "#111111",
                  margin: "0 0 8px"
                }}
              >
                {item.q}
              </h3>
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "rgba(0,0,0,0.55)",
                  margin: 0
                }}
              >
                {item.a}
              </p>
            </Surface>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="flex flex-col items-center" style={{ marginTop: 90, gap: 18 }}>
        <p
          style={{
            fontFamily: fontHeading,
            fontSize: 24,
            fontWeight: 300,
            letterSpacing: "-0.6px",
            color: "#111111",
            margin: 0
          }}
        >
          Someone real is a few taps away.
        </p>
        <MagneticButton
          circleColor="rgba(255,255,255,0.15)"
          circleSize={240}
          onClick={() => router.push("/start")}
          style={{
            borderRadius: 9999,
            background: "#111111",
            color: "#FFFFFF",
            border: "none",
            fontFamily: fontHeading,
            fontSize: 15,
            fontWeight: 500,
            padding: "14px 28px",
            cursor: "pointer"
          }}
        >
          Start now <ArrowRight size={15} />
        </MagneticButton>
      </div>
    </PageShell>
  );
}

export default function PricingPage() {
  return (
    <Suspense>
      <PricingContent />
    </Suspense>
  );
}
