import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { AfterLoad } from "@/components/after-load";
import { BodyIcon } from "@/components/body-icons";
import { TYPE_LABEL } from "@/components/category-tile";
import { formatPrice, type Car } from "@/lib/cars";
import { site, whatsappUrl } from "@/lib/site";
import { vars } from "@/lib/ui";

export const GENERAL_MESSAGE = `Hola ${site.name} 👋 Vi su página y busco un auto. ¿Me pueden ayudar?`;

// Lo que quita miedos junto al botón (todo es cierto para cualquier auto del sitio)
export const FUDS = ["Precio a la vista", "Fotos reales de cada auto", "Respuesta inmediata"];

export type Rating = { count: number; avg: number };

// Cuántos autos hay de cada tipo (los blindados cuentan también como su carrocería)
export function countTypes(cars: Car[]) {
  const types = new Map<string, number>();
  for (const car of cars) {
    for (const t of car.armored ? [car.body, "Blindado"] : [car.body]) types.set(t, (types.get(t) ?? 0) + 1);
  }
  return [...types.entries()].sort((a, b) => b[1] - a[1]);
}

// Estelas de luz que cruzan entre la foto y el texto (velocidad)
const TRAILS = [
  { top: "44%", d: "5.5s", delay: "0.4s" },
  { top: "50%", d: "6.5s", delay: "2.2s" },
  { top: "57%", d: "5s", delay: "3.6s" },
  { top: "39%", d: "7s", delay: "5s" },
];

export function Hero({ featured, cars, rating }: { featured: Car[]; cars: Car[]; rating: Rating }) {
  const withPhoto = featured.filter((c) => c.images[0]);
  // La animación CSS está calculada para 4 diapositivas
  const slides =
    withPhoto.length >= 2
      ? Array.from({ length: 4 }, (_, i) => withPhoto[i % withPhoto.length])
      : withPhoto.slice(0, 1);
  const types = countTypes(cars);

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-night text-white lg:min-h-[94svh]"
      aria-labelledby="hero-title"
    >
      {/* Fotos reales del inventario a pantalla completa, con zoom lento */}
      <div
        className="hero-slides absolute inset-x-0 top-0 -z-10 h-[68svh] lg:inset-y-0 lg:left-[36%] lg:h-auto"
        data-count={slides.length}
      >
        {slides.map((car, i) => (
          <div key={i} className="hero-slide absolute inset-0 overflow-hidden" style={vars({ "--i": i })}>
            {i === 0 ? (
              <Image
                src={car.images[0]}
                alt={`${car.brand} ${car.model} ${car.year} en H3 Seminuevos`}
                fill
                sizes="(min-width: 1024px) 64vw, 100vw"
                quality={70}
                preload
                fetchPriority="high"
                className="object-cover object-[50%_62%] brightness-[0.9] contrast-[1.06] saturate-[1.08]"
              />
            ) : (
              // Las demás fotos esperan a que la página termine de cargar
              <AfterLoad>
                <Image
                  src={car.images[0]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 64vw, 100vw"
                  quality={70}
                  className="object-cover object-[50%_62%] brightness-[0.9] contrast-[1.06] saturate-[1.08]"
                />
              </AfterLoad>
            )}
          </div>
        ))}
      </div>

      {/* Tratamiento de cine: oscurece abajo para el texto y agrega un resplandor de color sutil */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(10_15_26/0.6)_0%,transparent_16%,transparent_44%,rgb(10_15_26/0.8)_58%,var(--color-night)_68%)] lg:bg-[linear-gradient(90deg,var(--color-night)_36%,rgb(10_15_26/0.55)_52%,transparent_72%),linear-gradient(0deg,var(--color-night)_0%,transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_42%_at_0%_100%,rgb(208_18_46/0.34),transparent_70%),radial-gradient(60%_36%_at_100%_72%,rgb(59_111_216/0.2),transparent_70%)]" />
      <div className="light-trails -z-10" aria-hidden="true">
        {TRAILS.map((t) => (
          <span key={t.top} style={{ top: t.top, ...vars({ "--d": t.d, "--delay": t.delay }) }} />
        ))}
      </div>

      {/* Avance de cada foto y el auto que se ve (con su precio) */}
      {slides.length > 0 && (
        <div className="absolute inset-x-4 top-[4.6rem] sm:inset-x-6 lg:right-6 lg:left-[calc(36%+1.5rem)]">
          {slides.length > 1 && (
            <div className="flex gap-1.5" aria-hidden="true">
              {slides.map((_, i) => (
                <span key={i} className="h-0.5 flex-1 overflow-hidden bg-white/25">
                  <span className="hero-bar block h-full bg-white" style={vars({ "--i": i })} />
                </span>
              ))}
            </div>
          )}
          <div className="hero-slides relative mt-3 h-14" data-count={slides.length}>
            {slides.map((car, i) => (
              <Link
                key={i}
                href={`/autos/${car.slug}`}
                className="hero-slide group absolute top-0 left-0 inline-flex items-center gap-3 rounded-md bg-night/45 py-2 pr-3 pl-3.5 ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-night/60"
                style={vars({ "--i": i })}
                tabIndex={i === 0 ? 0 : -1}
              >
                <span className="min-w-0">
                  <span className="font-tech block text-[9px] text-white/60">
                    {car.year} · {car.brand}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold">
                    {car.model} <span className="text-white/50">·</span> {formatPrice(car.price)}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-white/70 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Texto: qué es, dónde, por qué confiar y el botón */}
      <div className="relative mx-auto mt-auto w-full max-w-7xl px-4 pt-48 pb-6 sm:px-6 lg:pb-14">
        <div className="stagger max-w-xl">
          <p className="font-tech flex items-center gap-3 text-[11px] text-white/70" style={vars({ "--i": 0 })}>
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
            className="font-display mt-4 text-[2.45rem] leading-[1] sm:text-6xl lg:text-[4.4rem]"
            style={vars({ "--i": 1 })}
          >
            Autos seminuevos <span className="text-gradient">premium</span> en Villahermosa.
          </h1>
          <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-white/75 sm:text-lg" style={vars({ "--i": 2 })}>
            Revisados a detalle, con precio a la vista y atención directa por WhatsApp.
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
          {/* En celular se omiten: el subtítulo ya lo dice y así se ve el auto completo */}
          <ul className="mt-4 hidden flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-white/70 sm:flex" style={vars({ "--i": 4 })}>
            {FUDS.map((f) => (
              <li key={f} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-brand-glow" strokeWidth={2.5} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Acceso rápido: un toque y el inventario ya sale filtrado */}
        {types.length > 0 && (
          <nav aria-label="Busca por tipo" className="mt-6 animate-rise [animation-delay:650ms]">
            <p className="font-tech text-[10px] text-white/50">¿Qué buscas?</p>
            <ul className="no-scrollbar -mx-4 mt-2.5 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              {types.map(([t, count]) => (
                <li key={t} className="snap-start">
                  <Link
                    href={`/autos?tipo=${encodeURIComponent(t)}`}
                    className="group flex h-12 items-center gap-2.5 rounded-md bg-white/[0.07] pr-3.5 pl-2.5 ring-1 ring-white/15 backdrop-blur-md transition-[background-color,box-shadow] duration-300 hover:bg-white/[0.14] hover:ring-white/30 active:scale-[0.97]"
                  >
                    <BodyIcon
                      type={t}
                      className="h-6 w-11 text-white transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5"
                    />
                    <span className="text-sm font-semibold whitespace-nowrap">{TYPE_LABEL[t] ?? t}</span>
                    <span className="text-xs text-white/45">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
