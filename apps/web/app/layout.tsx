import type { Metadata } from "next";
import {
  siteDescription,
  siteName,
  siteTagline,
  siteTitle,
  siteUrl,
} from "./lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "human connection",
    "on-demand calls",
    "someone to talk to",
    "friendship as a service",
    siteTagline,
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..700&family=Inter+Tight:wght@100..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
