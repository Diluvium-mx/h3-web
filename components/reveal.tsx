"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
// Lo que ya apareció no se vuelve a animar (por ejemplo, el pie de página al cambiar de página)
const shown = new WeakSet<Element>();
let booted = false;

function keyframes(el: Element): Keyframe[] {
  const from = el.classList.contains("reveal-zoom")
    ? "scale(0.96)"
    : el.classList.contains("reveal-left")
      ? "translateX(-28px)"
      : "translateY(22px)";
  return [
    { opacity: 0, transform: from },
    { opacity: 1, transform: "none" },
  ];
}

// Animación de entrada para todo lo que tenga la clase .reveal: aparece cuando entra en pantalla.
// Usa Web Animations para no tocar las clases ni los estilos del HTML (así React no ve diferencias al
// hidratar). Funciona en cualquier navegador; sin JavaScript o con «reducir movimiento», todo se ve normal.
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Al abrir el sitio, lo que ya se ve no se anima (no parpadea); al navegar, sí
    const firstLoad = !booted;
    const timer = window.setTimeout(() => (booted = true));
    const waiting = new Map<Element, Animation>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          waiting.get(e.target)?.play();
          waiting.delete(e.target);
          shown.add(e.target);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const watch = () => {
      for (const el of document.querySelectorAll(".reveal")) {
        if (shown.has(el) || waiting.has(el)) continue;
        const r = el.getBoundingClientRect();
        const inView = r.top < window.innerHeight && r.bottom > 0;
        if (inView && firstLoad) {
          shown.add(el);
          continue;
        }
        const i = Number(getComputedStyle(el).getPropertyValue("--i")) || 0;
        const anim = el.animate(keyframes(el), { duration: 800, easing: EASE, delay: i * 70, fill: "backwards" });
        if (inView) {
          shown.add(el);
        } else {
          anim.pause(); // se queda oculto hasta que entre en pantalla
          waiting.set(el, anim);
          io.observe(el);
        }
      }
    };
    watch();
    // El contenido que llega después (carga por partes) también se anima
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
      mo.disconnect();
      for (const anim of waiting.values()) anim.cancel();
    };
  }, [pathname]);

  return null;
}
