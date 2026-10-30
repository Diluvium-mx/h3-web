import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";
import type { Car } from "./cars";
import { normalizePhotoSections } from "./equipment";
import type { Review } from "./reviews";
import seed from "@/data/seed.json";

// Almacenamiento del inventario.
// - Producción: Upstash Redis (integración gratuita del Marketplace de Vercel).
// - Sin Redis: se usa data/seed.json (modo demo, solo lectura en producción).
//   En desarrollo los cambios se guardan en data/cars.local.json.

const KEY = "h3:cars";

const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

export const storageMode: "redis" | "local" | "demo" = redis
  ? "redis"
  : process.env.NODE_ENV === "production"
    ? "demo"
    : "local";

// Solo se usa en desarrollo local (sin Redis)
const LOCAL_FILE = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "cars.local.json");

export async function getSeedCars(): Promise<Car[]> {
  // El tipo que TypeScript deduce del JSON es demasiado específico (una variante por auto)
  return (structuredClone(seed) as unknown as Car[]).map(upgrade);
}

async function readFileCars(): Promise<Car[]> {
  if (storageMode === "local") {
    try {
      return JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ LOCAL_FILE, "utf8")) as Car[];
    } catch {
      // aún no hay cambios locales
    }
  }
  return getSeedCars();
}

async function writeFileCars(cars: Car[]) {
  if (storageMode !== "local") {
    throw new Error(
      "El sitio está en modo demo. Conecta Upstash Redis en Vercel para poder guardar cambios.",
    );
  }
  await fs.writeFile(/*turbopackIgnore: true*/ LOCAL_FILE, JSON.stringify(cars, null, 2));
}

// Datos guardados con esquemas anteriores se leen ya convertidos
function upgrade(car: Car): Car {
  return { ...car, photoSections: normalizePhotoSections(car.photoSections) };
}

export async function listCars(): Promise<Car[]> {
  if (redis) {
    const all = await redis.hgetall<Record<string, Car>>(KEY);
    return all ? Object.values(all).map(upgrade) : [];
  }
  return (await readFileCars()).map(upgrade);
}

export async function getCar(id: string): Promise<Car | null> {
  const car = redis ? await redis.hget<Car>(KEY, id) : (await readFileCars()).find((c) => c.id === id);
  return car ? upgrade(car) : null;
}

export async function putCar(car: Car) {
  if (redis) {
    await redis.hset(KEY, { [car.id]: car });
    return;
  }
  const cars = await readFileCars();
  const i = cars.findIndex((c) => c.id === car.id);
  if (i >= 0) cars[i] = car;
  else cars.push(car);
  await writeFileCars(cars);
}

export async function removeCar(id: string) {
  if (redis) {
    await redis.hdel(KEY, id);
    return;
  }
  await writeFileCars((await readFileCars()).filter((c) => c.id !== id));
}

// ---------- Reseñas de clientes ----------
// Sin Redis no hay reseñas en producción (no se inventan); en desarrollo van a data/reviews.local.json.

const REVIEWS_KEY = "h3:reviews";
const LOCAL_REVIEWS = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "reviews.local.json");

async function readFileReviews(): Promise<Review[]> {
  if (storageMode !== "local") return [];
  try {
    return JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ LOCAL_REVIEWS, "utf8")) as Review[];
  } catch {
    return [];
  }
}

async function writeFileReviews(reviews: Review[]) {
  if (storageMode !== "local") {
    throw new Error("El sitio está en modo demo. Conecta Upstash Redis para poder guardar reseñas.");
  }
  await fs.writeFile(/*turbopackIgnore: true*/ LOCAL_REVIEWS, JSON.stringify(reviews, null, 2));
}

export async function listReviews(): Promise<Review[]> {
  if (redis) {
    const all = await redis.hgetall<Record<string, Review>>(REVIEWS_KEY);
    return all ? Object.values(all) : [];
  }
  return readFileReviews();
}

export async function putReview(review: Review) {
  if (redis) {
    await redis.hset(REVIEWS_KEY, { [review.id]: review });
    return;
  }
  const reviews = await readFileReviews();
  const i = reviews.findIndex((r) => r.id === review.id);
  if (i >= 0) reviews[i] = review;
  else reviews.push(review);
  await writeFileReviews(reviews);
}

export async function removeReview(id: string): Promise<Review | null> {
  if (redis) {
    const review = (await redis.hget<Review>(REVIEWS_KEY, id)) ?? null;
    await redis.hdel(REVIEWS_KEY, id);
    return review;
  }
  const reviews = await readFileReviews();
  const review = reviews.find((r) => r.id === id) ?? null;
  await writeFileReviews(reviews.filter((r) => r.id !== id));
  return review;
}

// ---------- Ajustes del panel (contraseña cifrada, números de confianza) ----------
// En desarrollo van a data/settings.local.json (ignorado por git).

const LOCAL_SETTINGS = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "settings.local.json");

async function readFileSettings(): Promise<Record<string, unknown>> {
  if (storageMode !== "local") return {};
  try {
    return JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ LOCAL_SETTINGS, "utf8")) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function getSetting<T>(key: string): Promise<T | null> {
  if (redis) return (await redis.get<T>(`h3:settings:${key}`)) ?? null;
  return ((await readFileSettings())[key] as T | undefined) ?? null;
}

// `null` borra el ajuste
export async function putSetting<T>(key: string, value: T | null) {
  if (redis) {
    if (value === null) await redis.del(`h3:settings:${key}`);
    else await redis.set(`h3:settings:${key}`, value);
    return;
  }
  if (storageMode !== "local") {
    throw new Error("El sitio está en modo demo. Conecta Upstash Redis para poder guardar ajustes.");
  }
  const all = await readFileSettings();
  if (value === null) delete all[key];
  else all[key] = value;
  await fs.writeFile(/*turbopackIgnore: true*/ LOCAL_SETTINGS, JSON.stringify(all, null, 2));
}

// ---------- Límite de intentos de login (solo con Redis) ----------

const LOGIN_WINDOW = 15 * 60;

export async function loginFailures(ip: string) {
  if (!redis) return 0;
  return (await redis.get<number>(`h3:login:${ip}`)) ?? 0;
}

export async function recordLoginFailure(ip: string) {
  if (!redis) return;
  const key = `h3:login:${ip}`;
  const n = await redis.incr(key);
  if (n === 1) await redis.expire(key, LOGIN_WINDOW);
}

export async function clearLoginFailures(ip: string) {
  if (redis) await redis.del(`h3:login:${ip}`);
}
