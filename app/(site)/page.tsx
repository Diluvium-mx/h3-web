import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { ReviewsWall } from "@/components/home/reviews";
import {
  Benefits,
  BuySection,
  Closer,
  Comparison,
  Faq,
  HowItWorks,
  Inventory,
  SellSection,
  Signature,
  SoldStrip,
  Tour,
} from "@/components/home/sections";
import { getFeaturedCars, getPublicCars, getReviews, getSoldCars } from "@/lib/data";
import { reviewSummary } from "@/lib/reviews";

// Versión 1 (skill /scroll-craft, 30-oct): hero con capas → marcas → inventario → recorrido de un auto con el
// scroll → beneficios (al comprar | al vender) → autos verificados → vende tu auto → reseñas → certeza vs. lo de
// siempre → el mensaje se escribe solo (movimiento firma) → cómo funciona (con cita) → vendidos → preguntas → cierre.
export default async function HomePage() {
  const [cars, featured, sold, reviews] = await Promise.all([
    getPublicCars(),
    getFeaturedCars(8),
    getSoldCars(),
    getReviews(),
  ]);
  const rating = reviewSummary(reviews);
  const brands = [...new Set(cars.map((c) => c.brand))];
  // El carrusel de «Autos verificados» muestra otros autos que no estén ya en la cuadrícula (si hay suficientes)
  const shown = new Set(featured.map((c) => c.id));
  const others = cars.filter((c) => !shown.has(c.id) && c.status !== "vendido");
  const verified = others.length >= 4 ? others : cars.filter((c) => c.status !== "vendido");

  return (
    <>
      <Hero rating={rating} />
      {brands.length > 0 && (
        <section aria-label="Marcas en inventario" className="overflow-hidden pt-10 pb-2 sm:pt-14">
          <Marquee items={brands} />
        </section>
      )}
      {featured.length > 0 && <Inventory cars={cars} featured={featured} />}
      <Tour cars={cars} />
      <Benefits />
      <BuySection cars={verified} />
      <SellSection />
      <ReviewsWall reviews={reviews} />
      <Comparison />
      <Signature featured={featured} />
      <HowItWorks />
      <SoldStrip cars={sold} />
      <Faq />
      <Closer rating={rating} cars={featured} />
    </>
  );
}
