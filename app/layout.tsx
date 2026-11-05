import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Letra del sitio (pedido del dueño, 31-oct: cambiar otra vez la tipografía): Instrument Sans, grotesca con
// carácter y muy legible en celular. Instrument Serif en cursiva solo para resaltar palabras (p. ej. «premium»).
const sans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});
const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
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
  themeColor: "#f4f3f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${serif.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
