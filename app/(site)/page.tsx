import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { ReviewsWall } from "@/components/home/reviews";
import { Benefits, BuySection, Closer, Comparison, Faq, Inventory } from "@/components/home/sections";
import { getFeaturedCars, getPublicCars, getReviews } from "@/lib/data";
import { reviewSummary } from "@/lib/reviews";

// Inicio más corto y simple (pedido del dueño, 31-oct): hero → marcas → inventario → beneficios (al comprar
// | al vender, con imagen) → autos verificados → reseñas (solo si hay reales) → comparativa → preguntas →
// cierre con carrusel y oficina.
export default async function HomePage() {
  const [cars, featured, reviews] = await Promise.all([getPublicCars(), getFeaturedCars(8), getReviews()]);
  const rating = reviewSummary(reviews);
  const brands = [...new Set(cars.map((c) => c.brand))];
  // El carrusel de «Autos verificados» muestra otros autos que no estén ya en la cuadrícula (si hay suficientes)
  const shown = new Set(featured.map((c) => c.id));
  const others = cars.filter((c) => !shown.has(c.id) && c.status !== "vendido");
  const verified = others.length >= 4 ? others : cars.filter((c) => c.status !== "vendido");

  return (
    <>
      <Hero featured={featured.slice(0, 5)} rating={rating} />
      {brands.length > 0 && (
        <section aria-label="Marcas en inventario" className="relative z-10 overflow-hidden">
          <Marquee items={brands} />
        </section>
      )}
      {featured.length > 0 && <Inventory cars={cars} featured={featured} />}
      <Benefits />
      <BuySection cars={verified} />
      <ReviewsWall reviews={reviews} />
      <Comparison />
      <Faq />
      <Closer rating={rating} cars={featured} />
    </>
  );
}
