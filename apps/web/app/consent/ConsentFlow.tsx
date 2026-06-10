"use client";

import { useEffect, useState } from "react";
import { apiPost } from "../lib/api";
import { onFirebaseUserChanged, signInWithGoogle } from "../lib/firebase";

export function ConsentFlow() {
  const [sessionId, setSessionId] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userLabel, setUserLabel] = useState("");
  const [recording, setRecording] = useState(false);
  const [terms, setTerms] = useState(false);
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

  async function submitConsent() {
    if (!isSignedIn) {
      setError("Sign in with Firebase before joining a call.");
      return;
    }
    setError("");
    setStatus("Recording consent...");
    try {
      await apiPost("/calls/consent", {
        session_id: sessionId,
        recording_consented: recording,
        terms_consented: terms
      });
      window.location.href = `/call?session=${sessionId}`;
    } catch (consentError) {
      setStatus("");
      setError(consentError instanceof Error ? consentError.message : "Consent failed.");
    }
  }

  return (
    <section className="flow">
      <div className="section-heading">
        <p className="eyebrow">Consent</p>
        <h1>No consent, no call.</h1>
        <p className="lede">
          This call is recorded for safety, quality assurance, and dispute
          resolution. By joining, you consent to being recorded.
        </p>
      </div>

      <div className="card form-grid">
        <div className="status full">
          {isSignedIn ? `Signed in${userLabel ? ` as ${userLabel}` : ""}.` : "Sign in to continue."}
          {sessionId ? ` Session ${sessionId}.` : " No checkout session found yet."}
        </div>
        <label className="full checkbox">
          <input
            type="checkbox"
            checked={recording}
            onChange={(event) => setRecording(event.target.checked)}
          />
          I consent to call recording.
        </label>
        <label className="full checkbox">
          <input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} />
          I understand Ear is not dating, therapy, crisis counseling, medical
          advice, or emergency services.
        </label>
        <div className="actions full">
          {!isSignedIn ? (
            <button type="button" className="secondary" onClick={signInWithGoogle}>
              Sign in with Google
            </button>
          ) : null}
          <button type="button" onClick={submitConsent}>
            Join call room
          </button>
        </div>
      </div>

      {status ? <p className="status">{status}</p> : null}
      {error ? <p className="status error">{error}</p> : null}
    </section>
  );
}
