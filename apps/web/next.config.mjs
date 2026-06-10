import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // npm workspaces hoists `next` to the monorepo root; without this Turbopack
  // treats apps/web as the project root and panics with "Next.js package not found".
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;
