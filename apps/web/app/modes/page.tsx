import Link from "next/link";
import { modes } from "../lib/catalog";

export default function ModesPage() {
  return (
    <main>
      <nav className="topbar" aria-label="Primary">
        <Link href="/" className="brand">
          Ear
        </Link>
        <div>
          <Link href="/pricing">Pricing</Link>
          <Link href="/safety">Safety</Link>
          <Link href="/start">Start</Link>
        </div>
      </nav>

      <section className="page-hero">
        <p className="eyebrow">Modes</p>
        <h1>Start with the kind of presence you need.</h1>
        <p className="lede">
          Pick the shape of the interaction first. Payment comes after the choice
          feels clear.
        </p>
      </section>

      <section className="grid">
        {modes.map((mode) => (
          <Link className="card clickable" href={`/start?mode=${mode.id}`} key={mode.id}>
            <h3>{mode.name}</h3>
            <p>{mode.description}</p>
            <span className="text-link">Choose {mode.name}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
