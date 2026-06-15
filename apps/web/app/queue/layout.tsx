import type { Metadata } from "next";
import { noIndexMetadata } from "../lib/noIndexMetadata";

export const metadata: Metadata = noIndexMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
