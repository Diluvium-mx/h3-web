"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

export type CoverflowItem = { slug: string; image: string; model: string; eyebrow: string; price: string };

// Carrusel del cierre (pedido del dueño, 31-oct): se desliza hacia los lados, la tarjeta del centro se ve
// completa y más grande, y las de los lados se alcanzan a ver más chicas. El tamaño se calcula con la
// posición de cada tarjeta (variable --d), sin volver a dibujar la página.
export function Coverflow({ items }: { items: CoverflowItem[] }) {
  const track = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    for (const card of Array.from(el.children) as HTMLElement[]) {
      const mid = card.offsetLeft + card.offsetWidth / 2;
      const d = Math.min(1, Math.abs(mid - center) / card.offsetWidth);
      card.style.setProperty("--d", d.toFixed(3));
    }
  }, []);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.children[0] as HTMLElement | undefined;
    if (el && card) el.scrollBy({ left: dir * (card.offsetWidth + 12), behavior: "smooth" });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    // Empieza con la segunda tarjeta al centro, para que se vea una a cada lado
    const second = el.children[Math.min(1, el.children.length - 1)] as HTMLElement | undefined;
    if (second) el.scrollLeft = second.offsetLeft - (el.clientWidth - second.offsetWidth) / 2;
    update();
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [update]);

  return (
    <div className="relative">
      <div
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto py-4"
        style={{ paddingInline: "calc(50% - min(32vw, 170px))" }}
        aria-label="Algunos autos disponibles"
      >
        {items.map((it) => (
          <Link
            key={it.slug}
            href={`/autos/${it.slug}`}
            className="group relative block w-[64vw] max-w-[340px] shrink-0 snap-center overflow-hidden rounded-xl bg-graphite shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] transition-[transform,opacity] duration-300 ease-out"
            style={{ transform: "scale(calc(1 - var(--d, 0) * 0.14))", opacity: "calc(1 - var(--d, 0) * 0.5)" }}
          >
            <span className="relative block aspect-[3/4]">
              <Image
                src={it.image}
                alt={`${it.model}, ${it.eyebrow}`}
                fill
                sizes="(min-width: 640px) 340px, 64vw"
                quality={70}
                className="object-cover object-[50%_60%] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/90 via-night/40 to-transparent p-4 pt-16 sm:p-5 sm:pt-20">
                <span className="block text-[11px] text-white/70">{it.eyebrow}</span>
                <span className="font-display mt-1 block text-2xl">{it.model}</span>
                <span className="mt-2 flex items-center justify-between gap-3 border-t border-white/15 pt-2.5">
                  <span className="font-display text-lg">{it.price}</span>
                  <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>
      {/* Flechas para computadora (en celular se desliza con el dedo) */}
      <div className="mx-auto mt-4 hidden max-w-7xl justify-end gap-2 px-6 sm:flex">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Auto anterior"
          className="grid size-11 place-items-center rounded-md ring-1 ring-white/20 transition-colors hover:bg-white hover:text-night"
        >
          <ArrowLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Auto siguiente"
          className="grid size-11 place-items-center rounded-md ring-1 ring-white/20 transition-colors hover:bg-white hover:text-night"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
