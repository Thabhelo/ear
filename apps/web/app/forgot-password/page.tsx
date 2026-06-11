"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import MagneticButton from "../components/landing/MagneticButton";
import { Note, PageHero, PageShell, Surface, fontBody, fontHeading } from "../components/landing/PageShell";
import { AuthLink } from "../components/auth/AuthForm";
import { buildAuthPath } from "../lib/authRedirects";
import { friendlyAuthError } from "../lib/authErrors";
import { firebaseConfigured, sendPasswordReset } from "../lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (e) {
      setError(friendlyAuthError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell maxWidth={680}>
      <PageHero
        eyebrow="Password"
        title="Reset your password."
        sub="We'll email you a link. It expires after a while, so use it soon."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Surface style={{ padding: 34, maxWidth: 440, margin: "0 auto" }}>
          {!firebaseConfigured ? (
            <p style={{ textAlign: "center", color: "rgba(0,0,0,0.55)" }}>
              Password reset isn&apos;t configured for this environment yet.
            </p>
          ) : sent ? (
            <>
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: 15,
                  lineHeight: 1.65,
                  color: "rgba(0,0,0,0.6)",
                  textAlign: "center",
                  margin: "0 0 16px"
                }}
              >
                If an account exists for <strong>{email}</strong>, we sent a reset link. Check your
                inbox and spam folder.
              </p>
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: "rgba(0,0,0,0.45)",
                  textAlign: "center",
                  margin: "0 0 20px"
                }}
              >
                Signed up with Google? Those accounts don&apos;t have a password, so no email will
                arrive. Just choose Continue with Google on the sign-in page.
              </p>
              <Note kind="success">Email sent</Note>
            </>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <label>
                <span
                  style={{
                    display: "block",
                    fontFamily: fontBody,
                    fontSize: 13,
                    color: "rgba(0,0,0,0.55)",
                    marginBottom: 8
                  }}
                >
                  Email
                </span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    height: 46,
                    padding: "0 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "rgba(255,255,255,0.95)",
                    fontFamily: fontBody,
                    fontSize: 14,
                    color: "#111111",
                    outline: "none"
                  }}
                />
              </label>

              <MagneticButton
                circleColor="rgba(255,255,255,0.15)"
                circleSize={220}
                onClick={() => formRef.current?.requestSubmit()}
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
                  padding: "14px 24px",
                  cursor: busy ? "wait" : "pointer",
                  opacity: busy ? 0.7 : 1
                }}
              >
                {busy ? "One moment…" : "Send reset link"}
                {busy ? null : <ArrowRight size={15} />}
              </MagneticButton>
            </form>
          )}

          {error ? (
            <div className="flex justify-center" style={{ marginTop: 20 }}>
              <Note kind="error">{error}</Note>
            </div>
          ) : null}
        </Surface>
      </motion.div>

      <p style={{ textAlign: "center", marginTop: 24, fontFamily: fontBody, fontSize: 13 }}>
        <AuthLink href={buildAuthPath("/sign-in")}>← Back to sign in</AuthLink>
      </p>
      <p style={{ textAlign: "center", marginTop: 12 }}>
        <Link href="/" style={{ fontSize: 13, color: "rgba(0,0,0,0.45)" }}>
          Home
        </Link>
      </p>
      <div style={{ height: 80 }} />
    </PageShell>
  );
}
