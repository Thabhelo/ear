import Link from "next/link";
import { StartFlow } from "./StartFlow";

export default function StartPage() {
  return (
    <main>
      <nav className="topbar" aria-label="Primary">
        <Link href="/" className="brand">
          Ear
        </Link>
        <div>
          <Link href="/modes">Modes</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/safety">Safety</Link>
        </div>
      </nav>
      <StartFlow />
    </main>
  );
}
