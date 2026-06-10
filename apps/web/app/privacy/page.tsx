"use client";

import {
  PageHero,
  PageShell,
  Surface,
  fontBody,
  fontHeading
} from "../components/landing/PageShell";

const SECTIONS = [
  {
    title: "What we collect",
    body: "When you sign in, we receive your name and email address from your sign-in provider. When you buy a session or membership, payment details are handled by our payment processor; we never see or store your full card number. During calls we record audio, with your explicit consent, along with session details such as mode, duration, and queue activity."
  },
  {
    title: "Why we collect it",
    body: "We use this information to run the service: matching you in the queue, processing payments, keeping calls safe, resolving disputes, and meeting legal obligations. We do not sell your personal information, and we do not use your conversations for advertising."
  },
  {
    title: "Call recordings",
    body: "Every call is recorded for safety, quality assurance, and dispute resolution. Recordings are stored securely with restricted access, reviewed only when a safety or dispute issue requires it, and retained only as long as needed for those purposes."
  },
  {
    title: "Sharing",
    body: "We share data only with the service providers needed to operate Ear, such as payment processing, authentication, and call infrastructure, and only to the extent required. We may disclose information if the law requires it or to protect the safety of users."
  },
  {
    title: "Your choices",
    body: "You can request a copy of your data or ask us to delete your account and associated data at any time. Some records, such as payment history and safety records, may be retained where the law requires it."
  },
  {
    title: "Changes",
    body: "If this policy changes in a meaningful way, we will post the updated version here with a new effective date."
  }
];

export default function PrivacyPage() {
  return (
    <PageShell maxWidth={760}>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        sub="Effective June 2026. The short version: we collect only what the service needs, and your conversations are never for sale."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {SECTIONS.map((section) => (
          <Surface key={section.title} style={{ padding: "24px 28px" }}>
            <h2
              style={{
                fontFamily: fontHeading,
                fontSize: 18,
                fontWeight: 450,
                color: "#111111",
                margin: "0 0 8px"
              }}
            >
              {section.title}
            </h2>
            <p
              style={{
                fontFamily: fontBody,
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(0,0,0,0.6)",
                margin: 0
              }}
            >
              {section.body}
            </p>
          </Surface>
        ))}
      </div>
      <p
        style={{
          textAlign: "center",
          marginTop: 32,
          fontFamily: fontBody,
          fontSize: 13,
          color: "rgba(0,0,0,0.4)"
        }}
      >
        Questions about your data? Reach out through the platform and we will respond.
      </p>
    </PageShell>
  );
}
