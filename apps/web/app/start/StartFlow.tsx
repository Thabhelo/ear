"use client";

import { useEffect, useMemo, useState } from "react";
import { apiPost } from "../lib/api";
import { modes, oneOffs, subscriptions } from "../lib/catalog";
import {
  firebaseConfigured,
  onFirebaseUserChanged,
  signInWithGoogle,
  signOutCurrentUser
} from "../lib/firebase";

type CheckoutResponse = {
  checkout_url: string;
  session_id: string;
  configured: boolean;
};

export function StartFlow() {
  const [mode, setMode] = useState("just_listen");
  const [product, setProduct] = useState("quick_call");
  const [plan, setPlan] = useState("");
  const [userLabel, setUserLabel] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [bid, setBid] = useState("0");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMode(params.get("mode") || "just_listen");
    setProduct(params.get("product") || "quick_call");
    setPlan(params.get("plan") || "");
    return onFirebaseUserChanged((user) => {
      setIsSignedIn(Boolean(user));
      setUserLabel(user?.email || user?.displayName || "");
    });
  }, []);

  const selectedProduct = useMemo(
    () => oneOffs.find((item) => item.id === product),
    [product]
  );

  async function startOneOff() {
    if (!isSignedIn) {
      setError("Sign in with Firebase before checkout.");
      return;
    }
    setError("");
    setStatus("Creating checkout...");
    try {
      const response = await apiPost<CheckoutResponse>("/checkout/one-off", {
        mode,
        product,
        priority_bid_cents: Math.max(0, Math.round(Number(bid || "0") * 100))
      });
      window.localStorage.setItem("ear:lastSessionId", response.session_id);
      window.location.href = response.checkout_url;
    } catch (checkoutError) {
      setStatus("");
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout failed.");
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setStatus("Opening Firebase sign-in...");
    try {
      const user = await signInWithGoogle();
      if (!user) {
        setStatus("Firebase web config is not installed yet.");
        return;
      }
      setStatus(`Signed in as ${user.email || user.uid}.`);
    } catch (authError) {
      setStatus("");
      setError(authError instanceof Error ? authError.message : "Firebase sign-in failed.");
    }
  }

  async function startSubscription() {
    if (!isSignedIn) {
      setError("Sign in with Firebase before subscribing.");
      return;
    }
    if (!plan) {
      setError("Choose a subscription plan first.");
      return;
    }
    setError("");
    setStatus("Creating subscription checkout...");
    try {
      const response = await apiPost<CheckoutResponse>("/checkout/subscription", {
        plan
      });
      window.location.href = response.checkout_url;
    } catch (checkoutError) {
      setStatus("");
      setError(checkoutError instanceof Error ? checkoutError.message : "Subscription failed.");
    }
  }

  return (
    <section className="flow">
      <div className="section-heading">
        <p className="eyebrow">Start</p>
        <h1>Pick your mode, then pay.</h1>
        <p className="lede">
          Sign-in is backed by Firebase. Payments are routed through Stripe. In
          preview mode, missing provider secrets send you into the queue flow so
          the product can still be tested.
        </p>
      </div>

      <div className="card">
        <div className="form-grid">
          <div className="status full">
            Firebase Auth:{" "}
            {isSignedIn
              ? `signed in${userLabel ? ` as ${userLabel}` : ""}`
              : firebaseConfigured
                ? "ready, sign in to continue"
                : "waiting for web app config"}
            .
          </div>

          <label>
            Mode
            <select value={mode} onChange={(event) => setMode(event.target.value)}>
              {modes.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            One-off
            <select value={product} onChange={(event) => setProduct(event.target.value)}>
              {oneOffs.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name} - {item.price}
                </option>
              ))}
            </select>
          </label>

          <label>
            Priority bid
            <input
              inputMode="decimal"
              value={bid}
              onChange={(event) => setBid(event.target.value)}
              placeholder="0"
            />
          </label>

          <div className="status full">
            {selectedProduct?.name}: {selectedProduct?.detail}. Higher bids move
            ahead in the queue, with waiting-time bonus preventing starvation.
          </div>
        </div>

        <div className="actions">
          {isSignedIn ? (
            <button type="button" className="secondary" onClick={signOutCurrentUser}>
              Sign out
            </button>
          ) : (
            <button type="button" className="secondary" onClick={handleGoogleSignIn}>
              Sign in with Google
            </button>
          )}
          <button type="button" onClick={startOneOff}>
            Continue to Stripe
          </button>
          <a className="secondary" href="/queue">
            I already paid
          </a>
        </div>
      </div>

      <section id="subscriptions">
        <div className="section-heading">
          <p className="eyebrow">Access</p>
          <h2>Or subscribe for ongoing access.</h2>
        </div>
        <div className="grid">
          {subscriptions.map((item) => (
            <button
              type="button"
              className={`card clickable ${plan === item.id ? "selected" : ""}`}
              onClick={() => setPlan(item.id)}
              key={item.id}
            >
              <h3>{item.name}</h3>
              <strong>{item.price}</strong>
              <p>{item.detail}</p>
            </button>
          ))}
        </div>
        <div className="actions">
          <button type="button" onClick={startSubscription}>
            Subscribe with Stripe
          </button>
        </div>
      </section>

      {status ? <p className="status">{status}</p> : null}
      {error ? <p className="status error">{error}</p> : null}
    </section>
  );
}
