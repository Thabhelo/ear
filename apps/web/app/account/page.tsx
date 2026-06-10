"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { FormEvent, useRef, useState } from "react";
import { AuthRedirectGate } from "../components/auth/AuthGate";
import MagneticButton from "../components/landing/MagneticButton";
import {
  Note,
  PageHero,
  PageShell,
  Surface,
  fontBody,
  fontHeading
} from "../components/landing/PageShell";
import { friendlyAuthError } from "../lib/authErrors";
import {
  changeAccountPassword,
  firebaseConfigured,
  linkPasswordToAccount
} from "../lib/firebase";
import { useAuth } from "../lib/useAuth";

function providerLabel(id: string): string {
  if (id === "google.com") return "Google";
  if (id === "password") return "Email & password";
  return id;
}

function AccountContent() {
  const auth = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (newPassword.length < 6) {
      setError("Choose a password with at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    setBusy(true);
    try {
      if (auth.hasPassword) {
        await changeAccountPassword(currentPassword, newPassword);
        setNotice("Password updated.");
        setCurrentPassword("");
      } else if (auth.email) {
        await linkPasswordToAccount(auth.email, newPassword);
        setNotice("Password added. You can now sign in with email too.");
      } else {
        setError("We need an email on your account before you can set a password.");
      }
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setError(friendlyAuthError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthRedirectGate mode="signed-in-only">
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 520, margin: "0 auto" }}>
        <Surface style={{ padding: 28 }}>
          <p style={{ fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.45)", margin: "0 0 6px" }}>
            Signed in as
          </p>
          <p
            style={{
              fontFamily: fontHeading,
              fontSize: 22,
              fontWeight: 400,
              color: "#111111",
              margin: "0 0 4px"
            }}
          >
            {auth.label || "Your account"}
          </p>
          {auth.email ? (
            <p style={{ fontFamily: fontBody, fontSize: 14, color: "rgba(0,0,0,0.55)", margin: 0 }}>
              {auth.email}
            </p>
          ) : null}

          <div style={{ marginTop: 22 }}>
            <p style={{ fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.45)", margin: "0 0 10px" }}>
              Sign-in methods
            </p>
            <div className="flex flex-wrap" style={{ gap: 8 }}>
              {(auth.providers.length ? auth.providers : auth.usesGoogle ? ["google.com"] : []).map(
                (provider) => (
                  <span
                    key={provider}
                    style={{
                      display: "inline-flex",
                      padding: "6px 12px",
                      borderRadius: 9999,
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: "rgba(255,255,255,0.9)",
                      fontFamily: fontBody,
                      fontSize: 12.5,
                      color: "rgba(0,0,0,0.65)"
                    }}
                  >
                    {providerLabel(provider)}
                  </span>
                )
              )}
            </div>
          </div>
        </Surface>

        {firebaseConfigured ? (
          <Surface style={{ padding: 28 }}>
            <h3
              style={{
                fontFamily: fontHeading,
                fontSize: 20,
                fontWeight: 400,
                color: "#111111",
                margin: "0 0 8px"
              }}
            >
              {auth.hasPassword ? "Change password" : "Add a password"}
            </h3>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(0,0,0,0.55)",
                margin: "0 0 20px"
              }}
            >
              {auth.hasPassword
                ? "Update the password you use with email sign-in."
                : auth.usesGoogle
                  ? "You signed up with Google. That's still your main way in. Add a password only if you want email sign-in too."
                  : "Set a password for email sign-in."}
            </p>

            <form
              ref={formRef}
              onSubmit={handlePasswordSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              {auth.hasPassword ? (
                <label>
                  <span style={{ display: "block", fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.55)", marginBottom: 8 }}>
                    Current password
                  </span>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={{
                      width: "100%",
                      height: 44,
                      padding: "0 14px",
                      borderRadius: 12,
                      border: "1px solid rgba(0,0,0,0.12)",
                      background: "rgba(255,255,255,0.95)",
                      fontFamily: fontBody,
                      fontSize: 14
                    }}
                  />
                </label>
              ) : null}

              <label>
                <span style={{ display: "block", fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.55)", marginBottom: 8 }}>
                  {auth.hasPassword ? "New password" : "Password"}
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: "100%",
                    height: 44,
                    padding: "0 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "rgba(255,255,255,0.95)",
                    fontFamily: fontBody,
                    fontSize: 14
                  }}
                />
              </label>

              <label>
                <span style={{ display: "block", fontFamily: fontBody, fontSize: 13, color: "rgba(0,0,0,0.55)", marginBottom: 8 }}>
                  Confirm password
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: "100%",
                    height: 44,
                    padding: "0 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "rgba(255,255,255,0.95)",
                    fontFamily: fontBody,
                    fontSize: 14
                  }}
                />
              </label>

              <MagneticButton
                circleColor="rgba(255,255,255,0.15)"
                circleSize={220}
                onClick={() => formRef.current?.requestSubmit()}
                style={{
                  alignSelf: "flex-start",
                  borderRadius: 9999,
                  background: "#111111",
                  color: "#FFFFFF",
                  border: "none",
                  fontFamily: fontHeading,
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "12px 22px",
                  cursor: busy ? "wait" : "pointer",
                  opacity: busy ? 0.7 : 1,
                  marginTop: 4
                }}
              >
                {busy ? "Saving…" : auth.hasPassword ? "Update password" : "Add password"}
                {busy ? null : <ArrowRight size={14} />}
              </MagneticButton>
            </form>

            {notice ? (
              <div style={{ marginTop: 16 }}>
                <Note kind="success">{notice}</Note>
              </div>
            ) : null}
            {error ? (
              <div style={{ marginTop: 16 }}>
                <Note kind="error">{error}</Note>
              </div>
            ) : null}
          </Surface>
        ) : null}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={async () => {
              await auth.signOut();
              window.location.href = "/";
            }}
            style={{
              border: "none",
              background: "transparent",
              fontFamily: fontBody,
              fontSize: 13,
              color: "#D6455D",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </AuthRedirectGate>
  );
}

export default function AccountPage() {
  return (
    <PageShell maxWidth={680}>
      <PageHero
        eyebrow="Account"
        title="Your settings."
        sub="Manage how you sign in. Nothing fancy, just what you need."
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Suspense>
          <AccountContent />
        </Suspense>
      </motion.div>
      <p style={{ textAlign: "center", marginTop: 24 }}>
        <Link href="/start" style={{ fontSize: 13, color: "rgba(0,0,0,0.45)" }}>
          ← Back to start
        </Link>
      </p>
      <div style={{ height: 80 }} />
    </PageShell>
  );
}
