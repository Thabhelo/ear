import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/site";

const privatePaths = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/account",
  "/start",
  "/call",
  "/queue",
  "/consent",
  "/host",
  "/auth",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: privatePaths,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl.replace(/^https?:\/\//, ""),
  };
}
