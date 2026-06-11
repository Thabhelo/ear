"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MagneticButton from "../components/landing/MagneticButton";
import {
  Note,
  PageHero,
  PageShell,
  Surface,
  fontBody,
  fontHeading
} from "../components/landing/PageShell";
import { apiPost } from "../lib/api";
import { redirectToSignIn } from "../lib/authRedirects";
import { useAuth } from "../lib/useAuth";

function ConsentRow({
  checked,
  onToggle,
  title,
  detail
}: {
  checked: boolean;
  onToggle: () => void;
  title: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="flex"
      style={{
        gap: 16,
        width: "100%",
        textAlign: "left",
        padding: "18px 20px",
        borderRadius: 18,
        border: checked ? "1.5px solid #111111" : "1px solid rgba(0,0,0,0.1)",
        background: checked ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.9)",
        cursor: "pointer",
        transition: "border-color 0.2s ease, background 0.2s ease"
      }}
    >
      <span
        className="flex items-center justify-center"
        style={{
          flexShrink: 0,
          width: 26,
          height: 26,
          borderRadius: 9999,
          marginTop: 2,
          border: checked ? "none" : "1.5px solid rgba(0,0,0,0.25)",
          background: checked ? "#111111" : "transparent",
          transition: "background 0.2s ease"
        }}
      >
        {checked ? <Check size={15} color="#FFFFFF" strokeWidth={3} /> : null}
      </span>
      <span>
        <span
          style={{
            display: "block",
            fontFamily: fontHeading,
            fontSize: 16,
            fontWeight: 450,
            color: "#111111",
            marginBottom: 4
          }}
        >
          {title}
        </span>
        <span
          style={{
            display: "block",
            fontFamily: fontBody,
            fontSize: 13.5,
            lineHeight: 1.6,
            color: "rgba(0,0,0,0.55)"
          }}
        >
          {detail}
        </span>
      </span>
    </button>
  );
}

export function ConsentFlow() {
  const params = useSearchParams();
  const auth = useAuth();

  const [sessionId, setSessionId] = useState("");
  const [recording, setRecording] = useState(false);
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const session =
      params.get("session") || window.localStorage.getItem("ear:lastSessionId") || "";
    setSessionId(session);
  }, [params]);

  const ready = recording && terms;

  function ensureSignedIn(): boolean {
    if (auth.signedIn) return true;
    if (auth.signedIn === null) return false;
    redirectToSignIn();
    return false;
  }

  async function agreeAndJoin() {
    if (!ready) return;
    setError("");
    setBusy(true);
    try {
      if (!ensureSignedIn()) return;
      await apiPost("/calls/consent", {
        session_id: sessionId,
        recording_consented: recording,
        terms_consented: terms
      });
      window.localStorage.setItem("ear:consentAcknowledged", "1");
      window.location.href = `/call?session=${sessionId}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell active="/queue" maxWidth={640}>
      <PageHero
        eyebrow="Before the call"
        title="Two things first."
        sub="These protect both people on the call. They're not fine print. They're the deal."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Surface style={{ padding: 30, display: "flex", flexDirection: "column", gap: 14 }}>
          <ConsentRow
            checked={recording}
            onToggle={() => setRecording((v) => !v)}
            title="This call is recorded"
            detail="Recording is for safety, quality, and dispute resolution. By joining, you consent to being recorded. No consent, no call."
          />
          <ConsentRow
            checked={terms}
            onToggle={() => setTerms((v) => !v)}
            title="This is presence, not a service of last resort"
            detail="Ear is not dating, therapy, medical advice, or crisis counseling, and it's not a substitute for emergency services. Either side can leave at any time."
          />

          <div className="flex justify-center" style={{ marginTop: 12 }}>
            <MagneticButton
              circleColor="rgba(255,255,255,0.15)"
              circleSize={240}
              onClick={agreeAndJoin}
              style={{
                borderRadius: 9999,
                background: ready ? "#111111" : "rgba(0,0,0,0.25)",
                color: "#FFFFFF",
                border: "none",
                fontFamily: fontHeading,
                fontSize: 15,
                fontWeight: 500,
                padding: "14px 28px",
                cursor: ready ? (busy ? "wait" : "pointer") : "not-allowed",
                opacity: busy ? 0.7 : 1,
                transition: "background 0.25s ease"
              }}
            >
              {busy ? "One moment…" : "Agree and join the call"}
              {busy ? null : <ArrowRight size={15} />}
            </MagneticButton>
          </div>
          {!ready ? (
            <p
              style={{
                textAlign: "center",
                fontFamily: fontBody,
                fontSize: 12.5,
                color: "rgba(0,0,0,0.4)",
                margin: 0
              }}
            >
              Tap both cards to continue.
            </p>
          ) : null}
        </Surface>
      </motion.div>

      {error ? (
        <div className="flex justify-center" style={{ marginTop: 24 }}>
          <Note kind="error">{error}</Note>
        </div>
      ) : null}

      <div style={{ height: 80 }} />
    </PageShell>
  );
}
