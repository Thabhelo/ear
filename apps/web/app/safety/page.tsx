import Link from "next/link";

const safetyItems = [
  {
    title: "Recorded by consent",
    body: "Every call requires recording consent before joining. No consent means no call."
  },
  {
    title: "No personal contact",
    body: "No personal phone number, email, Instagram, WhatsApp, or off-platform account is shared."
  },
  {
    title: "Leave anytime",
    body: "The user can leave at any time. The host can end a call immediately when needed."
  },
  {
    title: "Clear limits",
    body: "Ear is not dating, therapy, medical advice, crisis counseling, or emergency support."
  },
  {
    title: "Ban system",
    body: "Extreme bans have no appeal. Standard bans may request a paid manual review."
  },
  {
    title: "Private recordings",
    body: "Recording metadata is stored in Firestore and files route through Google Cloud Storage."
  }
];

export default function SafetyPage() {
  return (
    <main>
      <nav className="topbar" aria-label="Primary">
        <Link href="/" className="brand">
          Ear
        </Link>
        <div>
          <Link href="/modes">Modes</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/start">Start</Link>
        </div>
      </nav>

      <section className="page-hero">
        <p className="eyebrow">Safety</p>
        <h1>Boundaries are product design.</h1>
        <p className="lede">
          Ear works only if access feels human without becoming unbounded. The
          platform keeps the interaction clear, recorded, and contained.
        </p>
      </section>

      <section className="grid">
        {safetyItems.map((item) => (
          <article className="card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="notice centered">
        <h2>Ready when you are.</h2>
        <p>Choose a mode, consent to the rules, then connect through the platform.</p>
        <div className="actions">
          <Link href="/start">Start now</Link>
          <Link href="/pricing" className="secondary">
            See pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
