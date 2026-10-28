import { Hero, ProofBar } from "@/components/home/hero";
import { ReviewsWall } from "@/components/home/reviews";
import {
  Closer,
  Comparison,
  Faq,
  HowItWorks,
  Inventory,
  SellBanner,
  SoldStrip,
  ValueProps,
} from "@/components/home/sections";
import { getFeaturedCars, getPublicCars, getReviews, getSoldCars } from "@/lib/data";
import { reviewSummary } from "@/lib/reviews";

// Estructura de landing de los videos analizados (ver ANALISIS-VIDEOS.md):
// hero con prueba social → prueba social 2 → producto → reseñas → dolor vs. solución → beneficios →
// cómo funciona → más prueba social → oferta secundaria → preguntas → cierre con urgencia y contacto.
export default async function HomePage() {
  const [cars, featured, sold, reviews] = await Promise.all([
    getPublicCars(),
    getFeaturedCars(8),
    getSoldCars(),
    getReviews(),
  ]);
  const available = cars.filter((c) => c.status === "disponible").length;
  const rating = reviewSummary(reviews);

  return (
    <>
      <Hero cars={featured.slice(0, 4)} total={cars.length} available={available} rating={rating} />
      <ProofBar cars={cars} available={available} />
      {featured.length > 0 && <Inventory cars={cars} featured={featured} />}
      <ReviewsWall reviews={reviews} />
      <Comparison />
      <ValueProps cars={cars} featured={featured} />
      <HowItWorks />
      <SoldStrip cars={sold} />
      <SellBanner />
      <Faq />
      <Closer available={available} rating={rating} />
    </>
  );
}
