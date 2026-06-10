"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../lib/api";
import { onFirebaseUserChanged, signInWithGoogle } from "../lib/firebase";

type QueueStatus = {
  session_id: string;
  status: string;
  position?: number;
  priority_score?: number;
};

export function QueueFlow() {
  const [sessionId, setSessionId] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userLabel, setUserLabel] = useState("");
  const [bid, setBid] = useState("0");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutSession = params.get("session") || window.localStorage.getItem("ear:lastSessionId") || "";
    setSessionId(checkoutSession);
    if (checkoutSession) {
      window.localStorage.setItem("ear:lastSessionId", checkoutSession);
    }
    if (params.get("preview")) {
      setStatus("Preview checkout complete. Join the queue to continue.");
    }
    return onFirebaseUserChanged((user) => {
      setIsSignedIn(Boolean(user));
      setUserLabel(user?.email || user?.displayName || "");
    });
  }, []);

  async function joinQueue() {
    if (!isSignedIn) {
      setError("Sign in with Firebase before joining the queue.");
      return;
    }
    setError("");
    setStatus("Joining queue...");
    try {
      const response = await apiPost<{ status: string }>("/queue/join", {
        session_id: sessionId,
        priority_bid_cents: Math.max(0, Math.round(Number(bid || "0") * 100))
      });
      setStatus(`Queue status: ${response.status}`);
      window.location.href = `/consent?session=${sessionId}`;
    } catch (queueError) {
      setStatus("");
      setError(queueError instanceof Error ? queueError.message : "Queue failed.");
    }
  }

  async function refreshStatus() {
    if (!isSignedIn) {
      setError("Sign in with Firebase before checking queue status.");
      return;
    }
    if (!sessionId) {
      setError("Enter a session ID first.");
      return;
    }
    setError("");
    try {
      const response = await apiGet<QueueStatus>(
        `/queue/status?session_id=${encodeURIComponent(sessionId)}`
      );
      setStatus(
        response.position
          ? `Position ${response.position}. Priority score ${response.priority_score}.`
          : `Session status: ${response.status}`
      );
    } catch (queueError) {
      setError(queueError instanceof Error ? queueError.message : "Status check failed.");
    }
  }

  return (
    <section className="flow">
      <div className="section-heading">
        <p className="eyebrow">Queue</p>
        <h1>Get matched to the host.</h1>
        <p className="lede">
          Priority is bid plus waiting-time bonus. Grace extensions stay
          discretionary and are never promised.
        </p>
      </div>

      <div className="card form-grid">
        <div className="status full">
          {isSignedIn ? `Signed in${userLabel ? ` as ${userLabel}` : ""}.` : "Sign in to continue."}
          {sessionId ? ` Session ${sessionId}.` : " No checkout session found yet."}
        </div>
        <label>
          Extra priority bid
          <input value={bid} onChange={(event) => setBid(event.target.value)} />
        </label>
        <div className="actions full">
          {!isSignedIn ? (
            <button type="button" className="secondary" onClick={signInWithGoogle}>
              Sign in with Google
            </button>
          ) : null}
          <button type="button" onClick={joinQueue}>
            Enter queue
          </button>
          <button type="button" className="secondary" onClick={refreshStatus}>
            Check status
          </button>
        </div>
      </div>

      {status ? <p className="status">{status}</p> : null}
      {error ? <p className="status error">{error}</p> : null}
    </section>
  );
}
