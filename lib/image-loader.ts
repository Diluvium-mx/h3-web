"use client";

// Loader de next/image: las fotos se sirven ya optimizadas desde Cloudinary (o del CDN de Shopify
// mientras exista), así el hosting no gasta tráfico ni transformaciones en fotos.
type LoaderProps = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width, quality }: LoaderProps) {
  if (src.startsWith("https://res.cloudinary.com/")) {
    const [base, rest] = src.split("/image/upload/");
    if (rest) {
      // f_auto: AVIF/WebP según el navegador · q_auto: calidad automática (eco = más ligera)
      const q = quality && quality > 70 ? "q_auto" : "q_auto:eco";
      return `${base}/image/upload/f_auto,${q},c_limit,w_${width}/${rest}`;
    }
  }
  if (src.startsWith("https://cdn.shopify.com/")) {
    const url = new URL(src);
    url.searchParams.set("width", String(width));
    return url.toString();
  }
  // Archivos locales (logo, fotos de desarrollo): se sirven tal cual
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}`;
}
