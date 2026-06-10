"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
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

export function QueueFlow() {
  const params = useSearchParams();
  const auth = useAuth();

  const [sessionId, setSessionId] = useState("");
  const [boost, setBoost] = useState(0);
  const [position, setPosition] = useState<number | null>(null);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const justPaid = params.get("preview") === "1" || params.get("paid") === "1";

  useEffect(() => {
    const fromUrl = params.get("session");
    const stored = window.localStorage.getItem("ear:lastSessionId") || "";
    const session = fromUrl || stored;
    setSessionId(session);
    if (fromUrl) {
      window.localStorage.setItem("ear:lastSessionId", fromUrl);
    }
  }, [params]);

  function ensureSignedIn(): boolean {
    if (auth.signedIn) return true;
    if (auth.signedIn === null) return false;
    redirectToSignIn();
    return false;
  }

  async function joinQueue() {
    setError("");
    setBusy(true);
    try {
      if (!ensureSignedIn()) return;
      await apiPost<{ status: string }>("/queue/join", {
        session_id: sessionId,
        priority_bid_cents: boost
      });
      window.location.href = `/consent?session=${sessionId}`;
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
            : "You're not in line yet. Tap below to join."
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <PageShell active="/queue" maxWidth={680}>
      <PageHero
        eyebrow="Queue"
        title="You're almost connected."
        sub="We match one person at a time, in order. Boosting moves you up; waiting counts too."
      />

      {justPaid ? (
        <div className="flex justify-center" style={{ marginBottom: 28 }}>
          <Note kind="success">You're all set. Join the line below.</Note>
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
              {statusText || "Join the line and we'll walk you through consent before the call."}
            </p>

            <div style={{ marginBottom: 28 }}>
              <p style={{ fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.45)", margin: "0 0 10px" }}>
                Move up the line (optional)
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

            <div className="flex items-center" style={{ gap: 12, flexWrap: "wrap" }}>
              <MagneticButton
                circleColor="rgba(255,255,255,0.15)"
                circleSize={240}
                onClick={joinQueue}
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
                {busy ? "One moment…" : auth.signedIn === false ? "Sign in to continue" : "Get in line"}
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
                Check my spot
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
