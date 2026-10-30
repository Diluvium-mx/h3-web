"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export type HeroSlide = {
  slug: string;
  image: string;
  alt: string;
  eyebrow: string;
  model: string;
  price: string;
};

const EVERY = 5000; // cambia de auto cada 5 s
const IDLE = 9000; // si el visitante toca o desliza, espera 9 s antes de seguir solo

// Fotos de los autos destacados: se deslizan con el dedo hacia los lados y cambian solas.
// Cada foto lleva abajo a la derecha el auto que se ve, con su precio (enlace a la ficha).
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const pausedUntil = useRef(0);

  const go = useCallback((i: number, smooth = true) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Qué foto se ve, según el desplazamiento
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Avance automático (se detiene si el visitante interactúa, si la pestaña no se ve o con «reducir movimiento»)
  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < pausedUntil.current) return;
      const el = track.current;
      if (!el) return;
      const current = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
      go((current + 1) % slides.length);
    }, EVERY);
    return () => window.clearInterval(timer);
  }, [slides.length, go]);

  const hold = useCallback(() => {
    pausedUntil.current = Date.now() + IDLE;
  }, []);

  if (!slides.length) return <div className="h-full bg-graphite" />;

  return (
    <div className="relative h-full" onPointerDown={hold} onTouchStart={hold} onWheel={hold}>
      <div
        ref={track}
        className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        aria-roledescription="carrusel de autos"
        aria-label="Autos destacados"
      >
        {slides.map((s, i) => (
          <div
            key={`${s.slug}-${i}`}
            className="relative h-full w-full shrink-0 snap-center overflow-hidden"
            role="group"
            aria-roledescription="auto"
            aria-label={`${i + 1} de ${slides.length}`}
          >
            <Image
              src={s.image}
              alt={s.alt}
              fill
              sizes="100vw"
              quality={70}
              preload={i === 0}
              fetchPriority={i === 0 ? "high" : "auto"}
              loading={i === 0 ? "eager" : "lazy"}
              className="scale-[1.14] object-cover object-[50%_60%] lg:scale-100 lg:object-[50%_64%]"
            />
            {/* El auto que se ve, abajo a la derecha de la foto */}
            <Link
              href={`/autos/${s.slug}`}
              tabIndex={i === index ? 0 : -1}
              className="group absolute right-4 bottom-12 z-10 flex max-w-[78%] items-center gap-3 rounded-md bg-night/70 py-2 pr-2.5 pl-3.5 text-white shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)] ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:bg-night/85 sm:right-6 lg:bottom-14"
            >
              <span className="min-w-0 text-right">
                <span className="block text-[11px] font-medium text-white/65">{s.eyebrow}</span>
                <span className="block truncate text-sm font-semibold">
                  {s.model} · {s.price}
                </span>
              </span>
              <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-white text-night transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </div>
        ))}
      </div>

      {/* Indicadores: tocar uno lleva a ese auto */}
      {slides.length > 1 && (
        <div className="absolute bottom-14 left-4 z-10 flex items-center gap-1.5 sm:left-6 lg:top-24 lg:right-6 lg:bottom-auto lg:left-auto">
          {slides.map((s, i) => (
            <button
              key={`${s.slug}-dot-${i}`}
              type="button"
              onClick={() => {
                hold();
                go(i);
              }}
              aria-label={`Ver auto ${i + 1} de ${slides.length}`}
              aria-current={i === index}
              className="grid h-6 place-items-center"
            >
              <span
                className={`block h-1 rounded-full transition-all duration-500 ease-[var(--ease-out-expo)] ${
                  i === index ? "w-7 bg-white" : "w-2.5 bg-white/45"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
