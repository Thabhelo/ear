import Link from "next/link";
import { oneOffs, subscriptions } from "../lib/catalog";

const questions = [
  {
    question: "Are grace extensions guaranteed?",
    answer: "No. Every paid call includes the purchased minimum time. Extra time is discretionary when demand is low and energy permits."
  },
  {
    question: "Do I get a personal phone number?",
    answer: "No. Ear never exposes personal phone numbers, email, WhatsApp, Instagram, or off-platform accounts."
  },
  {
    question: "Is this therapy?",
    answer: "No. Ear is not therapy, dating, medical advice, crisis counseling, or an emergency service."
  }
];

export default function PricingPage() {
  return (
    <main>
      <nav className="topbar" aria-label="Primary">
        <Link href="/" className="brand">
          Ear
        </Link>
        <div>
          <Link href="/modes">Modes</Link>
          <Link href="/safety">Safety</Link>
          <Link href="/start">Start</Link>
        </div>
      </nav>

      <section className="page-hero">
        <p className="eyebrow">Pricing</p>
        <h1>Transparent ways to try or subscribe.</h1>
        <p className="lede">
          Start with one session. Upgrade to access when you know the experience
          is useful.
        </p>
      </section>

      <section>
        <div className="section-heading">
          <p className="eyebrow">One-off</p>
          <h2>Pay once, then enter the queue.</h2>
        </div>
        <div className="grid pricing-grid">
          {oneOffs.map((plan) => (
            <Link className="card price-card clickable" href={`/start?product=${plan.id}`} key={plan.id}>
              <h3>{plan.name}</h3>
              <strong>{plan.price}</strong>
              <p>{plan.detail}</p>
              <span className="text-link">Continue</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="section-heading">
          <p className="eyebrow">Subscriptions</p>
          <h2>Access plans for people who want consistency.</h2>
        </div>
        <div className="grid pricing-grid">
          {subscriptions.map((plan) => (
            <Link className="card price-card clickable" href={`/start?plan=${plan.id}`} key={plan.id}>
              <h3>{plan.name}</h3>
              <strong>{plan.price}</strong>
              <p>{plan.detail}</p>
              <span className="text-link">Choose plan</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="faq">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Pricing questions that should not be hidden.</h2>
        </div>
        <div className="faq-list">
          {questions.map((item) => (
            <article className="faq-item" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
