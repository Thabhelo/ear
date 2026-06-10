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
    title: "What Ear is",
    body: "Ear connects you with a real human for conversation, listening, and company. It is not dating, therapy, medical advice, or crisis counseling, and it is not a substitute for emergency services. If you are in crisis, contact your local emergency services."
  },
  {
    title: "Who can use it",
    body: "You must be at least 18 years old and able to enter a binding agreement to use Ear."
  },
  {
    title: "Payments and time",
    body: "Sessions are paid up front and include the full purchased time. When nobody is waiting and energy permits, calls may continue past the purchased time at no extra charge. These grace extensions are a courtesy and never a guarantee. Priority bids affect queue position only and are not refundable once you are matched."
  },
  {
    title: "Recording consent",
    body: "Every call is recorded for safety, quality assurance, and dispute resolution. You must consent before joining. No consent, no call."
  },
  {
    title: "Conduct",
    body: "Threats, harassment, sexual misconduct, hate speech, fraud, and doxxing result in a permanent ban with no appeal. Lesser misconduct, such as repeated disrespect, spam, or boundary violations, results in a standard ban. A standard ban may be appealed through a paid manual review. The review fee purchases the review itself, not reinstatement."
  },
  {
    title: "Staying on the platform",
    body: "All contact happens through Ear. Personal phone numbers, emails, and social accounts are never exchanged in either direction. Attempts to move contact off the platform may end the session and the account."
  },
  {
    title: "Leaving a call",
    body: "Either side may leave any call at any time, without explanation. Calls end automatically when purchased time runs out unless a grace extension is offered."
  },
  {
    title: "Liability",
    body: "Ear is provided as is. To the fullest extent permitted by law, our liability for any claim related to the service is limited to the amount you paid for the session in question."
  },
  {
    title: "Changes",
    body: "We may update these terms as the service evolves. Continued use after an update means you accept the revised terms."
  }
];

export default function TermsPage() {
  return (
    <PageShell maxWidth={760}>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        sub="Effective June 2026. Plain language, because that is the whole point of Ear."
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
    </PageShell>
  );
}
