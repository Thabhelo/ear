"use client";

import { Calendar, ExternalLink } from "lucide-react";
import { useCallback } from "react";
import { fontBody, fontHeading } from "../landing/PageShell";
import { getBookingUrl } from "../../lib/booking";

type BookingPanelProps = {
  title?: string;
};

/** In-site scheduling panel with a VS Code-style chrome bar. */
export default function BookingPanel({ title = "Pick a time" }: BookingPanelProps) {
  const bookingUrl = getBookingUrl();

  const openScheduling = useCallback(() => {
    window.open(bookingUrl, "ear-scheduling", "noopener,noreferrer,width=520,height=820");
  }, [bookingUrl]);

  return (
    <div
      style={{
        borderRadius: 20,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.92)",
        boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
        overflow: "hidden"
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{
          gap: 12,
          padding: "12px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          background: "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,0.9) 100%)"
        }}
      >
        <div className="flex items-center" style={{ gap: 10, minWidth: 0 }}>
          <span className="flex items-center" style={{ gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 9999, background: "#FF5F57" }} />
            <span style={{ width: 10, height: 10, borderRadius: 9999, background: "#FEBC2E" }} />
            <span style={{ width: 10, height: 10, borderRadius: 9999, background: "#28C840" }} />
          </span>
          <span
            className="flex items-center"
            style={{
              gap: 8,
              fontFamily: fontHeading,
              fontSize: 14,
              fontWeight: 500,
              color: "#111111",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            <Calendar size={15} color="#E8642A" />
            {title}
          </span>
        </div>
        <button
          type="button"
          onClick={openScheduling}
          className="inline-flex items-center"
          style={{
            gap: 6,
            flexShrink: 0,
            borderRadius: 9999,
            border: "1px solid rgba(0,0,0,0.1)",
            background: "rgba(255,255,255,0.95)",
            color: "rgba(0,0,0,0.65)",
            fontFamily: fontBody,
            fontSize: 12,
            fontWeight: 500,
            padding: "7px 12px",
            cursor: "pointer"
          }}
        >
          Open scheduling
          <ExternalLink size={12} />
        </button>
      </div>

      <iframe
        title="Schedule a call"
        src={bookingUrl}
        style={{
          display: "block",
          width: "100%",
          height: "min(78vh, 820px)",
          minHeight: 560,
          border: "none",
          background: "#FFFFFF"
        }}
      />

      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(248,250,252,0.7)"
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: fontBody,
            fontSize: 12,
            lineHeight: 1.55,
            color: "rgba(0,0,0,0.45)",
            textAlign: "center"
          }}
        >
          After you book, Google sends a calendar invite. Join from that link at your scheduled
          time. If the calendar is blank here, use Open scheduling above.
        </p>
      </div>
    </div>
  );
}
