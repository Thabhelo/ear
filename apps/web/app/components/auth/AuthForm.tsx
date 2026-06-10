"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FormEvent, ReactNode, useRef, useState } from "react";
import MagneticButton from "../landing/MagneticButton";
import { Note, Surface, fontBody, fontHeading } from "../landing/PageShell";
import { friendlyAuthError } from "../../lib/authErrors";

const inputStyle = {
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
} as const;

const labelStyle = {
  display: "block",
  fontFamily: fontBody,
  fontSize: 13,
  color: "rgba(0,0,0,0.55)",
  marginBottom: 8
} as const;

type AuthFormProps = {
  title: string;
  sub: string;
  submitLabel: string;
  alternate?: ReactNode;
  footer?: ReactNode;
  showName?: boolean;
  onSubmit: (values: { email: string; password: string; name?: string }) => Promise<void>;
  onGoogle: () => Promise<void>;
  googleLabel?: string;
};

export function AuthForm({
  title,
  sub,
  submitLabel,
  alternate,
  footer,
  showName,
  onSubmit,
  onGoogle,
  googleLabel = "Continue with Google"
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onSubmit({ email, password, name: name.trim() || undefined });
    } catch (e) {
      setError(friendlyAuthError(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setBusy(true);
    try {
      await onGoogle();
    } catch (e) {
      setError(friendlyAuthError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Surface style={{ padding: 34, maxWidth: 440, margin: "0 auto" }}>
      <h2
        style={{
          fontFamily: fontHeading,
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: "-0.8px",
          color: "#111111",
          margin: "0 0 8px",
          textAlign: "center"
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontFamily: fontBody,
          fontSize: 14,
          lineHeight: 1.6,
          color: "rgba(0,0,0,0.55)",
          margin: "0 0 28px",
          textAlign: "center"
        }}
      >
        {sub}
      </p>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        {showName ? (
          <label>
            <span style={labelStyle}>Name</span>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
              style={inputStyle}
            />
          </label>
        ) : null}

        <label>
          <span style={labelStyle}>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />
        </label>

        <label>
          <span style={labelStyle}>Password</span>
          <input
            type="password"
            autoComplete={showName ? "new-password" : "current-password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={showName ? "At least 6 characters" : "Your password"}
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
            opacity: busy ? 0.7 : 1,
            marginTop: 4
          }}
        >
          {busy ? "One moment…" : submitLabel}
          {busy ? null : <ArrowRight size={15} />}
        </MagneticButton>
      </form>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "22px 0"
        }}
      >
        <span style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
        <span style={{ fontFamily: fontBody, fontSize: 12, color: "rgba(0,0,0,0.4)" }}>or</span>
        <span style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={handleGoogle}
        style={{
          width: "100%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          borderRadius: 9999,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "rgba(255,255,255,0.9)",
          color: "#111111",
          fontFamily: fontBody,
          fontSize: 14,
          fontWeight: 500,
          padding: "13px 20px",
          cursor: busy ? "wait" : "pointer"
        }}
      >
        {googleLabel}
      </button>

      {alternate ? (
        <p
          style={{
            textAlign: "center",
            fontFamily: fontBody,
            fontSize: 13,
            color: "rgba(0,0,0,0.5)",
            margin: "20px 0 0"
          }}
        >
          {alternate}
        </p>
      ) : null}

      {footer ? (
        <p
          style={{
            textAlign: "center",
            fontFamily: fontBody,
            fontSize: 13,
            color: "rgba(0,0,0,0.45)",
            margin: "16px 0 0"
          }}
        >
          {footer}
        </p>
      ) : null}

      {error ? (
        <div className="flex justify-center" style={{ marginTop: 20 }}>
          <Note kind="error">{error}</Note>
        </div>
      ) : null}
    </Surface>
  );
}

export function AuthLink({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} style={{ color: "#111111", fontWeight: 500, textDecoration: "underline" }}>
      {children}
    </Link>
  );
}
