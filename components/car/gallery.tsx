"use client";

import Image from "next/image";
import { ViewTransition, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useAfterLoad } from "@/components/after-load";
import { PHOTO_SECTION_LABEL, photoTabs, type PhotoSection } from "@/lib/equipment";

type Sections = Record<string, PhotoSection>;
type Props = { images: string[]; alt: string; carId: string; sold?: boolean; sections?: Sections };

// Pestañas «Todas · Exterior 5 · Interior 4…» (solo aparecen si el dueño marcó secciones)
function PhotoTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: ReturnType<typeof photoTabs>;
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-6 overflow-x-auto border-b border-line" role="tablist" aria-label="Secciones de fotos">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className={`relative inline-flex h-11 shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:bg-fg after:transition-transform after:duration-500 after:ease-[var(--ease-out-expo)] ${
            active === t.key ? "text-fg after:scale-x-100" : "text-mute after:scale-x-0 hover:text-fg"
          }`}
        >
          {t.label}
          <span className="text-xs font-normal text-dim">{t.indexes.length}</span>
        </button>
      ))}
    </div>
  );
}

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

export function Gallery({ images, alt, carId, sold, sections = {} }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const { index, maxSeen } = useActiveIndex(track);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const tabs = photoTabs(images, sections);
  const [tab, setTab] = useState("todas");
  const thumbs = tabs.find((t) => t.key === tab)?.indexes ?? images.map((_, i) => i);
  const currentSection = sections[images[index]];
  // Descarga solo las fotos cercanas a la que se está viendo, y hasta que cargó la principal
  const loaded = useAfterLoad();
  const loadUntil = loaded || maxSeen > 0 ? maxSeen + 2 : 0;
  const total = images.length;

  const go = useCallback((delta: number) => scrollToIndex(track.current, Math.max(0, Math.min(total - 1, index + delta))), [index, total]);

  // Al cargar, las fotos se recorren un poco y regresan: asoma la 2ª y se entiende que se pueden deslizar
  // (pedido del dueño, 31-oct, para quien no note la barra ni el contador). Solo una vez y si no han tocado.
  useEffect(() => {
    const el = track.current;
    if (!loaded || !el || total < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const slides = Array.from(el.children).slice(0, 2) as HTMLElement[];
    let anims: Animation[] = [];
    const timer = window.setTimeout(() => {
      if (el.scrollLeft > 4) return; // ya se deslizó
      anims = slides.map((slide) =>
        slide.animate(
          [
            { transform: "translateX(0)" },
            { transform: "translateX(-22%)", offset: 0.45 },
            { transform: "translateX(-22%)", offset: 0.6 },
            { transform: "translateX(0)" },
          ],
          { duration: 1500, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
        ),
      );
    }, 1200);
    const stop = () => anims.forEach((a) => a.cancel());
    el.addEventListener("pointerdown", stop, { once: true });
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener("pointerdown", stop);
      stop();
    };
  }, [loaded, total]);

  if (!total) return <div className="skeleton aspect-square w-full lg:aspect-[5/6] lg:rounded-lg" />;

  return (
    <div className="relative">
      <div className="group relative overflow-hidden bg-soft lg:rounded-lg">
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
            <span key={src} className="h-0.5 flex-1 overflow-hidden bg-white/25">
              <span
                className={`block h-full origin-left bg-white transition-transform duration-500 ease-[var(--ease-out-expo)] ${
                  i <= index ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </span>
          ))}
        </div>
        <span className="font-tech pointer-events-none absolute right-4 bottom-14 rounded-sm bg-night/70 px-2 py-1 text-[10px] text-white backdrop-blur-md lg:top-4 lg:bottom-auto">
          {currentSection && <span className="text-white/70">{PHOTO_SECTION_LABEL[currentSection]} · </span>}
          {index + 1} / {total}
        </span>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={index === 0}
              className="absolute top-1/2 left-4 hidden size-12 -translate-y-1/2 place-items-center rounded-md bg-card/90 opacity-0 shadow-md backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-paper disabled:invisible lg:grid"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index === total - 1}
              className="absolute top-1/2 right-4 hidden size-12 -translate-y-1/2 place-items-center rounded-md bg-card/90 opacity-0 shadow-md backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-paper disabled:invisible lg:grid"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setLightbox(index)}
          className="absolute top-4 left-4 hidden size-10 place-items-center rounded-md bg-card/90 shadow-md backdrop-blur-md transition-transform hover:scale-110 lg:grid"
          aria-label="Pantalla completa"
        >
          <Expand className="size-4" />
        </button>
      </div>

      {/* Miniaturas (escritorio), filtrables por sección */}
      {tabs.length > 0 && (
        <div className="mt-3 hidden lg:block">
          <PhotoTabs
            tabs={tabs}
            active={tab}
            onChange={(key) => {
              setTab(key);
              const first = tabs.find((t) => t.key === key)?.indexes[0];
              if (first != null) scrollToIndex(track.current, first);
            }}
          />
        </div>
      )}
      {total > 1 && (
        <div className="no-scrollbar mt-3 hidden gap-2 overflow-x-auto pb-1 lg:flex">
          {thumbs.map((i) => {
            const src = images[i];
            return (
              <button
                key={src}
                type="button"
                onClick={() => scrollToIndex(track.current, i)}
                className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-md ring-2 transition-all duration-300 ${
                  i === index ? "ring-brand" : "opacity-60 ring-transparent hover:opacity-100"
                }`}
                aria-label={`Ir a la foto ${i + 1}`}
              >
                <Image src={src} alt="" fill sizes="96px" quality={70} className="object-cover" />
              </button>
            );
          })}
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
export function PhotoGrid({
  images: allImages,
  alt,
  sold,
  sections = {},
  max = 9,
}: {
  images: string[];
  alt: string;
  sold?: boolean;
  sections?: Sections;
  max?: number;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [all, setAll] = useState(false);
  const ready = useAfterLoad();
  const tabs = photoTabs(allImages, sections);
  const [tab, setTab] = useState("todas");
  const images = (tabs.find((t) => t.key === tab)?.indexes ?? allImages.map((_, i) => i)).map((i) => allImages[i]);
  const shown = all ? images : images.slice(0, max);
  const rest = images.length - shown.length;
  return (
    <>
      {tabs.length > 0 && (
        <div className="mb-4">
          <PhotoTabs
            tabs={tabs}
            active={tab}
            onChange={(key) => {
              setTab(key);
              setAll(false);
            }}
          />
        </div>
      )}
      <ul key={tab} className="grid animate-fade grid-cols-3 gap-1.5 sm:gap-2">
        {shown.map((src, i) => (
          <li key={src} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <button
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative block aspect-square w-full overflow-hidden rounded-md bg-soft"
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
          className="btn btn-outline mt-3 w-full text-sm"
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
    <div className="fixed inset-0 z-[70] bg-black text-white animate-fade" role="dialog" aria-modal="true" aria-label="Galería">
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
      {/* Barra de arriba sobre un degradado, para que «Cerrar» se vea en cualquier foto */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-10">
        <span className="font-tech rounded-md bg-white/15 px-3 py-2 text-xs text-white backdrop-blur-md">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={() => onClose(index)}
          className="pointer-events-auto inline-flex h-12 items-center gap-2 rounded-md bg-white pr-4 pl-3 text-sm font-semibold text-night shadow-[0_10px_30px_-8px_rgb(0_0_0/0.7)] transition-transform duration-300 hover:scale-105 active:scale-95"
          aria-label="Cerrar galería"
        >
          <X className="size-5" strokeWidth={2.5} />
          Cerrar
        </button>
      </div>
      <button
        type="button"
        onClick={() => scrollToIndex(track.current, index - 1)}
        className="absolute top-1/2 left-4 hidden size-12 -translate-y-1/2 place-items-center rounded-md bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25 sm:grid"
        aria-label="Foto anterior"
      >
        <ChevronLeft className="size-6" />
      </button>
      <button
        type="button"
        onClick={() => scrollToIndex(track.current, index + 1)}
        className="absolute top-1/2 right-4 hidden size-12 -translate-y-1/2 place-items-center rounded-md bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25 sm:grid"
        aria-label="Foto siguiente"
      >
        <ChevronRight className="size-6" />
      </button>
    </div>
  );
}
