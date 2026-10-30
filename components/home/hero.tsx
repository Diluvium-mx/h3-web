import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { HeroLayers } from "@/components/home/hero-layers";
import { type Car } from "@/lib/cars";
import { site, whatsappUrl } from "@/lib/site";
import { vars } from "@/lib/ui";

export const GENERAL_MESSAGE = `Hola ${site.name} 👋 Vi su página y busco un auto. ¿Me pueden ayudar?`;

// Lo que quita miedos (todo es cierto para cualquier auto del sitio)
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

// Velocidad de cada capa al bajar (1 = va con la página; menos = se queda atrás, se siente lejos)
const layer = (speed: number) => ({ transform: `translate3d(0, calc(var(--y, 0px) * ${1 - speed}), 0)` });

// Hero de la versión 1 (skill /scroll-craft): capas reales. Fondo nocturno (hecho con Arcads, sin autos),
// la palabra «premium» gigante detrás, el BMW M3 real del inventario recortado encima con su reflejo en el
// piso mojado, y el texto al frente. El título se lee completo para lectores de pantalla y Google.
export function Hero({ rating }: { rating: Rating }) {
  return (
    <HeroLayers className="glow-night relative isolate flex min-h-[100svh] flex-col overflow-hidden text-white">
      {/* Capa 1: la noche (se aleja lento) */}
      <div className="absolute inset-0 -z-10 will-change-transform" style={layer(0.45)} aria-hidden="true">
        <picture>
          <source media="(min-width: 768px)" srcSet="/img/noche.webp" />
          <img
            src="/img/noche-movil.webp"
            alt=""
            fetchPriority="high"
            className="h-full w-full scale-105 object-cover object-[50%_40%] [filter:brightness(0.62)_saturate(0.9)]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-night/85 via-night/25 to-night" />
      </div>

      <h1 id="hero-title" className="contents">
        {/* Capa 2: qué es, con la palabra gigante detrás del auto */}
        <span
          className="pointer-events-none absolute inset-x-0 top-[29%] z-10 block text-center will-change-transform sm:top-[22%] lg:top-[16%]"
          style={layer(0.7)}
        >
          <span className="animate-rise block text-[1.05rem] font-semibold tracking-[0.18em] text-chrome/90 uppercase [animation-delay:100ms] sm:text-lg">
            Autos seminuevos{" "}
          </span>
          <span className="font-display animate-rise -mt-1 block text-[18.5vw] leading-none font-extrabold tracking-[-0.04em] text-chrome uppercase [animation-delay:200ms] [font-stretch:125%] lg:text-[14.5vw]">
            premium
          </span>
        </span>
        {/* Abajo, al frente: dónde */}
        <span className="sr-only"> en Villahermosa.</span>
      </h1>

      {/* Capa 3: el auto real, anclado al piso, con sombra de contacto y reflejo */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[40%] z-20 mx-auto w-[108vw] max-w-[1180px] -translate-x-[4vw] will-change-transform sm:top-[35%] sm:w-[86vw] sm:translate-x-0 lg:top-[31%] lg:w-[62vw]"
        style={layer(1)}
        aria-hidden="true"
      >
        <div className="animate-rise [animation-delay:350ms]">
          <span className="absolute inset-x-[8%] bottom-[2%] h-[12%] rounded-[50%] bg-black/80 blur-xl" />
          <picture>
            <source media="(min-width: 768px)" srcSet="/img/m3-recorte.webp" />
            <img
              src="/img/m3-recorte-800.webp"
              alt=""
              width={1400}
              height={594}
              className="relative w-full [filter:brightness(0.86)_contrast(1.06)_saturate(0.85)]"
            />
          </picture>
          {/* Reflejo en el piso mojado (el mismo archivo, volteado) */}
          {/* eslint-disable-next-line @next/next/no-img-element -- capa decorativa ya optimizada */}
          <img
            src="/img/m3-recorte-800.webp"
            alt=""
            width={1400}
            height={594}
            className="relative -mt-[3%] w-full -scale-y-100 opacity-25 [filter:blur(2px)_brightness(0.7)] [mask-image:linear-gradient(to_top,black,transparent_45%)]"
          />
        </div>
      </div>

      {/* Capa 4: el texto y los botones, al frente */}
      <div className="relative z-30 mx-auto mt-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="stagger flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div style={vars({ "--i": 3 })}>
            <p className="font-display text-[1.7rem] sm:text-4xl" aria-hidden="true">
              en Villahermosa.
            </p>
            <p className="mt-3 max-w-md text-[1.02rem] leading-relaxed text-white/75 sm:text-lg">
              Verificados, con papeles en regla y a precio justo.
              {rating.count > 0 && (
                <span className="mt-2 flex items-center gap-1.5 text-sm text-white">
                  <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />
                  {rating.avg.toFixed(1)} · {rating.count} {rating.count === 1 ? "reseña" : "reseñas"}
                </span>
              )}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex" style={vars({ "--i": 4 })}>
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
        </div>
      </div>
    </HeroLayers>
  );
}
