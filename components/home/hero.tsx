import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { shortPrice, type Car } from "@/lib/cars";
import { vars } from "@/lib/ui";
import { AfterLoad } from "@/components/after-load";

export function Hero({ cars, total }: { cars: Car[]; total: number }) {
  const withPhoto = cars.filter((c) => c.images[0]);
  // La animación CSS está calculada para 4 diapositivas
  const slides =
    withPhoto.length >= 2
      ? Array.from({ length: 4 }, (_, i) => withPhoto[i % withPhoto.length])
      : withPhoto.slice(0, 1);

  return (
    <section className="relative isolate overflow-hidden lg:min-h-[100svh]">
      <div className="speed-lines pointer-events-none absolute inset-0 -z-10 hidden opacity-70 lg:block" />
      <div className="pointer-events-none absolute -top-40 -right-40 -z-10 hidden size-[42rem] rounded-full bg-brand/20 blur-[120px] lg:block" />

      <div className="mx-auto grid min-h-[100svh] max-w-7xl lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-6 lg:pt-20 lg:pb-10">
        {/* Fotos: fondo completo en móvil, marco vertical en escritorio */}
        <div
          className="hero-slides absolute inset-0 -z-10 lg:relative lg:inset-auto lg:z-0 lg:order-2 lg:aspect-[4/5] lg:max-h-[78svh] lg:w-full lg:overflow-hidden lg:rounded-[2rem] lg:ring-1 lg:ring-line lg:rotate-[1.5deg] lg:shadow-[0_40px_120px_-40px_rgb(227_20_31/0.5)]"
          data-count={slides.length}
        >
          {slides.map((car, i) => (
            <div key={i} className="hero-slide absolute inset-0 overflow-hidden" style={vars({ "--i": i })}>
              {i === 0 ? (
                <Image
                  src={car.images[0]}
                  alt={`${car.brand} ${car.model} ${car.year} en H3 Seminuevos`}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  quality={70}
                  preload
                  fetchPriority="high"
                  className="object-cover object-[50%_62%]"
                />
              ) : (
                // Las demás fotos esperan a que la página termine de cargar
                <AfterLoad>
                  <Image
                    src={car.images[0]}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    quality={70}
                    className="object-cover object-[50%_62%]"
                  />
                </AfterLoad>
              )}
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30 lg:from-ink/80 lg:via-transparent lg:to-transparent" />
          {/* Etiqueta del auto en foto, sincronizada con la diapositiva */}
          <div className="absolute top-20 right-4 left-4 flex justify-end lg:top-auto lg:right-5 lg:bottom-5 lg:left-5 lg:justify-start">
            <div className="hero-slides relative h-10 w-full max-w-[19rem]" data-count={slides.length}>
              {slides.map((car, i) => (
                <Link
                  key={i}
                  href={`/autos/${car.slug}`}
                  className="hero-slide absolute inset-y-0 right-0 flex items-center gap-2 rounded-full bg-ink/70 py-1 pr-1 pl-4 text-xs ring-1 ring-white/15 backdrop-blur-md lg:right-auto lg:left-0"
                  style={vars({ "--i": i })}
                  tabIndex={i === 0 ? 0 : -1}
                >
                  <span className="truncate text-fg/90">
                    {car.brand} {car.model} {car.year}
                  </span>
                  <span className="rounded-full bg-fg px-2.5 py-1.5 font-bold text-ink">{shortPrice(car.price)}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="flex flex-col justify-end px-4 pt-32 pb-10 sm:px-6 lg:order-1 lg:justify-center lg:px-0 lg:py-0">
          <h1 className="stagger">
            <span
              className="font-tech mb-5 inline-flex items-center gap-2 rounded-full bg-ink/60 px-3 py-1.5 text-[11px] text-fg/90 ring-1 ring-line backdrop-blur-md"
              style={vars({ "--i": 0 })}
            >
              <MapPin className="size-3.5 text-brand" />
              Autos seminuevos en Villahermosa
            </span>
            <span className="font-display block text-[clamp(2.6rem,12.5vw,4.5rem)] sm:text-7xl lg:text-[4.6rem] xl:text-[5rem]" style={vars({ "--i": 1 })}>
              Tu próximo
            </span>
            <span className="font-display block text-[clamp(2.6rem,12.5vw,4.5rem)] sm:text-7xl lg:text-[4.6rem] xl:text-[5rem]" style={vars({ "--i": 2 })}>
              auto está <span className="text-brand">aquí.</span>
            </span>
          </h1>
          <p
            className="mt-5 max-w-md text-base leading-relaxed text-fg/80 sm:text-lg animate-rise [animation-delay:420ms]"
          >
            Seminuevos premium revisados a detalle, con precio justo y atención directa por WhatsApp.
            ¿Quieres vender el tuyo? También te ayudamos.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 animate-rise [animation-delay:520ms]">
            <Link
              href="/autos"
              className="btn-shine group inline-flex h-14 items-center gap-3 rounded-full bg-brand pr-2 pl-6 text-base font-semibold text-white shadow-[0_12px_40px_-10px_rgb(227_20_31/0.8)] transition-transform active:scale-95"
            >
              Ver catálogo
              <span className="grid size-10 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-1">
                <ArrowRight className="size-5" />
              </span>
            </Link>
            <Link
              href="/vende-tu-auto"
              className="inline-flex h-14 items-center rounded-full bg-white/10 px-6 text-base font-semibold ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/15 active:scale-95"
            >
              Vender mi auto
            </Link>
          </div>
          <dl className="mt-9 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line animate-rise [animation-delay:640ms]">
            {[
              { k: "Disponibles", v: String(total) },
              { k: "Ubicación", v: "Vhsa." },
              { k: "Atención", v: "1 a 1" },
            ].map((s) => (
              <div key={s.k} className="bg-ink/70 px-3 py-3 backdrop-blur-md">
                <dt className="font-tech text-[10px] text-dim">{s.k}</dt>
                <dd className="font-display mt-1 text-lg">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
