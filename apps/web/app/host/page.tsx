import Link from "next/link";
import { HostDashboard } from "./HostDashboard";

export default function HostPage() {
  return (
    <main>
      <nav className="topbar" aria-label="Primary">
        <Link href="/" className="brand">
          Ear
        </Link>
        <div>
          <Link href="/start">Start</Link>
          <Link href="/queue">Queue</Link>
        </div>
      </nav>
      <HostDashboard />
    </main>
  );
}
