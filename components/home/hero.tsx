import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { HeroCarousel, type HeroSlide } from "@/components/home/hero-carousel";
import { HeroParallax } from "@/components/home/hero-parallax";
import { formatPrice, type Car } from "@/lib/cars";
import { site, whatsappUrl } from "@/lib/site";
import { vars } from "@/lib/ui";

export const GENERAL_MESSAGE = `Hola ${site.name} 👋 Vi su página y busco un auto. ¿Me pueden ayudar?`;

// Lo que quita miedos junto al botón (todo es cierto para cualquier auto del sitio)
export const FUDS = ["Autos verificados", "Papeles en regla", "Precio a la vista"];

export type Rating = { count: number; avg: number };

const TITLE: { text: string; accent?: boolean }[] = [
  { text: "Autos" },
  { text: "seminuevos" },
  { text: "premium", accent: true },
  { text: "en" },
  { text: "Villahermosa." },
];

// Hero (pedido del dueño, 31-oct): fotos reales con más zoom, en un carrusel que se desliza y cambia solo.
// Sin degradado oscuro: el texto va en una hoja clara que se monta sobre la foto (en computadora, una
// tarjeta). El título sube palabra por palabra y «premium» va en cursiva roja con un trazo a mano.
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
    <section className="relative bg-paper" aria-labelledby="hero-title">
      {/* Fotos */}
      <div className="relative h-[62svh] min-h-[400px] overflow-hidden bg-night lg:h-[88svh]">
        <HeroParallax className="absolute inset-0">
          <HeroCarousel slides={slides} />
        </HeroParallax>
        {/* Sombra mínima arriba, solo para que se lea el encabezado */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />
      </div>

      {/* Texto: hoja clara sobre la foto */}
      <div className="relative z-10 -mt-7 rounded-t-[1.75rem] bg-paper px-5 pt-8 pb-10 sm:px-6 lg:absolute lg:bottom-14 lg:left-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:mt-0 lg:w-[35rem] lg:rounded-2xl lg:p-11 lg:shadow-[0_40px_80px_-30px_rgb(20_20_20/0.55)]">
        <p className="font-tech flex items-center gap-3 text-[11px] text-dim">
          <span className="draw-line rule-accent h-px w-8" />
          {rating.count > 0 ? (
            <span className="flex items-center gap-1.5 text-fg">
              <Star className="size-3.5 fill-gold text-gold" aria-hidden="true" />
              {rating.avg.toFixed(1)} · {rating.count} {rating.count === 1 ? "reseña" : "reseñas"}
            </span>
          ) : (
            "Villahermosa, Tabasco"
          )}
        </p>
        <h1 id="hero-title" className="font-display mt-4 text-[2.55rem] leading-[1.02] sm:text-6xl lg:text-[3.6rem]">
          {TITLE.map(({ text, accent }, i) => (
            <span key={text}>
              <span className="word-mask">
                <span style={vars({ "--i": i })} className={accent ? "relative" : undefined}>
                  {accent ? (
                    <>
                      <span className="font-accent pr-1 text-[1.12em] text-brand">{text}</span>
                      {/* Trazo a mano bajo «premium» */}
                      <svg
                        className="pointer-events-none absolute -bottom-[0.02em] left-0 h-[0.22em] w-full text-brand"
                        viewBox="0 0 200 20"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 14 C 50 6, 110 4, 197 9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="5"
                          strokeLinecap="round"
                          pathLength={1}
                          className="draw-stroke"
                        />
                      </svg>
                    </>
                  ) : (
                    text
                  )}
                </span>
              </span>{" "}
            </span>
          ))}
        </h1>
        <div className="stagger">
          <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-mute sm:text-lg" style={vars({ "--i": 4 })}>
            Verificados, con papeles en regla y a precio justo. Te asesoramos por WhatsApp.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex" style={vars({ "--i": 5 })}>
            <Link href="/autos" className="btn btn-dark btn-shine group px-3 whitespace-nowrap sm:px-[1.35rem]">
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
    </section>
  );
}
