import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";
import { getStore } from "@netlify/blobs";
import type { Car } from "./cars";
import { normalizePhotoSections } from "./equipment";
import type { Review } from "./reviews";
import seed from "@/data/seed.json";

// Almacenamiento del inventario, las reseñas y los ajustes del panel.
// - Con Upstash Redis (si se conecta): ahí.
// - En Netlify sin Upstash: Netlify Blobs, incluido en el plan gratuito y sin cuenta extra. Es el mismo
//   almacén para producción y para las vistas previas (las 2 versiones comparten inventario y contraseña).
// - Sin nada (otro hosting): data/seed.json, solo lectura (modo demo).
// - En desarrollo: data/cars.local.json, data/reviews.local.json y data/settings.local.json.

const KEY = "h3:cars";

const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

export type StorageMode = "redis" | "blobs" | "local" | "demo";

// En Netlify: lo marca la compilación (H3_NETLIFY) o, ya corriendo, el contexto de Netlify Blobs
function onNetlify() {
  const g = globalThis as { netlifyBlobsContext?: unknown };
  return process.env.H3_NETLIFY === "1" || Boolean(g.netlifyBlobsContext || process.env.NETLIFY_BLOBS_CONTEXT);
}

export function getStorageMode(): StorageMode {
  if (redis) return "redis";
  if (onNetlify()) return "blobs";
  return process.env.NODE_ENV === "production" ? "demo" : "local";
}

// Netlify Blobs: un JSON por tipo de dato. Lectura «fuerte» para ver al instante lo que se acaba de guardar.
// Mientras se compila el sitio, Netlify Blobs no está disponible: entonces se usa el inventario base y el
// sitio se actualiza solo en cuanto corre (ver lib/data.ts).
class BlobsUnavailable extends Error {}

const building = process.env.NEXT_PHASE === "phase-production-build";
// Cada petición a Netlify Blobs tiene un límite de tiempo: al compilar, si no responde, se sigue con el
// inventario base en lugar de quedarse esperando
const timedFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, signal: AbortSignal.timeout(building ? 5000 : 15000) });

function blobs() {
  try {
    return getStore({ name: "h3", consistency: "strong", fetch: timedFetch });
  } catch {
    throw new BlobsUnavailable("Netlify Blobs no está disponible aquí");
  }
}

async function readBlob<T>(key: string): Promise<T | null> {
  try {
    return ((await blobs().get(key, { type: "json" })) as T | null) ?? null;
  } catch (e) {
    // Lecturas del sitio público: se sigue con el inventario base. Lo que guarda (panel) sí marca el error.
    throw e instanceof BlobsUnavailable ? e : new BlobsUnavailable(`Netlify Blobs no respondió: ${e}`);
  }
}

async function writeBlob(key: string, value: unknown) {
  await blobs().setJSON(key, value);
}

// Solo se usa en desarrollo local (sin Redis)
const LOCAL_FILE = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "cars.local.json");

export async function getSeedCars(): Promise<Car[]> {
  // El tipo que TypeScript deduce del JSON es demasiado específico (una variante por auto)
  return (structuredClone(seed) as unknown as Car[]).map(upgrade);
}

async function readFileCars(): Promise<Car[]> {
  if (getStorageMode() === "local") {
    try {
      return JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ LOCAL_FILE, "utf8")) as Car[];
    } catch {
      // aún no hay cambios locales
    }
  }
  if (getStorageMode() === "blobs") return (await readBlob<Car[]>("cars")) ?? getSeedCars();
  return getSeedCars();
}

async function writeFileCars(cars: Car[]) {
  if (getStorageMode() === "blobs") return writeBlob("cars", cars);
  if (getStorageMode() !== "local") {
    throw new Error("El sitio está en modo demo: conecta Upstash Redis o publícalo en Netlify para guardar cambios.");
  }
  await fs.writeFile(/*turbopackIgnore: true*/ LOCAL_FILE, JSON.stringify(cars, null, 2));
}

// Datos guardados con esquemas anteriores se leen ya convertidos
function upgrade(car: Car): Car {
  return { ...car, photoSections: normalizePhotoSections(car.photoSections) };
}

// `live: false` = no se pudo leer el almacén (compilación en Netlify) y se usó el inventario base
export async function readCars(): Promise<{ cars: Car[]; live: boolean }> {
  if (redis) {
    const all = await redis.hgetall<Record<string, Car>>(KEY);
    return { cars: all ? Object.values(all).map(upgrade) : [], live: true };
  }
  try {
    return { cars: (await readFileCars()).map(upgrade), live: getStorageMode() !== "demo" };
  } catch (e) {
    if (!(e instanceof BlobsUnavailable)) throw e;
    return { cars: await getSeedCars(), live: false };
  }
}

export async function listCars(): Promise<Car[]> {
  return (await readCars()).cars;
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
// No se inventan: sin almacén no hay reseñas. En desarrollo van a data/reviews.local.json.

const REVIEWS_KEY = "h3:reviews";
const LOCAL_REVIEWS = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "reviews.local.json");

async function readFileReviews(): Promise<Review[]> {
  if (getStorageMode() === "blobs") return (await readBlob<Review[]>("reviews")) ?? [];
  if (getStorageMode() !== "local") return [];
  try {
    return JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ LOCAL_REVIEWS, "utf8")) as Review[];
  } catch {
    return [];
  }
}

async function writeFileReviews(reviews: Review[]) {
  if (getStorageMode() === "blobs") return writeBlob("reviews", reviews);
  if (getStorageMode() !== "local") {
    throw new Error("El sitio está en modo demo. Conecta Upstash Redis para poder guardar reseñas.");
  }
  await fs.writeFile(/*turbopackIgnore: true*/ LOCAL_REVIEWS, JSON.stringify(reviews, null, 2));
}

export async function readReviews(): Promise<{ reviews: Review[]; live: boolean }> {
  if (redis) {
    const all = await redis.hgetall<Record<string, Review>>(REVIEWS_KEY);
    return { reviews: all ? Object.values(all) : [], live: true };
  }
  try {
    return { reviews: await readFileReviews(), live: true };
  } catch (e) {
    if (!(e instanceof BlobsUnavailable)) throw e;
    return { reviews: [], live: false };
  }
}

export async function listReviews(): Promise<Review[]> {
  return (await readReviews()).reviews;
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

// ---------- Ajustes del panel (contraseña cifrada y llave de la sesión) ----------
// En desarrollo van a data/settings.local.json (ignorado por git).

const LOCAL_SETTINGS = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "settings.local.json");

async function readFileSettings(): Promise<Record<string, unknown>> {
  if (getStorageMode() === "blobs") return (await readBlob<Record<string, unknown>>("settings")) ?? {};
  if (getStorageMode() !== "local") return {};
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
  if (getStorageMode() !== "local" && getStorageMode() !== "blobs") {
    throw new Error("El sitio está en modo demo. Conecta Upstash Redis para poder guardar ajustes.");
  }
  const all = await readFileSettings();
  if (value === null) delete all[key];
  else all[key] = value;
  if (getStorageMode() === "blobs") return writeBlob("settings", all);
  await fs.writeFile(/*turbopackIgnore: true*/ LOCAL_SETTINGS, JSON.stringify(all, null, 2));
}

// ---------- Límite de intentos de login (con Redis o Netlify Blobs) ----------

const LOGIN_WINDOW = 15 * 60;
type Failures = { n: number; until: number };
const loginKey = (ip: string) => `login-${ip.replace(/[^\w.:-]/g, "").slice(0, 64)}`;

async function readFailures(ip: string): Promise<Failures | null> {
  const f = await readBlob<Failures>(loginKey(ip)).catch(() => null);
  return f && f.until > Date.now() ? f : null;
}

export async function loginFailures(ip: string) {
  if (redis) return (await redis.get<number>(`h3:login:${ip}`)) ?? 0;
  if (getStorageMode() === "blobs") return (await readFailures(ip))?.n ?? 0;
  return 0;
}

export async function recordLoginFailure(ip: string) {
  if (redis) {
    const key = `h3:login:${ip}`;
    const n = await redis.incr(key);
    if (n === 1) await redis.expire(key, LOGIN_WINDOW);
    return;
  }
  if (getStorageMode() !== "blobs") return;
  const f = (await readFailures(ip)) ?? { n: 0, until: Date.now() + LOGIN_WINDOW * 1000 };
  await writeBlob(loginKey(ip), { ...f, n: f.n + 1 }).catch(() => {});
}

export async function clearLoginFailures(ip: string) {
  if (redis) await redis.del(`h3:login:${ip}`);
  else if (getStorageMode() === "blobs") await blobs().delete(loginKey(ip)).catch(() => {});
}
