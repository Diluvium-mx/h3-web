import { Hero, TrustBar } from "@/components/home/hero";
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
import { getFeaturedCars, getPublicCars, getReviews, getSoldCars, getTrustStats } from "@/lib/data";
import { reviewSummary } from "@/lib/reviews";
import { EXAMPLE_STATS } from "@/lib/settings";

// Estructura de landing de los videos analizados (ver ANALISIS-VIDEOS.md), con el estilo premium que pidió
// el dueño (28-oct): hero claro → números de confianza y marcas → inventario → vende tu auto → reseñas →
// dolor vs. solución → beneficios → cómo funciona → vendidos → preguntas → cierre con contacto.
export default async function HomePage() {
  const [cars, featured, sold, reviews, saved] = await Promise.all([
    getPublicCars(),
    getFeaturedCars(8),
    getSoldCars(),
    getReviews(),
    getTrustStats(),
  ]);
  const rating = reviewSummary(reviews);
  // Los números de ejemplo solo se ven en desarrollo; en el sitio publicado van los que guarde el dueño
  const example = !saved && process.env.NODE_ENV !== "production";
  const stats = saved ?? (example ? EXAMPLE_STATS : null);
  const brands = [...new Set(cars.map((c) => c.brand))];

  return (
    <>
      <Hero cars={featured.slice(0, 4)} rating={rating} />
      <TrustBar stats={stats} brands={brands} example={example} />
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
