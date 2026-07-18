import type { NextConfig } from "next";

// No `output: "standalone"`: Hostinger's managed Node.js Apps deploy runs
// `npm run build` && `npm start` directly against the repo via its GitHub
// integration (nextjs-deploy-hostinger skill §1), not a manually-copied
// standalone bundle. `next start` does not work correctly with
// output:"standalone" (confirmed while running Lighthouse locally against
// a standalone build) — keep the default server output so `npm start`
// behaves as Hostinger expects.
const nextConfig: NextConfig = {};

export default nextConfig;
