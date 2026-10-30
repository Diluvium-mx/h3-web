"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { useScrollProgress } from "@/components/home/scroll-progress";

export type TourFrame = { src: string; label: string; title: string; text: string };

// Recorrido de un auto con el scroll (versión 1): la foto queda fija y, al bajar, pasa del exterior al
// interior con sus datos. Al final, el precio y los botones. Todas las fotos son de ese auto.
export function CarTour({
  frames,
  alt,
  slug,
  price,
  waHref,
}: {
  frames: TourFrame[];
  alt: string;
  slug: string;
  price: string;
  waHref: string;
}) {
  const { ref, progress: p, animate } = useScrollProgress<HTMLElement>();
  const n = frames.length;
  const active = animate ? Math.min(n - 1, Math.floor(p * n)) : n - 1;
  const last = active === n - 1;

  return (
    <section
      ref={ref}
      className={`relative bg-night text-white ${animate ? "h-[320vh]" : ""}`}
      aria-label={`Recorrido por el ${alt}`}
    >
      <div className={`${animate ? "sticky top-0 h-[100svh]" : "h-[100svh]"} grain relative overflow-hidden`}>
        {frames.map((f, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out-expo)] ${
              i === active ? "scale-100 opacity-100" : i < active ? "scale-[1.04] opacity-0" : "scale-[1.08] opacity-0"
            }`}
            aria-hidden={i !== active}
          >
            <Image
              src={f.src}
              alt={`${alt}: ${f.label.toLowerCase()}`}
              fill
              sizes="100vw"
              quality={70}
              className="object-cover object-[50%_60%]"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-night/40" />

        {/* Avance: un segmento por foto */}
        <div className="absolute inset-x-0 top-20 z-10 mx-auto flex max-w-7xl gap-1.5 px-4 sm:px-6" aria-hidden="true">
          {frames.map((f, i) => (
            <span key={i} className="h-0.5 flex-1 overflow-hidden bg-white/20">
              <span
                className="block h-full origin-left bg-white transition-transform duration-500"
                style={{ transform: `scaleX(${i < active ? 1 : i === active ? 1 : 0})` }}
              />
            </span>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16">
          <div className="relative min-h-[11rem]">
            {frames.map((f, i) => (
              <div
                key={i}
                className={`absolute inset-x-0 bottom-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] ${
                  i === active ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                }`}
                aria-hidden={i !== active}
              >
                <p className="text-sm font-semibold tracking-[0.18em] text-silver uppercase">{f.label}</p>
                <h2 className="font-display mt-2 max-w-2xl text-[2.2rem] sm:text-6xl">{f.title}</h2>
                <p className="mt-3 max-w-md text-white/75 sm:text-lg">{f.text}</p>
              </div>
            ))}
          </div>
          <div
            className={`mt-6 flex flex-wrap gap-3 transition-opacity duration-500 ${last ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <a href={waHref} target="_blank" rel="noopener" className="btn btn-wa btn-shine" tabIndex={last ? 0 : -1}>
              <WhatsAppIcon className="size-5" /> Me interesa · {price}
            </a>
            <Link href={`/autos/${slug}`} className="btn btn-light group" tabIndex={last ? 0 : -1}>
              Ver todas las fotos
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
