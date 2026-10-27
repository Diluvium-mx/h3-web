// Convierte productos de Shopify (/products.json) a borradores de autos.
import { BODY_TYPES, slugify, type BodyType, type Car } from "./cars";

export type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string | null;
  published_at: string;
  updated_at: string;
  variants: { price: string; available?: boolean }[];
  images: { src: string }[];
};

const BRANDS = [
  "Mercedes-Benz", "Mercedes", "BMW", "Audi", "Volkswagen", "Ford", "Chevrolet", "GMC", "Cadillac",
  "Jeep", "Dodge", "RAM", "Chrysler", "Toyota", "Lexus", "Honda", "Acura", "Nissan", "Infiniti",
  "Mazda", "Hyundai", "Kia", "Porsche", "Land Rover", "Range Rover", "Volvo", "Mini", "FIAT",
  "Peugeot", "Renault", "SEAT", "Cupra", "Subaru", "Mitsubishi", "Suzuki", "Tesla", "Lincoln",
  "Buick", "Jaguar", "Alfa Romeo", "Maserati", "Ferrari", "Lamborghini", "Bentley", "Aston Martin",
  "MG", "BYD", "Chirey", "JAC", "Aodes", "Can-Am", "Polaris", "Harley-Davidson",
];

const BODY_HINTS: [RegExp, BodyType][] = [
  [/cheyenne|silverado|lobo|f-?150|ram|tacoma|hilux|frontier|ranger|tundra|sierra|pick ?up|raptor/i, "Pickup"],
  [/mustang|camaro|corvette|m2|m3|m4|m240|amg gt|911|gt-?r|supra|challenger|charger|srt|rs\d/i, "Deportivo"],
  [/aodes|can-?am|polaris|rzr|utv|razor/i, "Recreativo"],
  [/sienna|odyssey|van|transit|sprinter|urvan|hiace/i, "Van"],
  [/escalade|tahoe|suburban|expedition|explorer|wrangler|cherokee|land ?cruiser|cx-?\d|tucson|pulse|rav4|crv|cr-v|q\d|x\d|g ?63|g-?class|range|defender|highlander|4runner|sportage|seltos|kicks|x-?trail|edge|bronco|durango|grand/i, "SUV"],
  [/jetta|civic|corolla|sentra|versa|camry|accord|clase c|c ?\d{3}|serie 3|a\d|mazda ?\d|elantra|vento|aveo/i, "Sedán"],
];

export function htmlToText(input: string | null) {
  return (input ?? "")
    .replace(/\s*\n\s*/g, " ")
    .replace(/<br\b[^>]*>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/li>/gi, "")
    .replace(/<\/(p|div|h[1-6]|ul|ol)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function shopifyToCar(p: ShopifyProduct): Omit<Car, "id" | "slug" | "images"> & {
  sourceImages: string[];
  slugBase: string;
} {
  const yearMatch = p.title.match(/\b(19[5-9]\d|20\d{2})\b/);
  const year = yearMatch ? Number(yearMatch[1]) : new Date().getFullYear();
  let rest = p.title.replace(yearMatch?.[0] ?? "", "").replace(/\s+/g, " ").trim();
  const brand =
    BRANDS.find((b) => rest.toLowerCase().startsWith(b.toLowerCase())) ?? rest.split(" ")[0] ?? "Otro";
  rest = rest.slice(brand.length).trim();
  const transmission = /\baut(o|om[aá]tic[oa])?\b/i.test(p.title)
    ? "Automática"
    : /\b(std|est[aá]ndar|manual)\b/i.test(p.title)
      ? "Manual"
      : undefined;
  rest = rest.replace(/\b(aut|automático|automatico|std|estándar|manual)\b\.?/gi, "").trim();
  const description = htmlToText(p.body_html);
  const kmMatch = description.match(/([\d][\d,.]{2,})\s*(km|kil[oó]metros)/i);
  const mileage = kmMatch ? Number(kmMatch[1].replace(/[,.]/g, "")) : undefined;
  const text = `${p.title} ${description}`;
  const body = BODY_HINTS.find(([re]) => re.test(text))?.[1] ?? "SUV";
  const lower = description.toLowerCase();
  const features = [
    lower.includes("único dueño") || lower.includes("unico dueño") ? "Único dueño" : null,
    lower.includes("factura original") ? "Factura original" : null,
    lower.includes("servicios") && lower.includes("agencia") ? "Servicios de agencia" : null,
  ].filter(Boolean) as string[];
  const now = new Date().toISOString();
  return {
    brand: brand === "Mercedes" ? "Mercedes-Benz" : brand,
    model: rest || p.title,
    version: "",
    year,
    price: Math.round(Number(p.variants[0]?.price ?? 0)),
    mileage: mileage && mileage < 2_000_000 ? mileage : undefined,
    transmission,
    body: BODY_TYPES.includes(body) ? body : "SUV",
    armored: /blind/i.test(text),
    features,
    description,
    status: p.variants.some((v) => v.available !== false) ? "disponible" : "vendido",
    featured: false,
    shopifyHandle: p.handle,
    createdAt: p.published_at ?? now,
    updatedAt: now,
    sourceImages: p.images.map((i) => i.src),
    slugBase: slugify(`${brand} ${rest} ${year}`),
  };
}
