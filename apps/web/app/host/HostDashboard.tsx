"use client";

import { useState } from "react";
import { apiGet, apiPost } from "../lib/api";

type QueueEntry = {
  id: string;
  user_id: string;
  session_id: string;
  mode: string;
  priority_score: number;
};

export function HostDashboard() {
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [userId, setUserId] = useState("");
  const [banId, setBanId] = useState("");
  const [note, setNote] = useState("Available");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function loadQueue() {
    setError("");
    try {
      const response = await apiGet<{ entries: QueueEntry[] }>("/queue/list");
      setEntries(response.entries);
      setStatus(`Loaded ${response.entries.length} queue entries.`);
    } catch (queueError) {
      setError(queueError instanceof Error ? queueError.message : "Queue load failed.");
    }
  }

  async function updateStatus(available: boolean) {
    setError("");
    try {
      await apiPost("/host/status", {
        available,
        note,
        energy: available ? "available" : "offline"
      });
      setStatus(available ? "Host marked available." : "Host marked offline.");
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Status update failed.");
    }
  }

  async function ban(type: "standard" | "extreme") {
    setError("");
    try {
      const response = await apiPost<{ id: string }>("/ban", {
        user_id: userId,
        ban_type: type,
        reason: type === "extreme" ? "Extreme misconduct" : "Boundary violation"
      });
      setBanId(response.id);
      setStatus(`${type} ban created.`);
    } catch (banError) {
      setError(banError instanceof Error ? banError.message : "Ban failed.");
    }
  }

  async function appeal() {
    setError("");
    try {
      await apiPost("/ban-appeal", {
        user_id: userId,
        ban_id: banId,
        statement: "$50 buys manual review only, not automatic reinstatement."
      });
      setStatus("Appeal review created.");
    } catch (appealError) {
      setError(appealError instanceof Error ? appealError.message : "Appeal failed.");
    }
  }

  return (
    <section className="flow">
      <div className="section-heading">
        <p className="eyebrow">Host</p>
        <h1>Operate Ear from one place.</h1>
        <p className="lede">
          Queue, availability, bans, appeal reviews, and call safety controls
          stay on-platform.
        </p>
      </div>

      <div className="card form-grid">
        <label>
          Host note
          <input value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        <label>
          User ID for moderation
          <input value={userId} onChange={(event) => setUserId(event.target.value)} />
        </label>
        <label>
          Ban ID for appeal review
          <input value={banId} onChange={(event) => setBanId(event.target.value)} />
        </label>
        <div className="actions full">
          <button type="button" onClick={loadQueue}>
            Load queue
          </button>
          <button type="button" className="secondary" onClick={() => updateStatus(true)}>
            Available
          </button>
          <button type="button" className="secondary" onClick={() => updateStatus(false)}>
            Offline
          </button>
          <button type="button" className="secondary" onClick={() => ban("standard")}>
            Standard ban
          </button>
          <button type="button" className="secondary" onClick={() => ban("extreme")}>
            Extreme ban
          </button>
          <button type="button" className="secondary" onClick={appeal}>
            Create $50 appeal review
          </button>
        </div>
      </div>

      <div className="grid">
        {entries.map((entry) => (
          <article className="card" key={entry.id}>
            <h3>{entry.mode}</h3>
            <p>User: {entry.user_id}</p>
            <p>Session: {entry.session_id}</p>
            <strong>Score {entry.priority_score}</strong>
          </article>
        ))}
      </div>

      {status ? <p className="status">{status}</p> : null}
      {error ? <p className="status error">{error}</p> : null}
    </section>
  );
}
