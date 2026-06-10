import Link from "next/link";
import { ConsentFlow } from "./ConsentFlow";

export default function ConsentPage() {
  return (
    <main>
      <nav className="topbar" aria-label="Primary">
        <Link href="/" className="brand">
          Ear
        </Link>
        <div>
          <Link href="/queue">Queue</Link>
          <Link href="/safety">Safety</Link>
        </div>
      </nav>
      <ConsentFlow />
    </main>
  );
}
