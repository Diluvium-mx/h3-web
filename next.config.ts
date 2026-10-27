import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  experimental: {
    // Respaldo para subir fotos sin Vercel Blob (las fotos se comprimen antes en el navegador)
    serverActions: { bodySizeLimit: "4mb" },
    // La mayoría llega desde WhatsApp/redes (primera visita): CSS en el HTML = pinta antes
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      // Fotos subidas desde el panel (Vercel Blob)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Fotos del inventario original en Shopify (demo / migración)
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
    // Menos tamaños = menos transformaciones en el plan gratuito de Vercel
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [96, 256, 384],
    qualities: [70, 80],
    // Las fotos subidas tienen nombre único, se pueden cachear mucho tiempo
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
