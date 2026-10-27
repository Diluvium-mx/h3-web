import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

// Saira en dos cortes estáticos (expandida): ~15 KB cada uno en vez de ~210 KB variables
const sairaDisplay = localFont({
  src: "./fonts/saira-display-800i.woff2",
  variable: "--font-saira",
  weight: "800",
  style: "italic",
  display: "swap",
});

const sairaTech = localFont({
  src: "./fonts/saira-tech-600.woff2",
  variable: "--font-saira-tech",
  weight: "600",
  style: "normal",
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
  themeColor: "#f4f4f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${sairaDisplay.variable} ${sairaTech.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
