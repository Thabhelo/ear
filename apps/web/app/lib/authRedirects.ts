export const RETURN_URL_PARAM = "returnUrl";

/** Only allow same-origin relative paths (blocks open redirects). */
export function safeReturnUrl(value: string | null | undefined, fallback = "/"): string {
  if (!value) return fallback;
  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith("/") && !decoded.startsWith("//")) {
      return decoded;
    }
  } catch {
    /* ignore malformed values */
  }
  return fallback;
}

export function buildAuthPath(path: string, returnUrl?: string | null): string {
  const safe = safeReturnUrl(returnUrl, "");
  if (!safe || safe === "/") return path;
  return `${path}?${RETURN_URL_PARAM}=${encodeURIComponent(safe)}`;
}

export function currentReturnUrl(): string {
  if (typeof window === "undefined") return "/";
  return `${window.location.pathname}${window.location.search}`;
}

/** Send guests to sign-in, preserving where they were headed. */
export function redirectToSignIn(returnUrl?: string): void {
  const target = encodeURIComponent(returnUrl || currentReturnUrl());
  window.location.href = `/sign-in?${RETURN_URL_PARAM}=${target}`;
}

/** Routes that should send guests to sign-in first. */
export const PROTECTED_PATH_PREFIXES = ["/account", "/host"];

export function pathRequiresAuth(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
