// Tipos y utilidades compartidas entre servidor y navegador.
import type { PhotoSection } from "./equipment";
import { site, whatsappUrl } from "./site";

export const BODY_TYPES = [
  "SUV",
  "Pickup",
  "Deportivo",
  "Sedán",
  "Coupé",
  "Hatchback",
  "Convertible",
  "Van",
  "Recreativo",
] as const;
export const TRANSMISSIONS = ["Automática", "Manual"] as const;
export const FUELS = ["Gasolina", "Diésel", "Híbrido", "Eléctrico"] as const;
export const STATUSES = ["disponible", "apartado", "vendido"] as const;
export const INVOICES = ["Original", "De empresa", "Refacturada"] as const;
export const SERVICE_HISTORY = ["De agencia", "Al día"] as const;

export type BodyType = (typeof BODY_TYPES)[number];
export type Transmission = (typeof TRANSMISSIONS)[number];
export type Fuel = (typeof FUELS)[number];
export type CarStatus = (typeof STATUSES)[number];
export type Invoice = (typeof INVOICES)[number];
export type ServiceHistory = (typeof SERVICE_HISTORY)[number];

export type Car = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  version?: string;
  year: number;
  price: number;
  mileage?: number;
  transmission?: Transmission;
  fuel?: Fuel;
  body: BodyType;
  engine?: string;
  drivetrain?: string;
  color?: string;
  doors?: number;
  armored?: boolean;
  features: string[];
  description: string;
  images: string[];
  /** Enlace opcional a un video del auto (YouTube, TikTok, Instagram o Facebook) */
  video?: string;
  /** Sección de cada foto (por URL): exterior, interior, motor o detalles */
  photoSections?: Record<string, PhotoSection>;
  /** Equipamiento marcado de la lista fija (lib/equipment.ts) */
  equipment?: string[];
  // Documentos e historial: lo que más pregunta quien compra. Si falta, la ficha invita a preguntar.
  ownerCount?: number;
  invoice?: Invoice;
  serviceHistory?: ServiceHistory;
  papersInOrder?: boolean;
  /** Solo blindados, p. ej. «Nivel 3 Plus» */
  armorLevel?: string;
  status: CarStatus;
  featured?: boolean;
  shopifyHandle?: string;
  createdAt: string;
  updatedAt: string;
};

export const STATUS_LABEL: Record<CarStatus, string> = {
  disponible: "Disponible",
  apartado: "Apartado",
  vendido: "Vendido",
};

const priceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat("es-MX");

export function formatPrice(n: number) {
  return priceFormatter.format(n);
}

export function formatKm(n?: number) {
  return n == null ? "Pregúntanos" : `${numberFormatter.format(n)} km`;
}

// Texto que se muestra cuando falta un dato (decisión del dueño, 27-oct-2026)
export const MISSING_INFO_TEXT = "Para más información, mándanos un mensaje; te respondemos de inmediato.";

// Datos clave del resumen de cada auto; si alguno falta se invita a preguntar por WhatsApp
export const KEY_SPECS = [
  { key: "mileage", label: "Kilometraje" },
  { key: "transmission", label: "Transmisión" },
  { key: "fuel", label: "Combustible" },
  { key: "engine", label: "Motor" },
] as const;

export function missingSpecs(car: Car) {
  return KEY_SPECS.filter(({ key }) => car[key] == null || car[key] === "").map((s) => s.label);
}

export function shortPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  return `$${Math.round(n / 1000)}k`;
}

export function carName(car: Pick<Car, "brand" | "model" | "version">) {
  return [car.brand, car.model, car.version].filter(Boolean).join(" ");
}

export function carTitle(car: Pick<Car, "brand" | "model" | "version" | "year">) {
  return `${carName(car)} ${car.year}`;
}

export function carUrl(car: Pick<Car, "slug">) {
  return `${site.url}/autos/${car.slug}`;
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Versión ligera para listas en el navegador (sin descripción ni galería completa)
export function cardData(car: Car): Car {
  return { ...car, description: "", images: car.images.slice(0, 1), photoSections: undefined };
}

export function isPublic(car: Car) {
  return car.status !== "vendido";
}

export function sortNewest(a: Car, b: Car) {
  return b.createdAt.localeCompare(a.createdAt);
}

export function interestMessage(car: Car) {
  return `Hola ${site.name} 👋 Me interesa el *${carTitle(car)}* (${formatPrice(car.price)}) que vi en su página.\n${carUrl(car)}\n¿Sigue disponible?`;
}

export function similarMessage(car: Car) {
  return `Hola 👋 Vi que el *${carTitle(car)}* ya se vendió. Busco algo similar, ¿me pueden ayudar?\n${carUrl(car)}`;
}

export function waitlistMessage(car: Car) {
  return `Hola 👋 Vi que el *${carTitle(car)}* está apartado. Si se libera, ¿me avisan?\n${carUrl(car)}`;
}

export function carWhatsApp(car: Car) {
  const message =
    car.status === "vendido" ? similarMessage(car) : car.status === "apartado" ? waitlistMessage(car) : interestMessage(car);
  return whatsappUrl(message);
}

// Texto del botón principal según el estado del auto
export function ctaLabel(car: Pick<Car, "status">, short = false) {
  if (car.status === "vendido") return short ? "Similar" : "Búscame uno similar";
  if (car.status === "apartado") return short ? "Avísame" : "Avísame si se libera";
  return short ? "Lo quiero" : "Me interesa este auto";
}

export type CarVideo =
  | { kind: "youtube"; id: string; url: string }
  | { kind: "link"; platform: "TikTok" | "Instagram" | "Facebook"; url: string };

// Reconoce el enlace del video. YouTube se reproduce en la ficha; los demás abren la red social.
export function parseVideo(raw?: string): CarVideo | null {
  if (!raw) return null;
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:") return null;
  const host = u.hostname.replace(/^(www\.|m\.)/, "");
  if (host === "youtu.be" || host === "youtube.com") {
    const id =
      host === "youtu.be"
        ? u.pathname.slice(1)
        : (u.searchParams.get("v") ?? u.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1] ?? "");
    return /^[\w-]{6,20}$/.test(id) ? { kind: "youtube", id, url: u.toString() } : null;
  }
  if (host === "tiktok.com" || host.endsWith(".tiktok.com")) return { kind: "link", platform: "TikTok", url: u.toString() };
  if (host === "instagram.com") return { kind: "link", platform: "Instagram", url: u.toString() };
  if (host === "facebook.com" || host === "fb.watch") return { kind: "link", platform: "Facebook", url: u.toString() };
  return null;
}

// Etiquetas cortas para destacar en tarjetas (ej. "Único dueño", "Blindado")
export function highlightBadges(car: Car) {
  const badges: string[] = [];
  if (car.armored) badges.push("Blindado");
  const joined = car.features.join(" ").toLowerCase();
  if (joined.includes("único dueño")) badges.push("Único dueño");
  if (car.mileage != null && car.mileage < 30000) badges.push("Bajo km");
  return badges.slice(0, 2);
}
