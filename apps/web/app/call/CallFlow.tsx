"use client";

import { useEffect, useState } from "react";
import { apiPost } from "../lib/api";
import { onFirebaseUserChanged, signInWithGoogle } from "../lib/firebase";

export function CallFlow() {
  const [sessionId, setSessionId] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userLabel, setUserLabel] = useState("");
  const [room, setRoom] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutSession = params.get("session") || window.localStorage.getItem("ear:lastSessionId") || "";
    setSessionId(checkoutSession);
    return onFirebaseUserChanged((user) => {
      setIsSignedIn(Boolean(user));
      setUserLabel(user?.email || user?.displayName || "");
    });
  }, []);

  async function createRoom() {
    if (!isSignedIn) {
      setError("Sign in with Firebase before creating a call room.");
      return;
    }
    setError("");
    setStatus("Creating call room...");
    try {
      const response = await apiPost<{ room: { room_name: string; join_url: string; configured: boolean } }>(
        "/calls/create-room",
        {
          session_id: sessionId,
          consent_given: true
        }
      );
      setRoom(response.room.room_name);
      setStatus(
        response.room.configured
          ? `Room ready: ${response.room.room_name}`
          : `Room placeholder ready: ${response.room.room_name}. Add LiveKit secrets for real tokens.`
      );
    } catch (callError) {
      setStatus("");
      setError(callError instanceof Error ? callError.message : "Room creation failed.");
    }
  }

  async function endCall(endedBy: "host" | "user") {
    if (!isSignedIn) {
      setError("Sign in with Firebase before ending a call.");
      return;
    }
    setError("");
    try {
      await apiPost("/calls/end", {
        session_id: sessionId,
        ended_by: endedBy,
        reason: endedBy === "host" ? "panic_end" : "user_exit",
        refund_requested: false
      });
      setStatus(`Call ended by ${endedBy}.`);
    } catch (callError) {
      setError(callError instanceof Error ? callError.message : "End call failed.");
    }
  }

  async function saveRecording() {
    if (!isSignedIn) {
      setError("Sign in with Firebase before saving recording metadata.");
      return;
    }
    setError("");
    try {
      await apiPost("/recordings/webhook", {
        session_id: sessionId,
        provider_recording_id: room || "manual",
        duration_seconds: 0
      });
      setStatus("Recording metadata stored.");
    } catch (recordingError) {
      setError(recordingError instanceof Error ? recordingError.message : "Recording failed.");
    }
  }

  async function report() {
    if (!isSignedIn) {
      setError("Sign in with Firebase before submitting a report.");
      return;
    }
    setError("");
    try {
      await apiPost("/reports", {
        session_id: sessionId,
        reason: "user_report",
        details: "Reported from call page."
      });
      setStatus("Report submitted.");
    } catch (reportError) {
      setError(reportError instanceof Error ? reportError.message : "Report failed.");
    }
  }

  return (
    <section className="flow">
      <div className="section-heading">
        <p className="eyebrow">Call</p>
        <h1>Stay inside the platform.</h1>
        <p className="lede">
          No personal phone number, Instagram, email, WhatsApp, or off-platform
          handoff. Both sides can leave any time.
        </p>
      </div>

      <div className="card form-grid">
        <div className="status full">
          {isSignedIn ? `Signed in${userLabel ? ` as ${userLabel}` : ""}.` : "Sign in to continue."}
          {sessionId ? ` Session ${sessionId}.` : " No checkout session found yet."}
        </div>
        <div className="actions full">
          {!isSignedIn ? (
            <button type="button" className="secondary" onClick={signInWithGoogle}>
              Sign in with Google
            </button>
          ) : null}
          <button type="button" onClick={createRoom}>
            Create LiveKit room
          </button>
          <button type="button" className="secondary" onClick={() => endCall("user")}>
            Leave call
          </button>
          <button type="button" className="secondary" onClick={() => endCall("host")}>
            Panic end
          </button>
          <button type="button" className="secondary" onClick={saveRecording}>
            Save recording
          </button>
          <button type="button" className="secondary" onClick={report}>
            Rate/report
          </button>
        </div>
      </div>

      {status ? <p className="status">{status}</p> : null}
      {error ? <p className="status error">{error}</p> : null}
    </section>
  );
}
