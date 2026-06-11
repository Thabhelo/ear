"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import BookingPanel from "../components/booking/BookingPanel";
import { Note, PageHero, PageShell, fontBody } from "../components/landing/PageShell";

export function BookFlow() {
  const params = useSearchParams();
  const sessionId = params.get("session") ?? "";
  const justPaid = Boolean(sessionId);

  useEffect(() => {
    if (sessionId) {
      window.localStorage.setItem("ear:lastSessionId", sessionId);
    }
  }, [sessionId]);

  return (
    <PageShell active="/book" maxWidth={920}>
      <PageHero
        eyebrow="Schedule"
        title={justPaid ? "Payment confirmed." : "Book a time."}
        sub={
          justPaid
            ? "Pick when you'd like to talk. No waiting around, no missed calls while you're asleep."
            : "Choose a slot that works for you. You'll get a calendar invite with everything you need."
        }
      />

      {justPaid ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex justify-center"
          style={{ marginBottom: 28 }}
        >
          <Note kind="success">You're all set. Just choose a time below.</Note>
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <BookingPanel title="Ear · Schedule" />
      </motion.div>

      <p
        style={{
          textAlign: "center",
          marginTop: 28,
          fontFamily: fontBody,
          fontSize: 13,
          lineHeight: 1.65,
          color: "rgba(0,0,0,0.45)"
        }}
      >
        At your scheduled time, open the link in your invite to join.{" "}
        <Link href="/account" style={{ color: "rgba(0,0,0,0.55)" }}>
          Your account
        </Link>{" "}
        keeps your session details.
      </p>

      <div style={{ height: 80 }} />
    </PageShell>
  );
}
