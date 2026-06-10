import Link from "next/link";
import { QueueFlow } from "./QueueFlow";

export default function QueuePage() {
  return (
    <main>
      <nav className="topbar" aria-label="Primary">
        <Link href="/" className="brand">
          Ear
        </Link>
        <div>
          <Link href="/start">Start</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/safety">Safety</Link>
        </div>
      </nav>
      <QueueFlow />
    </main>
  );
}
