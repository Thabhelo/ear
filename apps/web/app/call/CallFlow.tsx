"use client";

import { motion } from "framer-motion";
import { Flag, Phone, PhoneOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import { LiveKitCallSession, MuteToggle, useDisconnectRoom } from "./LiveKitCallSession";

type RoomPayload = {
  room_name: string;
  join_url: string;
  livekit_url: string | null;
  token: string | null;
  configured: boolean;
  provider: string;
};

type RoomResponse = {
  room: RoomPayload;
};

type Stage = "ready" | "connecting" | "connected" | "ended" | "disconnected";

type CallCredentials = {
  token: string;
  serverUrl: string;
};

function CallControls({
  busy,
  onLeave
}: {
  busy: boolean;
  onLeave: () => void;
}) {
  const disconnect = useDisconnectRoom();

  function handleLeave() {
    disconnect();
    onLeave();
  }

  return (
    <div className="flex justify-center items-center" style={{ gap: 12, flexWrap: "wrap" }}>
      <MuteToggle />
      <button
        type="button"
        onClick={handleLeave}
        style={{
          borderRadius: 9999,
          border: "1px solid rgba(214,69,93,0.4)",
          background: "rgba(214,69,93,0.06)",
          color: "#D6455D",
          fontFamily: fontBody,
          fontSize: 14,
          fontWeight: 500,
          padding: "13px 26px",
          cursor: busy ? "wait" : "pointer"
        }}
      >
        Leave call
      </button>
    </div>
  );
}

export function CallFlow() {
  const params = useSearchParams();
  const auth = useAuth();

  const [sessionId, setSessionId] = useState("");
  const [stage, setStage] = useState<Stage>("ready");
  const [credentials, setCredentials] = useState<CallCredentials | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const leavingRef = useRef(false);

  useEffect(() => {
    const session =
      params.get("session") || window.localStorage.getItem("ear:lastSessionId") || "";
    setSessionId(session);
  }, [params]);

  function ensureSignedIn(): boolean {
    if (auth.signedIn) return true;
    if (auth.signedIn === null) return false;
    redirectToSignIn();
    return false;
  }

  async function joinCall() {
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (!ensureSignedIn()) return;
      const response = await apiPost<RoomResponse>("/calls/create-room", {
        session_id: sessionId,
        consent_given: true
      });
      const { room } = response;

      if (!room.configured || !room.token || !room.livekit_url) {
        setNotice("Your room is ready. Live audio will connect once calling is fully set up.");
        setStage("connected");
        return;
      }

      setCredentials({ token: room.token, serverUrl: room.livekit_url });
      setStage("connecting");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function leaveCall() {
    setError("");
    setBusy(true);
    leavingRef.current = true;
    try {
      setCredentials(null);
      await apiPost("/calls/end", {
        session_id: sessionId,
        ended_by: "user",
        reason: "user_exit",
        refund_requested: false
      });
      setStage("ended");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      leavingRef.current = false;
      setBusy(false);
    }
  }

  async function report() {
    setError("");
    try {
      await apiPost("/reports", {
        session_id: sessionId,
        reason: "user_report",
        details: "Reported from call page."
      });
      setNotice("Thanks. We'll review this.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  const heroTitle =
    stage === "ended"
      ? "Call ended."
      : stage === "disconnected"
        ? "Connection lost."
        : stage === "connected"
          ? "You're connected."
          : stage === "connecting"
            ? "Connecting you now…"
            : "Ready when you are.";

  const heroSub =
    stage === "ended"
      ? "Thanks for being here. Come back any time."
      : stage === "disconnected"
        ? "Something interrupted the call. You can try joining again."
        : "Everything stays on the platform, and you can leave whenever you want.";

  const bodyCopy =
    stage === "ready"
      ? "Tap below and we'll open your room. Your purchased time starts when both sides are in."
      : stage === "connecting"
        ? "Hang tight, we're getting your line ready."
        : stage === "connected"
          ? "If the conversation runs past your time on a quiet night, it may keep going, on the house."
          : stage === "disconnected"
            ? "Check your connection, then tap join again when you're ready."
            : "Your time mattered. If anything felt off, let us know below.";

  return (
    <PageShell active="/queue" maxWidth={640}>
      <PageHero eyebrow="Your call" title={heroTitle} sub={heroSub} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Surface style={{ padding: 40, textAlign: "center" }}>
          <div className="flex justify-center" style={{ marginBottom: 26 }}>
            <motion.div
              animate={
                stage === "connected"
                  ? {
                      scale: [1, 1.06, 1],
                      boxShadow: [
                        "0 0 0 0 rgba(52,209,122,0.25)",
                        "0 0 0 24px rgba(52,209,122,0)",
                        "0 0 0 0 rgba(52,209,122,0)"
                      ]
                    }
                  : { scale: [1, 1.03, 1] }
              }
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center"
              style={{
                width: 96,
                height: 96,
                borderRadius: 9999,
                background:
                  stage === "ended"
                    ? "rgba(0,0,0,0.06)"
                    : stage === "connected"
                      ? "radial-gradient(circle at 35% 30%, rgba(52,209,122,0.25), rgba(31,157,99,0.12))"
                      : stage === "connecting"
                        ? "radial-gradient(circle at 35% 30%, rgba(255,179,122,0.35), rgba(232,100,42,0.18))"
                        : "radial-gradient(circle at 35% 30%, rgba(255,179,122,0.4), rgba(232,100,42,0.15))"
              }}
            >
              {stage === "ended" ? (
                <PhoneOff size={34} color="rgba(0,0,0,0.4)" strokeWidth={1.6} />
              ) : (
                <Phone
                  size={34}
                  color={stage === "connected" ? "#1F9D63" : "#E8642A"}
                  strokeWidth={1.6}
                />
              )}
            </motion.div>
          </div>

          {stage === "connected" ? (
            <div
              className="inline-flex items-center"
              style={{
                gap: 8,
                marginBottom: 22,
                padding: "6px 14px",
                borderRadius: 9999,
                background: "rgba(232,100,42,0.08)",
                border: "1px solid rgba(232,100,42,0.25)"
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: "#E8642A",
                  animation: "rec-blink 1.6s ease-in-out infinite"
                }}
              />
              <span style={{ fontFamily: fontBody, fontSize: 12.5, color: "#B3402A" }}>
                Recording, as agreed
              </span>
            </div>
          ) : null}

          <p
            style={{
              fontFamily: fontBody,
              fontSize: 14,
              lineHeight: 1.65,
              color: "rgba(0,0,0,0.5)",
              maxWidth: 380,
              margin: "0 auto 30px"
            }}
          >
            {bodyCopy}
          </p>

          <div className="flex justify-center items-center" style={{ gap: 12, flexWrap: "wrap" }}>
            {stage === "ready" || stage === "disconnected" ? (
              <MagneticButton
                circleColor="rgba(255,255,255,0.15)"
                circleSize={240}
                onClick={joinCall}
                style={{
                  borderRadius: 9999,
                  background: "#111111",
                  color: "#FFFFFF",
                  border: "none",
                  fontFamily: fontHeading,
                  fontSize: 15,
                  fontWeight: 500,
                  padding: "14px 30px",
                  cursor: busy ? "wait" : "pointer",
                  opacity: busy ? 0.7 : 1
                }}
              >
                {busy
                  ? "One moment…"
                  : auth.signedIn === false
                    ? "Sign in to continue"
                    : stage === "disconnected"
                      ? "Join again"
                      : "Join your call"}
              </MagneticButton>
            ) : null}

            {stage === "connected" ? <CallControls busy={busy} onLeave={leaveCall} /> : null}

            {stage === "ended" ? (
              <MagneticButton
                circleColor="rgba(255,255,255,0.15)"
                circleSize={240}
                onClick={() => (window.location.href = "/start")}
                style={{
                  borderRadius: 9999,
                  background: "#111111",
                  color: "#FFFFFF",
                  border: "none",
                  fontFamily: fontHeading,
                  fontSize: 15,
                  fontWeight: 500,
                  padding: "14px 30px",
                  cursor: "pointer"
                }}
              >
                Start another session
              </MagneticButton>
            ) : null}
          </div>

          {stage !== "ready" ? (
            <button
              type="button"
              onClick={report}
              className="inline-flex items-center"
              style={{
                gap: 6,
                marginTop: 24,
                border: "none",
                background: "transparent",
                fontFamily: fontBody,
                fontSize: 13,
                color: "rgba(0,0,0,0.45)",
                cursor: "pointer"
              }}
            >
              <Flag size={13} /> Report a problem
            </button>
          ) : null}
        </Surface>
      </motion.div>

      {credentials ? (
        <LiveKitCallSession
          token={credentials.token}
          serverUrl={credentials.serverUrl}
          onConnected={() => setStage("connected")}
          onDisconnected={() => {
            if (leavingRef.current) return;
            setCredentials(null);
            setStage("disconnected");
            setError("The call disconnected. You can join again when you're ready.");
          }}
        />
      ) : null}

      {notice ? (
        <div className="flex justify-center" style={{ marginTop: 24 }}>
          <Note kind="success">{notice}</Note>
        </div>
      ) : null}
      {error ? (
        <div className="flex justify-center" style={{ marginTop: 24 }}>
          <Note kind="error">{error}</Note>
        </div>
      ) : null}

      <div style={{ height: 80 }} />
    </PageShell>
  );
}
