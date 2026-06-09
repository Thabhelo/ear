const modes = [
  {
    name: "Just Listen",
    description: "You talk. Ear listens. No advice unless requested."
  },
  {
    name: "Conversation",
    description: "Normal two-way conversation with a real human."
  },
  {
    name: "Deep Talk",
    description: "Life, relationships, dreams, failures, loneliness, or whatever is on your mind."
  },
  {
    name: "Silent Company",
    description: "Almost no talking. Just another person present."
  },
  {
    name: "Study Buddy",
    description: "Work together quietly with steady human presence."
  },
  {
    name: "Game Mode",
    description: "Play games together through a bounded platform session."
  }
];

const oneOffs = [
  { name: "Quick Call", price: "$2.99", detail: "3 minutes" },
  { name: "Standard Call", price: "$6.99", detail: "25 minutes" },
  { name: "Long Call", price: "$14.99", detail: "60 minutes" },
  { name: "Text Session", price: "$1.99", detail: "Text conversation session" }
];

const subscriptions = [
  { name: "Text Friend", price: "$4.99/mo", detail: "Messaging access and faster replies than non-members." },
  { name: "Friend", price: "$19/mo", detail: "Messaging access, queue priority, reduced call rates, and occasional voice notes." },
  { name: "Close Friend", price: "$29.99/mo", detail: "Priority responses, included monthly call allowance, voice notes, and game sessions." },
  { name: "Always There", price: "$49/mo", detail: "Highest queue priority, fastest response tier, monthly call allowance, check-ins, and voice notes." }
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Ear</p>
        <h1>Someone real is listening.</h1>
        <p className="lede">
          Need someone to talk to, listen, or keep you company while you work?
          Pick a mode and connect through a bounded platform session.
        </p>
        <div className="actions">
          <a href="#pricing">Pick a session</a>
          <a href="#subscriptions" className="secondary">
            See access plans
          </a>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <p className="eyebrow">Modes</p>
          <h2>Choose the kind of presence you need.</h2>
        </div>
        <div className="grid">
          {modes.map((mode) => (
            <article className="card" key={mode.name}>
              <h3>{mode.name}</h3>
              <p>{mode.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing">
        <div className="section-heading">
          <p className="eyebrow">One-off sessions</p>
          <h2>Try the experience without subscribing.</h2>
        </div>
        <div className="grid pricing-grid">
          {oneOffs.map((plan) => (
            <article className="card price-card" key={plan.name}>
              <h3>{plan.name}</h3>
              <strong>{plan.price}</strong>
              <p>{plan.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="subscriptions">
        <div className="section-heading">
          <p className="eyebrow">Access plans</p>
          <h2>Subscriptions sell access, not just calls.</h2>
        </div>
        <div className="grid pricing-grid">
          {subscriptions.map((plan) => (
            <article className="card price-card" key={plan.name}>
              <h3>{plan.name}</h3>
              <strong>{plan.price}</strong>
              <p>{plan.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="notice">
        <h2>Boundaries are part of the product.</h2>
        <p>
          Ear is not dating, therapy, medical advice, crisis counseling, or an
          emergency service. Every interaction stays inside the platform.
        </p>
      </section>
    </main>
  );
}
