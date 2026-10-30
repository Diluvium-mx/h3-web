"use client";

import { useEffect, useRef, useState } from "react";

// Avance (0 a 1) del visitante dentro de una sección alta con contenido fijo (sticky): 0 cuando la sección
// llega arriba, 1 cuando está por terminar. Empieza en 1 (estado final) para que sin JavaScript o con
// «reducir movimiento» se vea todo completo.
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(1);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const room = r.height - window.innerHeight;
      setProgress(room > 0 ? Math.min(1, Math.max(0, -r.top / room)) : 1);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Se activa después de pintar (no en el render) para no cambiar el HTML del servidor al hidratar
    frame = requestAnimationFrame(() => {
      setAnimate(true);
      update();
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, progress, animate };
}
