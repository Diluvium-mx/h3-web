import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { isPublic, sortNewest, type Car } from "./cars";
import { sortReviews } from "./reviews";
import { readCars, readReviews } from "./storage";

// Lecturas cacheadas para el sitio público. El panel invalida la etiqueta
// "cars" cada vez que se guarda un cambio, así que el sitio se actualiza al instante.
// Si el almacén no se pudo leer (al compilar en Netlify, donde Netlify Blobs aún no existe), se usa el
// inventario base solo por unos minutos: ya publicado, el sitio vuelve a leer y muestra los datos guardados.
export async function getAllCars(): Promise<Car[]> {
  "use cache";
  cacheTag("cars");
  const { cars, live } = await readCars();
  if (live) cacheLife("days");
  else cacheLife("minutes");
  return cars.sort(sortNewest);
}

export async function getReviews() {
  "use cache";
  cacheTag("reviews");
  const { reviews, live } = await readReviews();
  if (live) cacheLife("days");
  else cacheLife("minutes");
  return reviews.sort(sortReviews);
}

export async function getPublicCars() {
  return (await getAllCars()).filter(isPublic);
}

export async function getSoldCars() {
  return (await getAllCars()).filter((c) => c.status === "vendido");
}

export async function getCarBySlug(slug: string) {
  return (await getAllCars()).find((c) => c.slug === slug) ?? null;
}

export async function getFeaturedCars(limit = 8) {
  const cars = await getPublicCars();
  const featured = cars.filter((c) => c.featured);
  const rest = cars.filter((c) => !c.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function similarCars(car: Car, cars: Car[], limit = 4) {
  return cars
    .filter((c) => c.id !== car.id && isPublic(c))
    .map((c) => ({
      c,
      score:
        (c.body === car.body ? 2 : 0) +
        (c.brand === car.brand ? 1 : 0) +
        (Math.abs(c.price - car.price) / Math.max(car.price, 1) < 0.35 ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.c);
}
