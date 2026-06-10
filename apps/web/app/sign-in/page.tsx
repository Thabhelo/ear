"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuthForm, AuthLink } from "../components/auth/AuthForm";
import { AuthRedirectGate } from "../components/auth/AuthGate";
import { PageHero, PageShell } from "../components/landing/PageShell";
import { buildAuthPath, RETURN_URL_PARAM, safeReturnUrl } from "../lib/authRedirects";
import { firebaseConfigured } from "../lib/firebase";
import { useAuth } from "../lib/useAuth";

function SignInContent() {
  const router = useRouter();
  const params = useSearchParams();
  const auth = useAuth();
  const returnUrl = safeReturnUrl(params.get(RETURN_URL_PARAM), "/start");

  async function finishSignIn() {
    router.replace(returnUrl);
  }

  if (!firebaseConfigured) {
    return (
      <p style={{ textAlign: "center", color: "rgba(0,0,0,0.55)" }}>
        Sign-in isn&apos;t configured for this environment yet.
      </p>
    );
  }

  return (
    <AuthRedirectGate mode="guest-only" fallback={returnUrl}>
      <AuthForm
        title="Welcome back."
        sub="Sign in to pick up where you left off — queue, payment, or your next call."
        submitLabel="Sign in"
        googleLabel="Continue with Google"
        alternate={
          <>
            New here?{" "}
            <AuthLink href={buildAuthPath("/sign-up", returnUrl)}>Create an account</AuthLink>
          </>
        }
        footer={
          <>
            <AuthLink href={buildAuthPath("/forgot-password", returnUrl)}>Forgot password?</AuthLink>
          </>
        }
        onSubmit={async ({ email, password }) => {
          await auth.signInWithEmail(email, password);
          await finishSignIn();
        }}
        onGoogle={async () => {
          const ok = await auth.signInWithGoogle();
          if (ok) await finishSignIn();
        }}
      />
    </AuthRedirectGate>
  );
}

export default function SignInPage() {
  return (
    <PageShell maxWidth={680}>
      <PageHero
        eyebrow="Sign in"
        title="Good to see you."
        sub="Use Google or your email — whichever you signed up with."
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Suspense>
          <SignInContent />
        </Suspense>
      </motion.div>
      <p style={{ textAlign: "center", marginTop: 24 }}>
        <Link href="/" style={{ fontSize: 13, color: "rgba(0,0,0,0.45)" }}>
          ← Back to home
        </Link>
      </p>
      <div style={{ height: 80 }} />
    </PageShell>
  );
}
