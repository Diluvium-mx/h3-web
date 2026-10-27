// Tipos y utilidades compartidas entre servidor y navegador.
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

export type BodyType = (typeof BODY_TYPES)[number];
export type Transmission = (typeof TRANSMISSIONS)[number];
export type Fuel = (typeof FUELS)[number];
export type CarStatus = (typeof STATUSES)[number];

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
  return n == null ? "Consultar" : `${numberFormatter.format(n)} km`;
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
  return { ...car, description: "", images: car.images.slice(0, 1) };
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

export function visitMessage(car: Car) {
  return `Hola 👋 Me gustaría agendar una cita para ver el *${carTitle(car)}*. ¿Qué días tienen disponibles?\n${carUrl(car)}`;
}

export function similarMessage(car: Car) {
  return `Hola 👋 Vi que el *${carTitle(car)}* ya se vendió. Busco algo similar, ¿me pueden ayudar?\n${carUrl(car)}`;
}

export function carWhatsApp(car: Car) {
  return whatsappUrl(car.status === "vendido" ? similarMessage(car) : interestMessage(car));
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
