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

function SignUpContent() {
  const router = useRouter();
  const params = useSearchParams();
  const auth = useAuth();
  const returnUrl = safeReturnUrl(params.get(RETURN_URL_PARAM), "/start");

  async function finishSignUp() {
    router.replace(returnUrl);
  }

  if (!firebaseConfigured) {
    return (
      <p style={{ textAlign: "center", color: "rgba(0,0,0,0.55)" }}>
        Sign-up isn&apos;t configured for this environment yet.
      </p>
    );
  }

  return (
    <AuthRedirectGate mode="guest-only" fallback={returnUrl}>
      <AuthForm
        title="Create your account."
        sub="One account for sessions, queue, and calls. Google or email, your choice."
        submitLabel="Create account"
        showName
        googleLabel="Sign up with Google"
        alternate={
          <>
            Already have an account?{" "}
            <AuthLink href={buildAuthPath("/sign-in", returnUrl)}>Sign in</AuthLink>
          </>
        }
        onSubmit={async ({ email, password, name }) => {
          await auth.signUpWithEmail(email, password, name);
          await finishSignUp();
        }}
        onGoogle={async () => {
          const ok = await auth.signInWithGoogle();
          if (ok) await finishSignUp();
        }}
      />
    </AuthRedirectGate>
  );
}

export default function SignUpPage() {
  return (
    <PageShell maxWidth={680}>
      <PageHero
        eyebrow="Sign up"
        title="Join Ear."
        sub="Takes under a minute. No spam, just a way to save your place in line."
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Suspense>
          <SignUpContent />
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
