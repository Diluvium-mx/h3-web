import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { AfterLoad } from "@/components/after-load";
import { CountUp } from "@/components/home/count-up";
import { Marquee } from "@/components/home/marquee";
import { formatPrice, type Car } from "@/lib/cars";
import type { TrustStat } from "@/lib/settings";
import { site, whatsappUrl } from "@/lib/site";
import { vars } from "@/lib/ui";

export const GENERAL_MESSAGE = `Hola ${site.name} 👋 Vi su página y busco un auto. ¿Me pueden ayudar?`;

// Lo que quita miedos junto al botón (todo es cierto para cualquier auto del sitio)
export const FUDS = ["Precio a la vista", "Fotos reales de cada auto", "Respuesta inmediata"];

export type Rating = { count: number; avg: number };

export function Hero({ cars, rating }: { cars: Car[]; rating: Rating }) {
  const withPhoto = cars.filter((c) => c.images[0]);
  // La animación CSS está calculada para 4 diapositivas
  const slides =
    withPhoto.length >= 2
      ? Array.from({ length: 4 }, (_, i) => withPhoto[i % withPhoto.length])
      : withPhoto.slice(0, 1);

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-7xl gap-8 pt-[5.5rem] lg:min-h-[94svh] lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14 lg:px-6 lg:pt-24 lg:pb-14">
        {/* Texto: qué es, dónde, por qué confiar y el botón */}
        <div className="stagger px-4 sm:px-6 lg:px-0">
          <p className="font-tech flex items-center gap-3 text-[11px] text-dim" style={vars({ "--i": 0 })}>
            <span className="draw-line h-px w-8 bg-brand" />
            Villahermosa, Tabasco
          </p>
          <h1
            id="hero-title"
            className="font-display mt-5 text-[2.55rem] leading-[1.02] sm:text-6xl lg:text-[4.1rem]"
            style={vars({ "--i": 1 })}
          >
            Autos seminuevos premium en Villahermosa.
          </h1>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-mute sm:text-lg" style={vars({ "--i": 2 })}>
            Revisados a detalle, con precio a la vista y atención directa por WhatsApp.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:flex" style={vars({ "--i": 3 })}>
            <Link href="/autos" className="btn btn-dark btn-shine group">
              Ver inventario
              <ArrowRight className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
            </Link>
            <a href={whatsappUrl(GENERAL_MESSAGE)} target="_blank" rel="noopener" className="btn btn-outline group">
              <WhatsAppIcon className="size-[1.15rem] text-wa-dark transition-transform duration-500 group-hover:-rotate-12" />
              WhatsApp
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-mute" style={vars({ "--i": 4 })}>
            {rating.count > 0 && (
              <li className="flex items-center gap-1.5 text-fg">
                <Star className="size-3.5 fill-current text-fg" aria-hidden="true" />
                <b>{rating.avg.toFixed(1)}</b> · {rating.count} {rating.count === 1 ? "reseña" : "reseñas"}
              </li>
            )}
            {FUDS.map((f) => (
              <li key={f} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-brand" strokeWidth={2.5} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Fotos reales del inventario que van rotando, con su nombre y precio */}
        <div className="relative animate-fade [animation-delay:250ms]">
          <div
            className="hero-slides relative aspect-[4/3] overflow-hidden bg-soft lg:aspect-[4/5] lg:max-h-[78svh] lg:rounded-lg"
            data-count={slides.length}
          >
            {slides.map((car, i) => (
              <div key={i} className="hero-slide absolute inset-0 overflow-hidden" style={vars({ "--i": i })}>
                {i === 0 ? (
                  <Image
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model} ${car.year} en H3 Seminuevos`}
                    fill
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    quality={70}
                    preload
                    fetchPriority="high"
                    className="object-cover object-[50%_70%] lg:object-[50%_62%]"
                  />
                ) : (
                  // Las demás fotos esperan a que la página termine de cargar
                  <AfterLoad>
                    <Image
                      src={car.images[0]}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 48vw, 100vw"
                      quality={70}
                      className="object-cover object-[50%_70%] lg:object-[50%_62%]"
                    />
                  </AfterLoad>
                )}
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-night/10 via-40% to-transparent" />
            {/* Nombre y precio del auto en foto, sincronizados con la diapositiva */}
            <div className="hero-slides absolute right-5 bottom-5 left-5 h-12" data-count={slides.length}>
              {slides.map((car, i) => (
                <Link
                  key={i}
                  href={`/autos/${car.slug}`}
                  className="hero-slide group absolute inset-0 flex items-end justify-between gap-4 text-white"
                  style={vars({ "--i": i })}
                  tabIndex={i === 0 ? 0 : -1}
                >
                  <span className="min-w-0">
                    <span className="font-tech block text-[10px] text-white/70">
                      {car.year} · {car.brand}
                    </span>
                    <span className="font-display mt-1 block truncate text-xl">{car.model}</span>
                  </span>
                  <span className="font-display shrink-0 text-xl">{formatPrice(car.price)}</span>
                </Link>
              ))}
            </div>
            {/* Progreso de cada diapositiva */}
            {slides.length > 1 && (
              <div className="absolute top-4 right-5 left-5 flex gap-1.5" aria-hidden="true">
                {slides.map((_, i) => (
                  <span key={i} className="h-0.5 flex-1 overflow-hidden bg-white/30">
                    <span className="hero-bar block h-full bg-white" style={vars({ "--i": i })} />
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Números que dan confianza (los pone el dueño en el panel) + franja de marcas
export function TrustBar({ stats, brands, example }: { stats: TrustStat[] | null; brands: string[]; example?: boolean }) {
  return (
    <section aria-label="H3 en números" className="relative pt-12 pb-4 sm:pt-16">
      {stats && stats.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <dl className={`grid divide-line ${stats.length >= 3 ? "grid-cols-3" : "grid-cols-2"} divide-x`}>
            {stats.map((s, i) => (
              <div key={s.label} className="reveal flex flex-col px-3 first:pl-0 sm:px-8" style={vars({ "--i": i })}>
                <dt className="mt-2 text-[12px] leading-snug text-mute sm:text-sm">{s.label}</dt>
                <dd className="font-display -order-1 text-[1.9rem] leading-none sm:text-5xl">
                  {s.prefix}
                  {s.prefix && /[<>≤≥]$/.test(s.prefix) ? " " : ""}
                  <CountUp value={s.value} />
                  {s.suffix && <span className="text-[0.55em] text-mute">{s.suffix}</span>}
                </dd>
              </div>
            ))}
          </dl>
          {example && (
            <p className="mt-4 text-xs text-dim">
              Números de ejemplo (solo se ven en tu computadora). Pon los reales en Panel → Ajustes.
            </p>
          )}
        </div>
      )}
      {brands.length > 0 && (
        <div className="mt-10 overflow-hidden py-2">
          <Marquee items={brands} />
        </div>
      )}
    </section>
  );
}
