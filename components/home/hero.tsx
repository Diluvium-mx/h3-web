import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { HeroCarousel, type HeroSlide } from "@/components/home/hero-carousel";
import { formatPrice, type Car } from "@/lib/cars";
import { site, whatsappUrl } from "@/lib/site";
import { vars } from "@/lib/ui";

export const GENERAL_MESSAGE = `Hola ${site.name} 👋 Vi su página y busco un auto. ¿Me pueden ayudar?`;

// Lo que quita miedos junto al botón (todo es cierto para cualquier auto del sitio)
export const FUDS = ["Autos verificados", "Papeles en regla", "Precio a la vista"];

export type Rating = { count: number; avg: number };

// Cuántos autos hay de cada tipo (los blindados cuentan también como su carrocería)
export function countTypes(cars: Car[]) {
  const types = new Map<string, number>();
  for (const car of cars) {
    for (const t of car.armored ? [car.body, "Blindado"] : [car.body]) types.set(t, (types.get(t) ?? 0) + 1);
  }
  return [...types.entries()].sort((a, b) => b[1] - a[1]);
}

// Hero de la versión 2 (pedido del dueño, 30-oct): fotos reales fijas en un carrusel que se desliza y
// cambia solo, sin luces ni zoom, paleta natural y el auto que se ve abajo a la derecha de la foto.
export function Hero({ featured, rating }: { featured: Car[]; rating: Rating }) {
  const slides: HeroSlide[] = featured
    .filter((c) => c.images[0])
    .slice(0, 5)
    .map((c) => ({
      slug: c.slug,
      image: c.images[0],
      alt: `${c.brand} ${c.model} ${c.year} en H3 Seminuevos`,
      eyebrow: `${c.year} · ${c.brand}`,
      model: c.model,
      price: formatPrice(c.price),
    }));

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-night text-white lg:min-h-[92svh] lg:flex-row"
      aria-labelledby="hero-title"
    >
      {/* Fotos: arriba en celular, a la derecha en computadora */}
      <div className="relative h-[56svh] shrink-0 lg:order-2 lg:h-auto lg:w-[60%]">
        <HeroCarousel slides={slides} />
        {/* Sombra suave para que el encabezado y el texto se lean (solo donde hace falta) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-night/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-night to-transparent lg:inset-y-0 lg:right-auto lg:left-0 lg:h-auto lg:w-28 lg:bg-gradient-to-r" />
      </div>

      {/* Texto: qué es, dónde, por qué confiar y el botón */}
      <div className="relative flex flex-1 items-center lg:w-[40%]">
        <div className="stagger w-full px-4 pt-2 pb-8 sm:px-6 lg:mx-auto lg:max-w-xl lg:py-28 lg:pl-10 xl:pl-[max(2.5rem,calc((100vw-80rem)/2+1.5rem))]">
          <p className="font-tech flex items-center gap-3 text-[11px] text-white/65" style={vars({ "--i": 0 })}>
            <span className="draw-line rule-accent h-px w-8" />
            {rating.count > 0 ? (
              // Prueba social arriba del título (solo con reseñas reales)
              <span className="flex items-center gap-1.5 text-white">
                <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />
                {rating.avg.toFixed(1)} · {rating.count} {rating.count === 1 ? "reseña" : "reseñas"}
              </span>
            ) : (
              "Villahermosa, Tabasco"
            )}
          </p>
          <h1
            id="hero-title"
            className="font-display mt-4 text-[2.4rem] leading-[1.02] sm:text-6xl lg:text-[3.9rem]"
            style={vars({ "--i": 1 })}
          >
            Autos seminuevos premium en Villahermosa.
          </h1>
          <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-white/72 sm:text-lg" style={vars({ "--i": 2 })}>
            Verificados, con papeles en regla y a precio justo. Escríbenos y te asesoramos por WhatsApp.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex" style={vars({ "--i": 3 })}>
            <Link href="/autos" className="btn btn-light btn-shine group px-3 whitespace-nowrap sm:px-[1.35rem]">
              Ver inventario
              <ArrowRight className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
            </Link>
            <a
              href={whatsappUrl(GENERAL_MESSAGE)}
              target="_blank"
              rel="noopener"
              className="btn btn-wa btn-shine group px-3 whitespace-nowrap sm:px-[1.35rem]"
            >
              <WhatsAppIcon className="size-[1.15rem] transition-transform duration-500 group-hover:-rotate-12" />
              WhatsApp
            </a>
          </div>
          {/* En celular se omiten: el subtítulo ya lo dice */}
          <ul className="mt-5 hidden flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-white/70 sm:flex" style={vars({ "--i": 4 })}>
            {FUDS.map((f) => (
              <li key={f} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-wa" strokeWidth={2.5} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
