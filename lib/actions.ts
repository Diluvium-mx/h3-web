"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import {
  BODY_TYPES,
  FUELS,
  STATUSES,
  TRANSMISSIONS,
  parseVideo,
  slugify,
  type Car,
  type CarStatus,
} from "./cars";
import { requireAdmin } from "./auth";
import { REVIEW_SOURCES, type Review } from "./reviews";
import { checkPassword, createSessionToken, SESSION_COOKIE, SESSION_DAYS } from "./session";
import {
  clearLoginFailures,
  getCar,
  getSeedCars,
  listCars,
  loginFailures,
  putCar,
  putReview,
  recordLoginFailure,
  removeCar,
  removeReview,
} from "./storage";
import { deleteImages, isAllowedImageUrl, saveImage, storeRemoteImage } from "./images";
import { shopifyToCar, type ShopifyProduct } from "./shopify";

export type ActionResult<T = object> = ({ ok: true } & T) | { ok: false; error: string };

// ---------- Sesión ----------

const MAX_LOGIN_FAILURES = 8;

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if ((await loginFailures(ip)) >= MAX_LOGIN_FAILURES) {
    return { error: "Demasiados intentos. Espera 15 minutos e inténtalo de nuevo." };
  }
  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) {
    await recordLoginFailure(ip);
    await new Promise((r) => setTimeout(r, 700));
    return { error: "Contraseña incorrecta" };
  }
  await clearLoginFailures(ip);
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ---------- Validación ----------

export type CarInput = Omit<Car, "id" | "slug" | "createdAt" | "updatedAt" | "shopifyHandle"> & {
  id?: string;
};

function str(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
function int(v: unknown) {
  const n = typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && String(v ?? "").trim() !== "" ? Math.round(n) : undefined;
}
function oneOf<T extends readonly string[]>(list: T, v: unknown): T[number] | undefined {
  return list.includes(v as string) ? (v as T[number]) : undefined;
}

function validate(raw: CarInput): { car?: Omit<CarInput, "id">; error?: string } {
  const maxYear = new Date().getFullYear() + 1;
  const brand = str(raw.brand, 40);
  const model = str(raw.model, 60);
  const year = int(raw.year);
  const price = int(raw.price);
  const body = oneOf(BODY_TYPES, raw.body);
  if (!brand) return { error: "Escribe la marca." };
  if (!model) return { error: "Escribe el modelo." };
  if (!year || year < 1950 || year > maxYear) return { error: `El año debe estar entre 1950 y ${maxYear}.` };
  if (!price || price < 1 || price > 200_000_000) return { error: "Escribe un precio válido." };
  if (!body) return { error: "Elige el tipo de auto." };
  const images = (Array.isArray(raw.images) ? raw.images : []).filter(
    (u): u is string => typeof u === "string" && isAllowedImageUrl(u),
  );
  if (images.length > 40) return { error: "Máximo 40 fotos por auto." };
  const mileage = int(raw.mileage);
  const doors = int(raw.doors);
  const videoRaw = str(raw.video, 300);
  const video = parseVideo(videoRaw);
  if (videoRaw && !video) return { error: "El video debe ser un enlace de YouTube, TikTok, Instagram o Facebook." };
  return {
    car: {
      brand,
      model,
      version: str(raw.version, 60) || undefined,
      year,
      price,
      mileage: mileage != null && mileage >= 0 && mileage < 5_000_000 ? mileage : undefined,
      transmission: oneOf(TRANSMISSIONS, raw.transmission),
      fuel: oneOf(FUELS, raw.fuel),
      body,
      engine: str(raw.engine, 60) || undefined,
      drivetrain: str(raw.drivetrain, 30) || undefined,
      color: str(raw.color, 40) || undefined,
      doors: doors && doors >= 2 && doors <= 6 ? doors : undefined,
      armored: Boolean(raw.armored),
      features: (Array.isArray(raw.features) ? raw.features : [])
        .map((f) => str(f, 60))
        .filter(Boolean)
        .slice(0, 30),
      description: str(raw.description, 6000),
      images,
      video: video?.url,
      status: oneOf(STATUSES, raw.status) ?? "disponible",
      featured: Boolean(raw.featured),
    },
  };
}

function uniqueSlug(base: string, cars: Car[], selfId?: string) {
  const taken = new Set(cars.filter((c) => c.id !== selfId).map((c) => c.slug));
  let slug = base || "auto";
  for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
  return slug;
}

function clean<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

function changed() {
  updateTag("cars");
  refresh();
}

// ---------- Autos ----------

export async function saveCarAction(input: CarInput): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();
  const { car, error } = validate(input);
  if (!car) return { ok: false, error: error ?? "Datos inválidos" };
  try {
    const cars = await listCars();
    const now = new Date().toISOString();
    const existing = input.id ? cars.find((c) => c.id === input.id) : undefined;
    const id = existing?.id ?? crypto.randomUUID().slice(0, 12);
    const slug =
      existing?.slug ?? uniqueSlug(slugify(`${car.brand} ${car.model} ${car.version ?? ""} ${car.year}`), cars);
    const next: Car = clean({
      ...car,
      id,
      slug,
      shopifyHandle: existing?.shopifyHandle,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
    await putCar(next);
    if (existing) {
      const removed = existing.images.filter((u) => !next.images.includes(u));
      if (removed.length) await deleteImages(removed);
    }
    updateTag("cars");
    return { ok: true, id, slug };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo guardar" };
  }
}

export async function updateCarAction(
  id: string,
  patch: { status?: CarStatus; featured?: boolean },
): Promise<ActionResult> {
  await requireAdmin();
  try {
    const car = await getCar(id);
    if (!car) return { ok: false, error: "El auto ya no existe" };
    const status = patch.status ? oneOf(STATUSES, patch.status) : car.status;
    await putCar({
      ...car,
      status: status ?? car.status,
      featured: patch.featured ?? car.featured,
      updatedAt: new Date().toISOString(),
    });
    changed();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo actualizar" };
  }
}

export async function deleteCarAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const car = await getCar(id);
    if (!car) return { ok: true };
    await removeCar(id);
    await deleteImages(car.images);
    changed();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo eliminar" };
  }
}

// ---------- Reseñas ----------

export type ReviewInput = Omit<Review, "id" | "createdAt">;

export async function saveReviewAction(input: ReviewInput): Promise<ActionResult<{ review: Review }>> {
  await requireAdmin();
  const name = str(input.name, 60);
  const text = str(input.text, 700);
  const stars = int(input.stars);
  if (!name) return { ok: false, error: "Escribe el nombre del cliente." };
  if (!text) return { ok: false, error: "Escribe lo que dijo el cliente." };
  if (!stars || stars < 1 || stars > 5) return { ok: false, error: "Elige de 1 a 5 estrellas." };
  const photo = typeof input.photo === "string" && isAllowedImageUrl(input.photo) ? input.photo : undefined;
  const review: Review = clean({
    id: crypto.randomUUID().slice(0, 12),
    name,
    text,
    highlight: str(input.highlight, 90) || undefined,
    car: str(input.car, 60) || undefined,
    stars,
    source: oneOf(REVIEW_SOURCES, input.source),
    photo,
    createdAt: new Date().toISOString(),
  });
  try {
    await putReview(review);
    updateTag("reviews");
    return { ok: true, review };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo guardar" };
  }
}

export async function deleteReviewAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const review = await removeReview(id);
    if (review?.photo) await deleteImages([review.photo]);
    updateTag("reviews");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo eliminar" };
  }
}

// ---------- Fotos (modo local / respaldo) ----------

export async function uploadImageAction(formData: FormData): Promise<ActionResult<{ url: string }>> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "Archivo inválido" };
  if (!file.type.startsWith("image/")) return { ok: false, error: "Solo se permiten imágenes" };
  if (file.size > 8 * 1024 * 1024) return { ok: false, error: "La foto pesa más de 8 MB" };
  try {
    const url = await saveImage(slugify(file.name) || "foto", file, file.type);
    return { ok: true, url };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo subir" };
  }
}

// ---------- Importar desde Shopify ----------

function storeBase(url: string) {
  const u = new URL(url.startsWith("http") ? url : `https://${url}`);
  if (u.protocol !== "https:") throw new Error("Usa una dirección https://");
  return u.origin;
}

export type ShopifyListItem = {
  handle: string;
  title: string;
  price: number;
  image?: string;
  images: number;
  imported: boolean;
};

export async function listShopifyAction(store: string): Promise<ActionResult<{ items: ShopifyListItem[] }>> {
  await requireAdmin();
  try {
    const res = await fetch(`${storeBase(store)}/products.json?limit=250`, { cache: "no-store" });
    if (!res.ok) return { ok: false, error: `La tienda respondió ${res.status}` };
    const { products } = (await res.json()) as { products: ShopifyProduct[] };
    const handles = new Set((await listCars()).map((c) => c.shopifyHandle).filter(Boolean));
    return {
      ok: true,
      items: products.map((p) => ({
        handle: p.handle,
        title: p.title,
        price: Math.round(Number(p.variants[0]?.price ?? 0)),
        image: p.images[0]?.src,
        images: p.images.length,
        imported: handles.has(p.handle),
      })),
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo leer la tienda" };
  }
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>) {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

export async function importShopifyAction(
  store: string,
  handle: string,
): Promise<ActionResult<{ slug: string }>> {
  await requireAdmin();
  try {
    const base = storeBase(store);
    const res = await fetch(`${base}/products/${encodeURIComponent(handle)}.json`, { cache: "no-store" });
    if (!res.ok) return { ok: false, error: `No se encontró ${handle}` };
    const { product } = (await res.json()) as { product: ShopifyProduct };
    const cars = await listCars();
    if (cars.some((c) => c.shopifyHandle === handle)) return { ok: false, error: "Ya estaba importado" };

    const draft = shopifyToCar(product);
    // Si el auto está en el inventario curado, usa esos datos (más completos)
    const curated = (await getSeedCars()).find((c) => c.shopifyHandle === handle);

    // Cloudinary descarga cada foto directo de Shopify (no pasa por el hosting)
    const images = await mapLimit(draft.sourceImages, 4, async (src, i) =>
      storeRemoteImage(src, `${draft.slugBase}-${i + 1}`).catch(() => null),
    );

    const { sourceImages: _s, slugBase, ...fields } = draft;
    void _s;
    const now = new Date().toISOString();
    const car: Car = clean({
      ...fields,
      ...(curated ? { ...curated, images: undefined, id: undefined } : {}),
      id: crypto.randomUUID().slice(0, 12),
      slug: uniqueSlug(curated?.slug ?? slugBase, cars),
      images: images.filter((u): u is string => Boolean(u)),
      shopifyHandle: handle,
      updatedAt: now,
    }) as Car;
    await putCar(car);
    updateTag("cars");
    return { ok: true, slug: car.slug };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo importar" };
  }
}
