import type { NextConfig } from "next";

// Pruebas desde el celular (npm run movil): el script pasa aquí la IP de la red local y, si se usa,
// el dominio del túnel. Solo afecta al servidor de desarrollo.
const devHosts = (process.env.H3_DEV_HOSTS ?? "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

// Vista previa de una rama en Netlify (p. ej. https://desarrollo--h3-seminuevos.netlify.app): no gasta
// créditos, sus enlaces apuntan a ella misma y Google no la indexa.
const preview = process.env.CONTEXT === "branch-deploy" || process.env.CONTEXT === "deploy-preview";

const nextConfig: NextConfig = {
  // En modo celular se oculta el botón «N» de Next.js, que tapa botones en pantallas chicas
  ...(devHosts.length && { allowedDevOrigins: devHosts, devIndicators: false }),
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
    // Respaldo local para subir fotos sin Cloudinary (las fotos se comprimen antes en el navegador)
    serverActions: { bodySizeLimit: "4mb", ...(devHosts.length && { allowedOrigins: devHosts }) },
    // La mayoría llega desde WhatsApp/redes (primera visita): CSS en el HTML = pinta antes
    inlineCss: true,
  },
  env: {
    // En Netlify, mientras no se conecte el dominio, se usa la dirección que Netlify asigna (URL);
    // en una vista previa, la de la rama (DEPLOY_PRIME_URL)
    NEXT_PUBLIC_SITE_URL:
      (preview && process.env.DEPLOY_PRIME_URL) ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.URL ||
      "https://www.h3seminuevos.com",
    NEXT_PUBLIC_PREVIEW: preview ? "1" : "",
    // En Netlify, el panel guarda en Netlify Blobs si no hay Upstash (ver lib/storage.ts)
    H3_NETLIFY: process.env.NETLIFY === "true" ? "1" : "",
  },
  images: {
    // Las fotos se sirven optimizadas desde Cloudinary (ver lib/image-loader.ts),
    // así no gastan tráfico ni transformaciones del hosting.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    // Pocos tamaños = menos transformaciones y menos tráfico (importante en planes gratuitos)
    deviceSizes: [640, 828, 1080, 1440],
    imageSizes: [96, 256, 384],
    qualities: [70, 80],
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
        // En la vista previa, todo; en producción, solo el panel
        source: preview ? "/:path*" : "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
