"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Zap } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MagneticButton from "../components/landing/MagneticButton";
import {
  Chip,
  Note,
  PageHero,
  PageShell,
  Surface,
  fontBody,
  fontHeading
} from "../components/landing/PageShell";
import { apiGet, apiPost } from "../lib/api";
import { redirectToSignIn } from "../lib/authRedirects";
import { useAuth } from "../lib/useAuth";

type QueueStatus = {
  session_id: string;
  status: string;
  position?: number;
  priority_score?: number;
};

const BOOSTS = [
  { cents: 0, label: "No boost" },
  { cents: 200, label: "+$2" },
  { cents: 500, label: "+$5" },
  { cents: 1000, label: "+$10" }
];

const CONSENT_STORAGE_KEY = "ear:consentAcknowledged";

function ConsentCheck({
  checked,
  onToggle,
  children
}: {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="flex"
      style={{
        gap: 10,
        width: "100%",
        textAlign: "left",
        alignItems: "flex-start",
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer"
      }}
    >
      <span
        className="flex items-center justify-center"
        style={{
          flexShrink: 0,
          width: 17,
          height: 17,
          borderRadius: 5,
          marginTop: 1,
          border: checked ? "none" : "1.5px solid rgba(0,0,0,0.25)",
          background: checked ? "#111111" : "rgba(255,255,255,0.9)",
          transition: "background 0.2s ease, border-color 0.2s ease"
        }}
      >
        {checked ? <Check size={11} color="#FFFFFF" strokeWidth={3.5} /> : null}
      </span>
      <span
        style={{
          fontFamily: fontBody,
          fontSize: 13,
          lineHeight: 1.55,
          color: "rgba(0,0,0,0.55)"
        }}
      >
        {children}
      </span>
    </button>
  );
}

export function QueueFlow() {
  const params = useSearchParams();
  const auth = useAuth();

  const [sessionId, setSessionId] = useState("");
  const [boost, setBoost] = useState(0);
  const [position, setPosition] = useState<number | null>(null);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [recordingOk, setRecordingOk] = useState(false);
  const [termsOk, setTermsOk] = useState(false);
  const justPaid = params.get("preview") === "1" || params.get("paid") === "1";

  useEffect(() => {
    const fromUrl = params.get("session");
    const stored = window.localStorage.getItem("ear:lastSessionId") || "";
    const session = fromUrl || stored;
    setSessionId(session);
    if (fromUrl) {
      window.localStorage.setItem("ear:lastSessionId", fromUrl);
    }
    if (window.localStorage.getItem(CONSENT_STORAGE_KEY) === "1") {
      setRecordingOk(true);
      setTermsOk(true);
    }
  }, [params]);

  const consented = recordingOk && termsOk;

  function ensureSignedIn(): boolean {
    if (auth.signedIn) return true;
    if (auth.signedIn === null) return false;
    redirectToSignIn();
    return false;
  }

  async function initiateCall() {
    if (!consented || busy) return;
    setError("");
    setBusy(true);
    try {
      if (!ensureSignedIn()) return;
      await apiPost<{ status: string }>("/queue/join", {
        session_id: sessionId,
        priority_bid_cents: boost
      });
      await apiPost("/calls/consent", {
        session_id: sessionId,
        recording_consented: true,
        terms_consented: true
      });
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "1");
      window.location.href = `/call?session=${sessionId}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function checkStatus() {
    setError("");
    try {
      if (!ensureSignedIn()) return;
      const response = await apiGet<QueueStatus>(
        `/queue/status?session_id=${encodeURIComponent(sessionId)}`
      );
      if (response.position) {
        setPosition(response.position);
        setStatusText("");
      } else {
        setPosition(null);
        setStatusText(
          response.status === "matched"
            ? "You're up. Head to your call."
            : "You haven't started yet. Tap Initiate call when you're ready."
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <PageShell active="/queue" maxWidth={680}>
      <PageHero
        eyebrow="Your call"
        title="You're one tap away."
        sub="Your call is paid for. Start it whenever you're ready. A boost moves you up if others are ahead."
      />

      {justPaid ? (
        <div className="flex justify-center" style={{ marginBottom: 28 }}>
          <Note kind="success">Payment confirmed. Start your call below.</Note>
        </div>
      ) : null}

      {!sessionId ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Surface style={{ padding: 40, textAlign: "center" }}>
            <p style={{ fontFamily: fontHeading, fontSize: 21, fontWeight: 400, color: "#111111", margin: "0 0 8px" }}>
              No active session yet
            </p>
            <p style={{ fontFamily: fontBody, fontSize: 14, color: "rgba(0,0,0,0.5)", margin: "0 0 24px" }}>
              Pick a mode and a session length first. It takes under a minute.
            </p>
            <MagneticButton
              circleColor="rgba(255,255,255,0.15)"
              circleSize={220}
              onClick={() => (window.location.href = "/start")}
              style={{
                borderRadius: 9999,
                background: "#111111",
                color: "#FFFFFF",
                border: "none",
                fontFamily: fontHeading,
                fontSize: 14,
                fontWeight: 500,
                padding: "13px 24px",
                cursor: "pointer"
              }}
            >
              Start a session <ArrowRight size={14} />
            </MagneticButton>
          </Surface>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Surface style={{ padding: 40 }}>
            {/* Breathing presence dot */}
            <div className="flex justify-center" style={{ marginBottom: 24 }}>
              <motion.span
                animate={{ scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  display: "block",
                  width: 16,
                  height: 16,
                  borderRadius: 9999,
                  background: "#E8642A",
                  boxShadow: "0 0 0 10px rgba(232,100,42,0.12), 0 0 0 22px rgba(232,100,42,0.05)"
                }}
              />
            </div>

            {position !== null ? (
              <p
                style={{
                  textAlign: "center",
                  fontFamily: fontHeading,
                  fontSize: 40,
                  fontWeight: 250,
                  letterSpacing: "-1.4px",
                  color: "#111111",
                  margin: "0 0 6px"
                }}
              >
                #{position} in line
              </p>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  fontFamily: fontHeading,
                  fontSize: 24,
                  fontWeight: 350,
                  letterSpacing: "-0.6px",
                  color: "#111111",
                  margin: "0 0 6px"
                }}
              >
                Ready when you are
              </p>
            )}
            <p
              style={{
                textAlign: "center",
                fontFamily: fontBody,
                fontSize: 14,
                color: "rgba(0,0,0,0.5)",
                margin: "0 0 30px"
              }}
            >
              {statusText || "One tap and we'll connect you."}
            </p>

            <div style={{ marginBottom: 26 }}>
              <p style={{ fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.45)", margin: "0 0 10px" }}>
                Get connected sooner (optional)
              </p>
              <div className="k-row">
                {BOOSTS.map((option) => (
                  <Chip
                    key={option.cents}
                    label={option.label}
                    selected={boost === option.cents}
                    onClick={() => setBoost(option.cents)}
                    icon={option.cents > 0 ? <Zap size={13} /> : undefined}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
              <ConsentCheck checked={recordingOk} onToggle={() => setRecordingOk((v) => !v)}>
                Calls are recorded for safety. I'm okay with that.
              </ConsentCheck>
              <ConsentCheck checked={termsOk} onToggle={() => setTermsOk((v) => !v)}>
                I'm 18 or older and I accept the{" "}
                <Link
                  href="/terms"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: "rgba(0,0,0,0.7)", textDecoration: "underline", textUnderlineOffset: 2 }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: "rgba(0,0,0,0.7)", textDecoration: "underline", textUnderlineOffset: 2 }}
                >
                  Privacy Policy
                </Link>
                .
              </ConsentCheck>
            </div>

            <div className="flex items-center" style={{ gap: 12, flexWrap: "wrap" }}>
              <MagneticButton
                circleColor="rgba(255,255,255,0.15)"
                circleSize={240}
                onClick={initiateCall}
                style={{
                  borderRadius: 9999,
                  background: "#111111",
                  color: "#FFFFFF",
                  border: "none",
                  fontFamily: fontHeading,
                  fontSize: 15,
                  fontWeight: 500,
                  padding: "14px 26px",
                  cursor: busy ? "wait" : consented ? "pointer" : "not-allowed",
                  opacity: busy ? 0.7 : consented ? 1 : 0.45,
                  transition: "opacity 0.25s ease"
                }}
              >
                {busy ? "One moment…" : auth.signedIn === false ? "Sign in to continue" : "Initiate call"}
                {busy ? null : <ArrowRight size={15} />}
              </MagneticButton>
              <button
                type="button"
                onClick={checkStatus}
                style={{
                  borderRadius: 9999,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.8)",
                  color: "#111111",
                  fontFamily: fontBody,
                  fontSize: 14,
                  padding: "13px 22px",
                  cursor: "pointer"
                }}
              >
                Check my status
              </button>
            </div>
          </Surface>

          <p style={{ textAlign: "center", marginTop: 20 }}>
            <Link href="/start" style={{ fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.45)" }}>
              Start a different session →
            </Link>
          </p>
        </motion.div>
      )}

      {error ? (
        <div className="flex justify-center" style={{ marginTop: 24 }}>
          <Note kind="error">{error}</Note>
        </div>
      ) : null}

      <div style={{ height: 80 }} />
    </PageShell>
  );
}
