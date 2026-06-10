import Link from "next/link";
import { CallFlow } from "./CallFlow";

export default function CallPage() {
  return (
    <main>
      <nav className="topbar" aria-label="Primary">
        <Link href="/" className="brand">
          Ear
        </Link>
        <div>
          <Link href="/start">Start</Link>
          <Link href="/safety">Safety</Link>
        </div>
      </nav>
      <CallFlow />
    </main>
  );
}
