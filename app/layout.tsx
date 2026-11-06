import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Saira } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Letra del sitio (pedido del dueño, 31-oct: cambiar otra vez la tipografía): Instrument Sans, grotesca con
// carácter y muy legible en celular. Para resaltar palabras en rojo (p. ej. «seleccionados»): Saira inclinada
// y gruesa, con aire del logo (5-nov: el dueño cambió Instrument Serif porque se veía muy delicada).
const sans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});
const accent = Saira({
  variable: "--font-saira",
  subsets: ["latin"],
  style: "italic",
  axes: ["wdth"],
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
      className={`${sans.variable} ${accent.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
