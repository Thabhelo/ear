"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, MessageSquareText, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import MagneticButton from "../components/landing/MagneticButton";
import { ModeGlyph } from "../components/landing/modeMeta";
import {
  Chip,
  Note,
  PageHero,
  PageShell,
  Surface,
  fontBody,
  fontHeading
} from "../components/landing/PageShell";
import { apiPost } from "../lib/api";
import { redirectToSignIn } from "../lib/authRedirects";
import { modes, oneOffs, subscriptions, type ModeId, type OneOffId } from "../lib/catalog";
import { useAuth } from "../lib/useAuth";

type CheckoutResponse = {
  checkout_url: string;
  session_id: string;
  configured: boolean;
};

function isModeId(value: string | null): value is ModeId {
  return modes.some((m) => m.id === value);
}

function isOneOffId(value: string | null): value is OneOffId {
  return oneOffs.some((o) => o.id === value);
}

function dollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function StepLabel({ index, children }: { index: string; children: string }) {
  return (
    <div className="flex items-center" style={{ gap: 10, margin: "0 0 12px" }}>
      <span
        style={{
          fontFamily: fontBody,
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(0,0,0,0.35)",
          letterSpacing: "1px"
        }}
      >
        {index}
      </span>
      <span
        style={{
          fontFamily: fontHeading,
          fontSize: 18,
          fontWeight: 400,
          letterSpacing: "-0.3px",
          color: "#111111"
        }}
      >
        {children}
      </span>
    </div>
  );
}

export function StartFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const auth = useAuth();

  const planParam = params.get("plan");
  const membership = subscriptions.find((s) => s.id === planParam) ?? null;
  const activated = params.get("activated") === "1";

  const [mode, setMode] = useState<ModeId>(
    isModeId(params.get("mode")) ? (params.get("mode") as ModeId) : "just_listen"
  );
  const [product, setProduct] = useState<OneOffId>(
    isOneOffId(params.get("product")) ? (params.get("product") as OneOffId) : "quick_call"
  );

  // Client-side navigations to /start?mode=… don't remount this component,
  // so keep the selection in sync with the URL.
  useEffect(() => {
    const urlMode = params.get("mode");
    if (isModeId(urlMode)) setMode(urlMode);
    const urlProduct = params.get("product");
    if (isOneOffId(urlProduct)) setProduct(urlProduct);
  }, [params]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const selected = useMemo(() => oneOffs.find((o) => o.id === product)!, [product]);
  const totalCents = selected.amountCents;

  function ensureSignedIn(): boolean {
    if (auth.signedIn) return true;
    if (auth.signedIn === null) return false;
    redirectToSignIn();
    return false;
  }

  async function continueToPayment() {
    setError("");
    setBusy(true);
    try {
      if (!ensureSignedIn()) return;
      const response = await apiPost<CheckoutResponse>("/checkout/one-off", {
        mode,
        product,
        priority_bid_cents: 0
      });
      window.localStorage.setItem("ear:lastSessionId", response.session_id);
      window.location.href = response.checkout_url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function startMembership() {
    if (!membership) return;
    setError("");
    setBusy(true);
    try {
      if (!ensureSignedIn()) return;
      const response = await apiPost<CheckoutResponse>("/checkout/subscription", {
        plan: membership.id
      });
      window.location.href = response.checkout_url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // Only show the Google label when we know for sure the user is signed out;
  // while auth is still resolving (null) we show the real action.
  const ctaLabel = busy
    ? "One moment…"
    : auth.signedIn === false
      ? "Sign in to continue"
      : membership
        ? `Start ${membership.name} · ${membership.price}${membership.cadence}`
        : `Continue to payment · ${dollars(totalCents)}`;

  return (
    <PageShell active="/start" maxWidth={820}>
      <PageHero
        eyebrow="Start"
        title={membership ? "Almost there." : "Start a session."}
        sub={
          membership
            ? "Confirm your membership and you're in."
            : "Three choices. Pay once, then pick a time that works for you."
        }
      />

      {activated ? (
        <div className="flex justify-center" style={{ marginBottom: 28 }}>
          <Note kind="success">Your membership is active. Welcome.</Note>
        </div>
      ) : null}

      {membership ? (
        /* ----- Membership confirmation ----- */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Surface style={{ padding: 34, maxWidth: 480, margin: "0 auto" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
              <h3
                style={{
                  fontFamily: fontHeading,
                  fontSize: 24,
                  fontWeight: 400,
                  letterSpacing: "-0.6px",
                  color: "#111111",
                  margin: 0
                }}
              >
                {membership.name}
              </h3>
              <span>
                <span
                  style={{
                    fontFamily: fontHeading,
                    fontSize: 26,
                    fontWeight: 300,
                    letterSpacing: "-0.8px",
                    color: "#111111"
                  }}
                >
                  {membership.price}
                </span>
                <span style={{ fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.4)" }}>
                  {membership.cadence}
                </span>
              </span>
            </div>
            <p style={{ fontFamily: fontBody, fontSize: 14, color: "rgba(0,0,0,0.55)", margin: "0 0 20px" }}>
              {membership.tagline}
            </p>
            <ul style={{ listStyle: "none", margin: "0 0 26px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {membership.perks.map((perk) => (
                <li key={perk} className="flex items-center" style={{ gap: 9 }}>
                  <Check size={15} color="#1F9D63" strokeWidth={2.4} />
                  <span style={{ fontFamily: fontBody, fontSize: 14, color: "rgba(0,0,0,0.65)" }}>{perk}</span>
                </li>
              ))}
            </ul>
            <MagneticButton
              circleColor="rgba(255,255,255,0.15)"
              circleSize={260}
              onClick={startMembership}
              style={{
                width: "100%",
                justifyContent: "center",
                borderRadius: 9999,
                background: "#111111",
                color: "#FFFFFF",
                border: "none",
                fontFamily: fontHeading,
                fontSize: 15,
                fontWeight: 500,
                padding: "15px 28px",
                cursor: busy ? "wait" : "pointer",
                opacity: busy ? 0.7 : 1
              }}
            >
              {ctaLabel} {busy ? null : <ArrowRight size={15} />}
            </MagneticButton>
            <p style={{ textAlign: "center", margin: "16px 0 0" }}>
              <Link
                href="/pricing?view=membership"
                style={{ fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.45)" }}
              >
                Change plan
              </Link>
            </p>
          </Surface>
        </motion.div>
      ) : (
        /* ----- One-time session flow ----- */
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          {/* Step 1: mode */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
          >
            <StepLabel index="01">How do you want to connect?</StepLabel>
            <div className="k-row">
              {modes.map((m) => (
                <Chip
                  key={m.id}
                  size="lg"
                  label={m.name}
                  selected={mode === m.id}
                  onClick={() => setMode(m.id)}
                  icon={<ModeGlyph mode={m.id} size={22} radius={7} />}
                />
              ))}
            </div>
            <p style={{ fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.4)", margin: "12px 0 0" }}>
              {modes.find((m) => m.id === mode)?.description}
            </p>
          </motion.section>

          {/* Step 2: session */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
          >
            <StepLabel index="02">How long?</StepLabel>
            <div className="k-grid k-grid-4">
              {oneOffs.map((item) => {
                const isSelected = product === item.id;
                return (
                  <Surface
                    key={item.id}
                    hover
                    selected={isSelected}
                    onClick={() => setProduct(item.id)}
                    style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, width: "100%" }}
                  >
                    <div className="flex items-center" style={{ gap: 7 }}>
                      {item.kind === "text" ? (
                        <MessageSquareText size={14} color="rgba(0,0,0,0.4)" />
                      ) : (
                        <Phone size={14} color="rgba(0,0,0,0.4)" />
                      )}
                      <span style={{ fontFamily: fontBody, fontSize: 12, color: "rgba(0,0,0,0.5)" }}>
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center" style={{ gap: 7 }}>
                      <Clock size={15} color="#E8642A" strokeWidth={1.9} />
                      <span
                        style={{
                          fontFamily: fontHeading,
                          fontSize: 21,
                          fontWeight: 350,
                          letterSpacing: "-0.6px",
                          color: "#111111"
                        }}
                      >
                        {item.duration}
                      </span>
                    </div>
                    <span style={{ fontFamily: fontBody, fontSize: 14, fontWeight: 500, color: "#111111" }}>
                      {item.price}
                    </span>
                  </Surface>
                );
              })}
            </div>
          </motion.section>

          {/* Summary + CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26, ease: "easeOut" }}
          >
            <Surface style={{ padding: "22px 26px" }}>
              <div
                className="flex items-center justify-between"
                style={{ flexWrap: "wrap", gap: 16 }}
              >
                <div>
                  <p style={{ fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.45)", margin: "0 0 4px" }}>
                    {modes.find((m) => m.id === mode)?.name} · {selected.name}
                  </p>
                  <p
                    style={{
                      fontFamily: fontHeading,
                      fontSize: 28,
                      fontWeight: 300,
                      letterSpacing: "-1px",
                      color: "#111111",
                      margin: 0
                    }}
                  >
                    {dollars(totalCents)}
                  </p>
                </div>
                <div className="flex items-center" style={{ gap: 12, flexWrap: "wrap" }}>
                  {auth.signedIn && auth.label ? (
                    <span
                      className="inline-flex items-center"
                      style={{ gap: 8, fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.5)" }}
                    >
                      {auth.label}
                      <Link
                        href="/account"
                        style={{
                          border: "none",
                          background: "transparent",
                          fontFamily: fontBody,
                          fontSize: 13,
                          color: "rgba(0,0,0,0.4)",
                          textDecoration: "underline",
                          cursor: "pointer",
                          padding: 0
                        }}
                      >
                        account
                      </Link>
                    </span>
                  ) : null}
                  <MagneticButton
                    circleColor="rgba(255,255,255,0.15)"
                    circleSize={240}
                    onClick={continueToPayment}
                    style={{
                      borderRadius: 9999,
                      background: "#111111",
                      color: "#FFFFFF",
                      border: "none",
                      fontFamily: fontHeading,
                      fontSize: 15,
                      fontWeight: 500,
                      padding: "14px 26px",
                      cursor: busy ? "wait" : "pointer",
                      opacity: busy ? 0.7 : 1
                    }}
                  >
                    {ctaLabel} {busy ? null : <ArrowRight size={15} />}
                  </MagneticButton>
                </div>
              </div>
            </Surface>
            <div className="flex items-center justify-between" style={{ marginTop: 16, flexWrap: "wrap", gap: 10 }}>
              <Link
                href="/pricing?view=membership"
                style={{ fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.45)" }}
              >
                Prefer ongoing access? See memberships →
              </Link>
              <Link href="/book" style={{ fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.45)" }}>
                Already paid? Book your time →
              </Link>
            </div>
          </motion.section>
        </div>
      )}

      {error ? (
        <div className="flex justify-center" style={{ marginTop: 28 }}>
          <Note kind="error">{error}</Note>
        </div>
      ) : null}

      <div style={{ height: 80 }} />
    </PageShell>
  );
}
