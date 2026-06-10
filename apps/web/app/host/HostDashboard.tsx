"use client";

import { motion } from "framer-motion";
import { Gavel, RefreshCw, Users } from "lucide-react";
import { useState } from "react";
import { AuthRedirectGate } from "../components/auth/AuthGate";
import {
  Chip,
  Note,
  PageHero,
  PageShell,
  Surface,
  fontBody,
  fontHeading
} from "../components/landing/PageShell";
import { apiGet, apiPost } from "../lib/api";

type QueueEntry = {
  id: string;
  user_id: string;
  session_id: string;
  mode: string;
  priority_score: number;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.9)",
  fontFamily: fontBody,
  fontSize: 14,
  color: "#111111",
  outline: "none"
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: fontBody,
  fontSize: 12.5,
  color: "rgba(0,0,0,0.45)",
  marginBottom: 6
};

export function HostDashboard() {
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [note, setNote] = useState("Available");
  const [userId, setUserId] = useState("");
  const [banId, setBanId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function run(action: () => Promise<void>) {
    setError("");
    setStatus("");
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    }
  }

  const loadQueue = () =>
    run(async () => {
      const response = await apiGet<{ entries: QueueEntry[] }>("/queue/list");
      setEntries(response.entries);
      setLoaded(true);
      setStatus(`${response.entries.length} ${response.entries.length === 1 ? "person" : "people"} in line.`);
    });

  const updateStatus = (next: boolean) =>
    run(async () => {
      await apiPost("/host/status", {
        available: next,
        note,
        energy: next ? "available" : "offline"
      });
      setAvailable(next);
      setStatus(next ? "You're live. The queue can reach you." : "You're offline.");
    });

  const ban = (type: "standard" | "extreme") =>
    run(async () => {
      const response = await apiPost<{ id: string }>("/ban", {
        user_id: userId,
        ban_type: type,
        reason: type === "extreme" ? "Extreme misconduct" : "Boundary violation"
      });
      setBanId(response.id);
      setStatus(`${type === "extreme" ? "Permanent" : "Standard"} ban created (${response.id}).`);
    });

  const appeal = () =>
    run(async () => {
      await apiPost("/ban-appeal", {
        user_id: userId,
        ban_id: banId,
        statement: "Manual review requested."
      });
      setStatus("Appeal review created.");
    });

  return (
    <AuthRedirectGate mode="signed-in-only">
    <PageShell maxWidth={920}>
      <PageHero
        eyebrow="Host console"
        title="Run the room."
        sub="Availability, the live queue, and moderation, all in one place."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Availability */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Surface style={{ padding: 28 }}>
            <h3 style={{ fontFamily: fontHeading, fontSize: 18, fontWeight: 450, color: "#111111", margin: "0 0 16px" }}>
              Availability
            </h3>
            <div className="flex items-center" style={{ gap: 12, flexWrap: "wrap" }}>
              <Chip label="Available" selected={available === true} onClick={() => updateStatus(true)} size="lg" />
              <Chip label="Offline" selected={available === false} onClick={() => updateStatus(false)} size="lg" />
              <div style={{ flexGrow: 1, minWidth: 220 }}>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Status note"
                  style={inputStyle}
                />
              </div>
            </div>
          </Surface>
        </motion.div>

        {/* Queue */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }}>
          <Surface style={{ padding: 28 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
              <h3
                className="flex items-center"
                style={{ gap: 8, fontFamily: fontHeading, fontSize: 18, fontWeight: 450, color: "#111111", margin: 0 }}
              >
                <Users size={17} /> Live queue
              </h3>
              <button
                type="button"
                onClick={loadQueue}
                className="inline-flex items-center"
                style={{
                  gap: 7,
                  borderRadius: 9999,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.9)",
                  fontFamily: fontBody,
                  fontSize: 13,
                  color: "#111111",
                  padding: "9px 16px",
                  cursor: "pointer"
                }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            {entries.length === 0 ? (
              <p style={{ fontFamily: fontBody, fontSize: 14, color: "rgba(0,0,0,0.45)", margin: 0 }}>
                {loaded ? "Queue is empty right now." : "Refresh to load the queue."}
              </p>
            ) : (
              <div className="k-grid k-grid-2">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      borderRadius: 16,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "rgba(255,255,255,0.9)",
                      padding: "16px 18px"
                    }}
                  >
                    <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                      <span style={{ fontFamily: fontHeading, fontSize: 15, fontWeight: 500, color: "#111111" }}>
                        {entry.mode.replace(/_/g, " ")}
                      </span>
                      <span
                        style={{
                          fontFamily: fontBody,
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#B3402A",
                          background: "rgba(232,100,42,0.1)",
                          borderRadius: 9999,
                          padding: "3px 10px"
                        }}
                      >
                        score {entry.priority_score}
                      </span>
                    </div>
                    <p style={{ fontFamily: fontBody, fontSize: 12.5, color: "rgba(0,0,0,0.5)", margin: 0 }}>
                      user {entry.user_id}
                      <br />
                      session {entry.session_id}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Surface>
        </motion.div>

        {/* Moderation */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.16 }}>
          <Surface style={{ padding: 28 }}>
            <h3
              className="flex items-center"
              style={{ gap: 8, fontFamily: fontHeading, fontSize: 18, fontWeight: 450, color: "#111111", margin: "0 0 16px" }}
            >
              <Gavel size={17} /> Moderation
            </h3>
            <div className="k-grid k-grid-2" style={{ marginBottom: 18 }}>
              <div>
                <label style={labelStyle}>User ID</label>
                <input value={userId} onChange={(e) => setUserId(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Ban ID (for appeal review)</label>
                <input value={banId} onChange={(e) => setBanId(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div className="k-row">
              <button
                type="button"
                onClick={() => ban("standard")}
                style={{
                  borderRadius: 9999,
                  border: "1px solid rgba(232,100,42,0.4)",
                  background: "rgba(232,100,42,0.07)",
                  color: "#B3402A",
                  fontFamily: fontBody,
                  fontSize: 13.5,
                  fontWeight: 500,
                  padding: "11px 20px",
                  cursor: "pointer"
                }}
              >
                Standard ban
              </button>
              <button
                type="button"
                onClick={() => ban("extreme")}
                style={{
                  borderRadius: 9999,
                  border: "1px solid rgba(214,69,93,0.45)",
                  background: "rgba(214,69,93,0.08)",
                  color: "#D6455D",
                  fontFamily: fontBody,
                  fontSize: 13.5,
                  fontWeight: 500,
                  padding: "11px 20px",
                  cursor: "pointer"
                }}
              >
                Permanent ban
              </button>
              <button
                type="button"
                onClick={appeal}
                style={{
                  borderRadius: 9999,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.9)",
                  color: "#111111",
                  fontFamily: fontBody,
                  fontSize: 13.5,
                  padding: "11px 20px",
                  cursor: "pointer"
                }}
              >
                Open appeal review
              </button>
            </div>
          </Surface>
        </motion.div>
      </div>

      {status ? (
        <div style={{ marginTop: 24 }}>
          <Note kind="success">{status}</Note>
        </div>
      ) : null}
      {error ? (
        <div style={{ marginTop: 24 }}>
          <Note kind="error">{error}</Note>
        </div>
      ) : null}

      <div style={{ height: 80 }} />
    </PageShell>
    </AuthRedirectGate>
  );
}
