import type { NextConfig } from "next";

const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = staticExport ? (process.env.PAGES_BASE_PATH || "").replace(/\/$/, "") : "";
if (basePath && !/^\/[A-Za-z0-9._-]+$/.test(basePath)) throw new Error("PAGES_BASE_PATH должен быть пустым или /имя-репозитория.");

const nextConfig: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_STATIC_EXPORT: staticExport ? "1" : "0" },
  ...(staticExport ? {
    output: "export",
    basePath,
    trailingSlash: true,
    images: { loader: "custom", loaderFile: "./src/lib/static-image-loader.ts", deviceSizes: [640, 750, 1080, 1200, 1536, 1920], imageSizes: [128, 256, 384] },
  } : {}),
};

export default nextConfig;
