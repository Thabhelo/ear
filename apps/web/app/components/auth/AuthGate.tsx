"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { RETURN_URL_PARAM, redirectToSignIn, safeReturnUrl } from "../../lib/authRedirects";
import { useAuth } from "../../lib/useAuth";

/** Sends signed-in users away from auth pages; sends guests away from protected pages. */
export function AuthRedirectGate({
  mode,
  children,
  fallback = "/"
}: {
  mode: "guest-only" | "signed-in-only" | "host-only";
  children: ReactNode;
  fallback?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const auth = useAuth();

  useEffect(() => {
    if (auth.signedIn === null) return;

    if (mode === "guest-only" && auth.signedIn) {
      const returnUrl = safeReturnUrl(params.get(RETURN_URL_PARAM), fallback);
      router.replace(returnUrl);
      return;
    }

    if ((mode === "signed-in-only" || mode === "host-only") && !auth.signedIn) {
      const returnUrl = encodeURIComponent(
        typeof window !== "undefined" ? window.location.pathname : fallback
      );
      router.replace(`/sign-in?${RETURN_URL_PARAM}=${returnUrl}`);
      return;
    }

    if (
      mode === "host-only" &&
      auth.role !== null &&
      auth.role !== "host" &&
      auth.role !== "admin"
    ) {
      router.replace(fallback);
    }
  }, [auth.role, auth.signedIn, fallback, mode, params, router]);

  if (auth.signedIn === null || (mode === "host-only" && auth.signedIn && auth.role === null)) {
    return null;
  }

  if (mode === "guest-only" && auth.signedIn) {
    return null;
  }

  if ((mode === "signed-in-only" || mode === "host-only") && !auth.signedIn) {
    return null;
  }

  if (mode === "host-only" && auth.role !== "host" && auth.role !== "admin") {
    return null;
  }

  return children;
}

export { redirectToSignIn } from "../../lib/authRedirects";

/** Redirect guests to sign-in before continuing an action. */
export function useEnsureSignedIn(): {
  ready: boolean;
  signedIn: boolean;
  requireSignIn: () => boolean;
} {
  const auth = useAuth();

  function requireSignIn(): boolean {
    if (auth.signedIn) return true;
    if (auth.signedIn === null) return false;
    redirectToSignIn();
    return false;
  }

  return {
    ready: auth.signedIn !== null,
    signedIn: Boolean(auth.signedIn),
    requireSignIn
  };
}
