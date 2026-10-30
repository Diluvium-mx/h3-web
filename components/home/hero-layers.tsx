"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Profundidad del hero: al bajar, cada capa se mueve a su propia velocidad (el fondo se aleja más lento,
// la palabra gigante pasa por detrás del auto). Solo cambia una variable CSS (--y) y las capas usan
// transform, así no se recalcula el diseño. Con «reducir movimiento» todo se queda quieto.
export function HeroLayers({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, el.offsetHeight);
      el.style.setProperty("--y", `${y}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={ref} className={className} aria-labelledby="hero-title">
      {children}
    </section>
  );
}
