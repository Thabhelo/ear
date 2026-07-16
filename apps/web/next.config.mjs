import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(__dirname, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // gRPC-based Google Cloud SDKs use dynamic requires that break when bundled.
  serverExternalPackages: ["firebase-admin", "@google-cloud/storage"],
  // Local dev only: npm workspaces hoists `next` to the monorepo root.
  // Skip in Docker/CI builds where apps/web is the full build context.
  ...(process.env.DOCKER_BUILD !== "1"
    ? {
        turbopack: {
          root: monorepoRoot,
        },
      }
    : {}),
};

export default nextConfig;
