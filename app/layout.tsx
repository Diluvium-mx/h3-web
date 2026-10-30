import type { Metadata, Viewport } from "next";
import { Archivo, Geist } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Versión 1 (skill /scroll-craft): Archivo ancha para títulos (carácter automotriz, de ficha técnica) y
// Geist para el texto. Archivo es variable también en anchura (wdth), así se usa una sola descarga.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Autos seminuevos en Villahermosa, Tabasco`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "autos seminuevos Villahermosa",
    "carros seminuevos Tabasco",
    "camionetas seminuevas Villahermosa",
    "autos de lujo Villahermosa",
    "autos blindados Tabasco",
    "vender mi auto Villahermosa",
    "H3 Seminuevos",
  ],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: site.name,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#eef0f2",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${geist.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
