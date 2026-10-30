"use client";

import { useEffect } from "react";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
// Lo que ya apareció no se vuelve a animar (por ejemplo, el pie de página al cambiar de página)
const shown = new WeakSet<Element>();
let booted = false;

function keyframes(el: Element): Keyframe[] {
  // Cortinilla: la imagen se descubre de izquierda a derecha
  if (el.classList.contains("reveal-wipe")) {
    return [
      { clipPath: "inset(0 100% 0 0)", transform: "scale(1.06)" },
      { clipPath: "inset(0 0% 0 0)", transform: "none" },
    ];
  }
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
// No usa la ruta: al cambiar de página, el contenido nuevo llega como cambio del DOM y se procesa igual.
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Al abrir el sitio, lo que ya se ve no se anima (no parpadea); lo que llega al navegar, sí
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
        if (inView && !booted) {
          shown.add(el);
          continue;
        }
        const i = Number(getComputedStyle(el).getPropertyValue("--i")) || 0;
        const wipe = el.classList.contains("reveal-wipe");
        // La cortinilla se aplica a la foto de adentro: si se recorta el elemento vigilado, el navegador
        // no detecta cuándo entra en pantalla
        const target = (wipe && el.querySelector("img")) || el;
        const anim = target.animate(keyframes(el), { duration: wipe ? 1300 : 800, easing: EASE, delay: i * 70, fill: "backwards" });
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
    // El contenido que llega después (carga por partes o al navegar) también se anima
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
      mo.disconnect();
      for (const anim of waiting.values()) anim.cancel();
    };
  }, []);

  return null;
}
