/**
 * Edge proxy: callsomeone.org -> Cloud Run (pickup-web / pickup-api).
 * Cloud Run accepts the *.run.app Host header; browsers see callsomeone.org.
 */
export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);
    const isApi = incoming.hostname === "api.callsomeone.org";
    const originHost = isApi ? env.API_ORIGIN : env.WEB_ORIGIN;

    const target = new URL(incoming);
    target.protocol = "https:";
    target.hostname = originHost;

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
