import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import {
  Categories,
  Contact,
  FeaturedCars,
  SellBanner,
  SoldStrip,
  WhyUs,
} from "@/components/home/sections";
import { getFeaturedCars, getPublicCars, getSoldCars } from "@/lib/data";

export default async function HomePage() {
  const [cars, featured, sold] = await Promise.all([getPublicCars(), getFeaturedCars(8), getSoldCars()]);
  const brands = [...new Set(cars.map((c) => c.brand))];

  return (
    <>
      <Hero cars={featured.slice(0, 4)} total={cars.length} />
      {brands.length > 0 && <Marquee items={brands} />}
      {featured.length > 0 && <FeaturedCars cars={featured} />}
      {cars.length > 0 && <Categories cars={cars} />}
      <WhyUs />
      <SellBanner />
      <SoldStrip cars={sold} />
      <Contact />
    </>
  );
}
