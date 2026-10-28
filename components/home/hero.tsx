import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { AfterLoad } from "@/components/after-load";
import { Marquee } from "@/components/home/marquee";
import { shortPrice, type Car } from "@/lib/cars";
import { site, whatsappUrl } from "@/lib/site";
import { vars } from "@/lib/ui";

export const GENERAL_MESSAGE = `Hola ${site.name} 👋 Vi su página y busco un auto. ¿Me pueden ayudar?`;

// Lo que quita miedos justo junto al botón (todo es cierto para cualquier auto del sitio)
export const FUDS = ["Precio a la vista", "Fotos reales de cada auto", "Respuesta inmediata"];

export type Rating = { count: number; avg: number };

// Prueba social que va arriba del título: calificación real si hay reseñas, si no, el inventario de hoy
export function ProofPill({ available, rating }: { available: number; rating: Rating }) {
  if (rating.count > 0) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-card py-1.5 pr-3.5 pl-2.5 text-xs font-medium text-fg shadow-sm ring-1 ring-line">
        <span className="flex text-volt" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`size-3.5 ${i < Math.round(rating.avg) ? "fill-current" : ""}`} />
          ))}
        </span>
        <span>
          <b>{rating.avg.toFixed(1)}</b> · {rating.count} {rating.count === 1 ? "reseña" : "reseñas"} de clientes
        </span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-card py-1.5 pr-3.5 pl-3 text-xs font-medium text-fg shadow-sm ring-1 ring-line">
      <span className="relative grid size-2.5 place-items-center">
        <span className="absolute inset-0 rounded-full bg-wa animate-pulse-ring" />
        <span className="size-2 rounded-full bg-wa" />
      </span>
      <b>{available}</b> {available === 1 ? "auto disponible" : "autos disponibles"} hoy
    </span>
  );
}

export function Hero({
  cars,
  total,
  available,
  rating,
}: {
  cars: Car[];
  total: number;
  available: number;
  rating: Rating;
}) {
  const withPhoto = cars.filter((c) => c.images[0]);
  // La animación CSS está calculada para 4 diapositivas
  const slides =
    withPhoto.length >= 2
      ? Array.from({ length: 4 }, (_, i) => withPhoto[i % withPhoto.length])
      : withPhoto.slice(0, 1);

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-title">
      <div className="speed-lines pointer-events-none absolute inset-0 -z-10 hidden opacity-60 lg:block" />
      <div className="pointer-events-none absolute -top-40 -right-48 -z-10 hidden size-[38rem] rounded-full bg-brand/12 blur-[110px] lg:block" />

      <div className="mx-auto grid max-w-7xl gap-7 px-4 pt-[5.25rem] pb-10 sm:px-6 lg:min-h-[100svh] lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:pt-24 lg:pb-14">
        {/* Texto: prueba social → beneficio → dolor y solución → botón → sin miedos */}
        <div className="stagger">
          <div style={vars({ "--i": 0 })}>
            <ProofPill available={available} rating={rating} />
          </div>
          <h1 id="hero-title" className="mt-4" style={vars({ "--i": 1 })}>
            <span className="font-tech block text-[11px] text-brand-hi sm:text-xs">Seminuevos premium en Villahermosa</span>
            <span className="font-display mt-2 block text-[clamp(2.45rem,11.4vw,4.4rem)] sm:text-7xl lg:text-[4.4rem] xl:text-[4.9rem]">
              Tu próximo auto,{" "}
              <span className="box-decoration-clone bg-[linear-gradient(var(--color-volt),var(--color-volt))] bg-[length:100%_0.3em] bg-[position:0_92%] bg-no-repeat text-brand">
                sin sorpresas.
              </span>
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-[1.02rem] leading-relaxed text-fg/80 sm:text-lg" style={vars({ "--i": 2 })}>
            ¿Cansado de precios «por inbox», fotos que no son del auto y mensajes en visto? En H3 ves fotos
            reales y el precio de cada auto, y <b className="font-semibold text-fg">te respondemos de inmediato</b> por
            WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap gap-3" style={vars({ "--i": 3 })}>
            <Link
              href="/autos"
              className="btn-shine group inline-flex h-14 items-center gap-3 rounded-full bg-brand pr-2 pl-6 text-base font-semibold text-white shadow-[0_12px_40px_-10px_rgb(227_20_31/0.8)] transition-transform active:scale-95"
            >
              Ver los {total} autos
              <span className="grid size-10 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-1">
                <ArrowRight className="size-5" />
              </span>
            </Link>
            <a
              href={whatsappUrl(GENERAL_MESSAGE)}
              target="_blank"
              rel="noopener"
              className="group hidden h-14 items-center gap-2.5 rounded-full bg-card px-5 text-base font-semibold text-fg shadow-sm ring-1 ring-line transition-transform hover:-translate-y-0.5 active:scale-95 sm:inline-flex"
            >
              <WhatsAppIcon className="size-5 text-wa-dark transition-transform duration-500 group-hover:-rotate-12" />
              Escríbenos
            </a>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-fg/75" style={vars({ "--i": 4 })}>
            {FUDS.map((f) => (
              <li key={f} className="flex items-center gap-1.5">
                <Check className="size-4 text-wa-dark" strokeWidth={3} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Foto: los autos reales del inventario, que van rotando */}
        <div className="relative animate-rise [animation-delay:380ms] lg:mx-0">
          <span className="absolute -top-3 -right-6 h-16 w-2/3 -skew-x-12 rounded-xl bg-volt lg:-top-5 lg:h-24" aria-hidden="true" />
          <span className="absolute -bottom-3 -left-6 h-16 w-1/2 -skew-x-12 rounded-xl bg-brand lg:-bottom-5 lg:h-24" aria-hidden="true" />
          <div
            className="hero-slides relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-soft shadow-[0_30px_80px_-30px_rgb(227_20_31/0.55)] ring-1 ring-line lg:aspect-[4/5] lg:max-h-[76svh] lg:w-full lg:rotate-[1.5deg] lg:rounded-[2rem]"
            data-count={slides.length}
          >
            {slides.map((car, i) => (
              <div key={i} className="hero-slide absolute inset-0 overflow-hidden" style={vars({ "--i": i })}>
                {i === 0 ? (
                  <Image
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model} ${car.year} en H3 Seminuevos`}
                    fill
                    sizes="(min-width: 1024px) 45vw, 92vw"
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
                      sizes="(min-width: 1024px) 45vw, 92vw"
                      quality={70}
                      className="object-cover object-[50%_70%] lg:object-[50%_62%]"
                    />
                  </AfterLoad>
                )}
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-night/45 via-transparent via-35% to-transparent" />
            {/* Etiqueta del auto en foto, sincronizada con la diapositiva */}
            <div className="hero-slides absolute right-4 bottom-4 left-4 h-10" data-count={slides.length}>
              {slides.map((car, i) => (
                <Link
                  key={i}
                  href={`/autos/${car.slug}`}
                  className="hero-slide absolute inset-y-0 left-0 flex max-w-full items-center gap-2 rounded-full bg-card/90 py-1 pr-1 pl-4 text-xs font-medium text-fg shadow-md ring-1 ring-line backdrop-blur-md"
                  style={vars({ "--i": i })}
                  tabIndex={i === 0 ? 0 : -1}
                >
                  <span className="truncate text-fg/90">
                    {car.brand} {car.model} {car.year}
                  </span>
                  <span className="shrink-0 rounded-full bg-brand-hi px-2.5 py-1.5 font-bold text-white">
                    {shortPrice(car.price)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Segunda prueba social, justo debajo del hero: números reales del inventario + marcas
export function ProofBar({ cars, available }: { cars: Car[]; available: number }) {
  if (!cars.length) return null;
  const brands = [...new Set(cars.map((c) => c.brand))];
  const minPrice = Math.min(...cars.map((c) => c.price));
  const armored = cars.filter((c) => c.armored).length;
  const stats = [
    { v: String(available), k: available === 1 ? "Auto disponible" : "Autos disponibles" },
    { v: String(brands.length), k: brands.length === 1 ? "Marca" : "Marcas" },
    { v: shortPrice(minPrice), k: "Precios desde" },
    armored > 0
      ? { v: String(armored), k: armored === 1 ? "Blindado" : "Blindados" }
      : { v: "Lun–Sáb", k: "9:00 a 17:00" },
  ];
  return (
    <section aria-label="H3 en números" className="relative">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden border-y border-line bg-line sm:grid-cols-4 lg:rounded-3xl lg:border-x">
        {stats.map((s, i) => (
          <div key={s.k} className="reveal flex flex-col-reverse bg-card px-4 py-4 sm:px-6 sm:py-5" style={vars({ "--i": i })}>
            <dt className="font-tech mt-1 text-[10px] text-dim sm:text-[11px]">{s.k}</dt>
            <dd className="font-display text-[1.9rem] sm:text-4xl">
              {i === 0 ? <span className="text-brand">{s.v}</span> : s.v}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 overflow-hidden py-2 lg:mt-6">
        <Marquee items={brands} />
      </div>
    </section>
  );
}
