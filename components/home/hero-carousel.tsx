"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

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
// Cada foto lleva abajo a la derecha el auto que se ve, con su precio (enlace a la ficha). Al final, una tarjeta
// «Ver inventario» para que quien desliza no se tope sin saber qué hacer (pedido del dueño, 5-nov).
export function HeroCarousel({ slides, total }: { slides: HeroSlide[]; total: number }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const pausedUntil = useRef(0);
  const count = slides.length + 1; // autos + tarjeta final

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
    if (count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (document.hidden || Date.now() < pausedUntil.current) return;
      const el = track.current;
      if (!el) return;
      const current = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
      go((current + 1) % count);
    }, EVERY);
    return () => window.clearInterval(timer);
  }, [count, go]);

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
            aria-label={`${i + 1} de ${count}`}
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
            {/* El auto que se ve, abajo a la derecha de la foto (encima de los puntos) */}
            <Link
              href={`/autos/${s.slug}`}
              tabIndex={i === index ? 0 : -1}
              className="group absolute right-4 bottom-[4.5rem] z-10 flex max-w-[78%] items-center gap-3 rounded-md bg-night/70 py-2 pr-2.5 pl-3.5 text-white shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)] ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:bg-night/85 sm:right-6 lg:bottom-14"
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
        {/* Tarjeta final: lleva al inventario completo */}
        <div
          className="relative grid h-full w-full shrink-0 snap-center place-items-center overflow-hidden bg-night px-8 pb-16 text-center text-white"
          role="group"
          aria-roledescription="auto"
          aria-label={`${count} de ${count}`}
        >
          <Image
            src={slides[0].image}
            alt=""
            fill
            sizes="100vw"
            quality={40}
            loading="lazy"
            className="scale-110 object-cover opacity-30 blur-sm"
          />
          <div className="relative">
            <p className="font-tech text-[11px] text-white/70">¿Buscas otro?</p>
            <p className="font-display mt-3 text-[2rem] leading-tight">
              Hay {total} {total === 1 ? "auto" : "autos"} esperándote
            </p>
            <Link
              href="/autos"
              tabIndex={index === count - 1 ? 0 : -1}
              className="btn btn-light btn-shine group mt-6 min-h-12 px-6"
            >
              Ver inventario
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Puntos centrados: el blanco avanza a la derecha conforme deslizas; tocar uno lleva a esa foto */}
      <div className="absolute inset-x-0 bottom-10 z-10 flex justify-center gap-1">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              hold();
              go(i);
            }}
            aria-label={i === count - 1 ? "Ver inventario" : `Ver auto ${i + 1} de ${slides.length}`}
            aria-current={i === index}
            className="grid size-6 place-items-center"
          >
            <span
              className={`block size-2 rounded-full transition-all duration-300 ${
                i === index ? "scale-125 bg-white" : "bg-white/45"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
