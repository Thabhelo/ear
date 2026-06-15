import type { MetadataRoute } from "next";
import { siteUrl } from "./lib/site";

const publicPaths = [
  "/",
  "/pricing",
  "/modes",
  "/safety",
  "/privacy",
  "/terms",
  "/book",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicPaths.map((path) => ({
    url: path === "/" ? siteUrl : `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
