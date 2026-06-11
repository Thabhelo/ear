"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import MagneticButton from "../../components/landing/MagneticButton";
import { Note, PageHero, PageShell, Surface, fontBody, fontHeading } from "../../components/landing/PageShell";
import { AuthLink } from "../../components/auth/AuthForm";
import { friendlyAuthError } from "../../lib/authErrors";
import {
  applyAuthActionCode,
  completePasswordReset,
  firebaseConfigured,
  verifyResetCode
} from "../../lib/firebase";

type Phase = "checking" | "reset" | "done" | "failed";

const inputStyle: React.CSSProperties = {
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
};

function copyFor(mode: string, phase: Phase, email: string) {
  if (phase === "failed") {
    return { title: "That link didn't work.", sub: "It may be expired or already used." };
  }
  switch (mode) {
    case "resetPassword":
      return phase === "done"
        ? { title: "Password updated.", sub: "You can sign in with your new password now." }
        : {
            title: "Choose a new password.",
            sub: email ? `For ${email}.` : "Almost there."
          };
    case "verifyEmail":
      return phase === "done"
        ? { title: "Email verified.", sub: "You're all set." }
        : { title: "Verifying your email…", sub: "One moment." };
    case "recoverEmail":
      return phase === "done"
        ? { title: "Email restored.", sub: "Your previous sign-in email is back. Consider resetting your password too." }
        : { title: "Restoring your email…", sub: "One moment." };
    default:
      return { title: "One moment…", sub: "Checking your link." };
  }
}

function AuthActionFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") ?? "";
  const oobCode = params.get("oobCode") ?? "";
  const continueUrl = params.get("continueUrl") ?? "";

  const [phase, setPhase] = useState<Phase>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!firebaseConfigured) return;
    if (!mode || !oobCode) {
      setPhase("failed");
      setError("This link is incomplete. Open it straight from the email we sent you.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        if (mode === "resetPassword") {
          const accountEmail = await verifyResetCode(oobCode);
          if (!cancelled) {
            setEmail(accountEmail);
            setPhase("reset");
          }
        } else if (mode === "verifyEmail" || mode === "recoverEmail") {
          await applyAuthActionCode(oobCode);
          if (!cancelled) setPhase("done");
        } else {
          if (!cancelled) {
            setPhase("failed");
            setError("We don't recognize this link. Request a new one and try again.");
          }
        }
      } catch (e) {
        if (!cancelled) {
          setPhase("failed");
          setError(friendlyAuthError(e));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, oobCode]);

  async function handleReset(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await completePasswordReset(oobCode, password);
      setPhase("done");
    } catch (e) {
      setError(friendlyAuthError(e));
    } finally {
      setBusy(false);
    }
  }

  const { title, sub } = copyFor(mode, phase, email);
  const signInHref = continueUrl ? `/sign-in?next=${encodeURIComponent(continueUrl)}` : "/sign-in";

  return (
    <PageShell maxWidth={680}>
      <PageHero eyebrow="Account" title={title} sub={sub} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Surface style={{ padding: 34, maxWidth: 440, margin: "0 auto" }}>
          {!firebaseConfigured ? (
            <p style={{ textAlign: "center", color: "rgba(0,0,0,0.55)" }}>
              This isn&apos;t configured for this environment yet.
            </p>
          ) : phase === "checking" ? (
            <p
              style={{
                fontFamily: fontBody,
                fontSize: 15,
                lineHeight: 1.65,
                color: "rgba(0,0,0,0.6)",
                textAlign: "center",
                margin: 0
              }}
            >
              Checking your link…
            </p>
          ) : phase === "reset" ? (
            <form ref={formRef} onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                  New password
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={inputStyle}
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
                {busy ? "One moment…" : "Save new password"}
                {busy ? null : <ArrowRight size={15} />}
              </MagneticButton>
            </form>
          ) : phase === "done" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <Note kind="success">All done</Note>
              <MagneticButton
                circleColor="rgba(255,255,255,0.15)"
                circleSize={220}
                onClick={() => router.push(signInHref)}
                style={{
                  justifyContent: "center",
                  borderRadius: 9999,
                  background: "#111111",
                  color: "#FFFFFF",
                  border: "none",
                  fontFamily: fontHeading,
                  fontSize: 15,
                  fontWeight: 500,
                  padding: "14px 28px"
                }}
              >
                Continue to sign in
                <ArrowRight size={15} />
              </MagneticButton>
            </div>
          ) : (
            <p
              style={{
                fontFamily: fontBody,
                fontSize: 15,
                lineHeight: 1.65,
                color: "rgba(0,0,0,0.6)",
                textAlign: "center",
                margin: 0
              }}
            >
              Head back to{" "}
              <AuthLink href="/forgot-password">reset your password</AuthLink> to get a fresh link.
            </p>
          )}

          {error ? (
            <div className="flex justify-center" style={{ marginTop: 20 }}>
              <Note kind="error">{error}</Note>
            </div>
          ) : null}
        </Surface>
      </motion.div>

      <p style={{ textAlign: "center", marginTop: 24, fontFamily: fontBody, fontSize: 13 }}>
        <AuthLink href="/sign-in">← Back to sign in</AuthLink>
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

export default function AuthActionPage() {
  return (
    <Suspense fallback={null}>
      <AuthActionFlow />
    </Suspense>
  );
}
