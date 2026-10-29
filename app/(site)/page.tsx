import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { ReviewsWall } from "@/components/home/reviews";
import {
  Closer,
  Comparison,
  Faq,
  HowItWorks,
  Inventory,
  SellSection,
  SoldStrip,
  ValueProps,
} from "@/components/home/sections";
import { getFeaturedCars, getPublicCars, getReviews, getSoldCars } from "@/lib/data";
import { reviewSummary } from "@/lib/reviews";

// Estructura de landing de los videos analizados (ver ANALISIS-VIDEOS.md), con el estilo que pidió el dueño
// (29-oct: más impacto y color sutil): hero a pantalla completa → marcas → inventario → vende tu auto →
// reseñas → dolor vs. solución → beneficios → cómo funciona → vendidos → preguntas → cierre con contacto.
export default async function HomePage() {
  const [cars, featured, sold, reviews] = await Promise.all([
    getPublicCars(),
    getFeaturedCars(8),
    getSoldCars(),
    getReviews(),
  ]);
  const rating = reviewSummary(reviews);
  const brands = [...new Set(cars.map((c) => c.brand))];

  return (
    <>
      <Hero featured={featured.slice(0, 4)} cars={cars} rating={rating} />
      {brands.length > 0 && (
        <section aria-label="Marcas en inventario" className="overflow-hidden pt-10 pb-2 sm:pt-14">
          <Marquee items={brands} />
        </section>
      )}
      {featured.length > 0 && <Inventory cars={cars} featured={featured} />}
      <SellSection />
      <ReviewsWall reviews={reviews} />
      <Comparison />
      <ValueProps featured={featured} />
      <HowItWorks />
      <SoldStrip cars={sold} />
      <Faq />
      <Closer rating={rating} />
    </>
  );
}
