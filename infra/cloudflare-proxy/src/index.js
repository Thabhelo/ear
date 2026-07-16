/**
 * Edge proxy: callsomeone.org -> Cloud Run (callsomeone-web).
 * Cloud Run accepts the *.run.app Host header; browsers see callsomeone.org.
 *
 * The API now lives inside the web app under /api. Requests to the legacy
 * api.callsomeone.org host (e.g. Stripe webhooks configured before the
 * migration) are rewritten to the web origin with an /api path prefix.
 */
export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);

    if (incoming.hostname === "www.callsomeone.org") {
      const canonical = new URL(incoming);
      canonical.hostname = "callsomeone.org";
      canonical.protocol = "https:";
      return Response.redirect(canonical.toString(), 301);
    }

    const isApi = incoming.hostname === "api.callsomeone.org";
    const originHost = env.WEB_ORIGIN;

    const target = new URL(incoming);
    target.protocol = "https:";
    target.hostname = originHost;
    if (isApi && !target.pathname.startsWith("/api/")) {
      target.pathname = `/api${target.pathname}`;
    }

    const headers = new Headers(request.headers);
    headers.set("Host", originHost);
    headers.set("X-Forwarded-Host", incoming.hostname);
    headers.set("X-Forwarded-Proto", "https");

    return fetch(target.toString(), {
      method: request.method,
      headers,
      body: request.body,
      redirect: "manual",
    });
  },
};
