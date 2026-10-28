"use client";

import Image from "next/image";
import { ViewTransition, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useAfterLoad } from "@/components/after-load";

type Props = { images: string[]; alt: string; carId: string; sold?: boolean };

function useActiveIndex(ref: RefObject<HTMLDivElement | null>) {
  const [index, setIndex] = useState(0);
  const [maxSeen, setMaxSeen] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setIndex(i);
        setMaxSeen((m) => Math.max(m, i));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // por si el navegador restauró la posición antes de hidratar
    return () => el.removeEventListener("scroll", onScroll);
  }, [ref]);
  return { index, maxSeen };
}

function scrollToIndex(el: HTMLDivElement | null, i: number, smooth = true) {
  if (!el) return;
  el.scrollTo({ left: i * el.clientWidth, behavior: smooth ? "smooth" : "instant" });
}

export function Gallery({ images, alt, carId, sold }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const { index, maxSeen } = useActiveIndex(track);
  const [lightbox, setLightbox] = useState<number | null>(null);
  // Descarga solo las fotos cercanas a la que se está viendo, y hasta que cargó la principal
  const loaded = useAfterLoad();
  const loadUntil = loaded || maxSeen > 0 ? maxSeen + 2 : 0;
  const total = images.length;

  const go = useCallback((delta: number) => scrollToIndex(track.current, Math.max(0, Math.min(total - 1, index + delta))), [index, total]);

  if (!total) return <div className="skeleton aspect-square w-full lg:aspect-[5/6] lg:rounded-3xl" />;

  return (
    <div className="relative">
      <div className="group relative overflow-hidden bg-soft lg:rounded-3xl">
        <div
          ref={track}
          className="no-scrollbar flex aspect-square snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:aspect-[5/6]"
          aria-roledescription="carrusel"
          aria-label={`Fotos de ${alt}`}
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className="relative h-full w-full shrink-0 snap-center snap-always cursor-zoom-in"
              onClick={() => setLightbox(i)}
              aria-label={`Ver foto ${i + 1} de ${total} en pantalla completa`}
            >
              {i === 0 ? (
                <ViewTransition name={`car-${carId}`} share="morph" default="none">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    preload
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 56vw, 70vw"
                    quality={70}
                    className={`object-cover ${sold ? "grayscale" : ""}`}
                  />
                </ViewTransition>
              ) : i <= loadUntil ? (
                <Image
                  src={src}
                  alt={`${alt}, foto ${i + 1}`}
                  fill
                  sizes="(min-width: 1024px) 56vw, 70vw"
                  quality={70}
                  className={`object-cover ${sold ? "grayscale" : ""}`}
                />
              ) : (
                <span className="skeleton absolute inset-0" />
              )}
            </button>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-night/45 to-transparent lg:h-20" />

        {/* Progreso */}
        <div className="pointer-events-none absolute inset-x-4 bottom-10 flex gap-1 lg:bottom-4">
          {images.slice(0, 24).map((src, i) => (
            <span key={src} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
              <span
                className={`block h-full origin-left bg-white transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                  i <= index ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </span>
          ))}
        </div>
        <span className="font-tech pointer-events-none absolute right-4 bottom-14 rounded-full bg-card/90 px-2.5 py-1 text-[11px] shadow-sm backdrop-blur-md lg:top-4 lg:bottom-auto">
          {index + 1} / {total}
        </span>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="absolute top-1/2 left-4 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-card/90 opacity-0 shadow-md backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-paper disabled:invisible lg:grid"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index === total - 1}
              className="absolute top-1/2 right-4 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-card/90 opacity-0 shadow-md backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-paper disabled:invisible lg:grid"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setLightbox(index)}
          className="absolute top-4 left-4 hidden size-10 place-items-center rounded-full bg-card/90 shadow-md backdrop-blur-md transition-transform hover:scale-110 lg:grid"
          aria-label="Pantalla completa"
        >
          <Expand className="size-4" />
        </button>
      </div>

      {/* Miniaturas (escritorio) */}
      {total > 1 && (
        <div className="no-scrollbar mt-3 hidden gap-2 overflow-x-auto pb-1 lg:flex">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => scrollToIndex(track.current, i)}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition-all duration-300 ${
                i === index ? "ring-brand" : "opacity-60 ring-transparent hover:opacity-100"
              }`}
              aria-label={`Ir a la foto ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="96px" quality={70} className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox !== null && (
        <Lightbox images={images} alt={alt} start={lightbox} onClose={(i) => {
          setLightbox(null);
          scrollToIndex(track.current, i, false);
        }} />
      )}
    </div>
  );
}

// Todas las fotos a la vista en cuadrícula (casi nadie desliza un carrusel hasta el final)
export function PhotoGrid({ images, alt, sold, max = 9 }: { images: string[]; alt: string; sold?: boolean; max?: number }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [all, setAll] = useState(false);
  const ready = useAfterLoad();
  const shown = all ? images : images.slice(0, max);
  const rest = images.length - shown.length;
  return (
    <>
      <ul className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {shown.map((src, i) => (
          <li key={src} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <button
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-soft"
              aria-label={`Ver foto ${i + 1} de ${images.length}`}
            >
              {ready ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 34vw, 64vw" : "(min-width: 1024px) 17vw, 32vw"}
                  quality={70}
                  className={`object-cover transition-transform duration-500 group-hover:scale-105 ${sold ? "grayscale" : ""}`}
                />
              ) : (
                <span className="skeleton absolute inset-0" />
              )}
            </button>
          </li>
        ))}
      </ul>
      {rest > 0 && (
        <button
          type="button"
          onClick={() => setAll(true)}
          className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-card text-sm font-semibold transition-colors hover:border-fg/30"
        >
          Ver las {images.length} fotos
        </button>
      )}
      {lightbox !== null && <Lightbox images={images} alt={alt} start={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}

function Lightbox({
  images,
  alt,
  start,
  onClose,
}: {
  images: string[];
  alt: string;
  start: number;
  onClose: (index: number) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const { index } = useActiveIndex(track);
  const indexRef = useRef(start);
  const closeRef = useRef(onClose);
  useEffect(() => {
    indexRef.current = index;
    closeRef.current = onClose;
  });

  useEffect(() => {
    scrollToIndex(track.current, start, false);
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current(indexRef.current);
      if (e.key === "ArrowRight") scrollToIndex(track.current, indexRef.current + 1);
      if (e.key === "ArrowLeft") scrollToIndex(track.current, indexRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [start]);

  return (
    <div className="fixed inset-0 z-[70] bg-black animate-fade" role="dialog" aria-modal="true" aria-label="Galería">
      <div ref={track} className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto">
        {images.map((src, i) => (
          <div key={src} className="relative h-full w-full shrink-0 snap-center">
            <Image
              src={src}
              alt={`${alt}, foto ${i + 1}`}
              fill
              sizes="100vw"
              quality={80}
              loading={Math.abs(i - start) < 2 ? "eager" : "lazy"}
              className="object-contain"
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <span className="font-tech rounded-full bg-white/10 px-3 py-1.5 text-xs backdrop-blur-md">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={() => onClose(index)}
          className="pointer-events-auto grid size-12 place-items-center rounded-full bg-white/10 backdrop-blur-md transition-transform hover:scale-110"
          aria-label="Cerrar galería"
        >
          <X className="size-6" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => scrollToIndex(track.current, index - 1)}
        className="absolute top-1/2 left-4 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur-md sm:grid"
        aria-label="Foto anterior"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        type="button"
        onClick={() => scrollToIndex(track.current, index + 1)}
        className="absolute top-1/2 right-4 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur-md sm:grid"
        aria-label="Foto siguiente"
      >
        <ChevronRight className="size-6" />
      </button>
    </div>
  );
}
