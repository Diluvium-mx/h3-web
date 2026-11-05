"use client";

import { useEffect, useRef } from "react";

// Línea roja arriba que avanza conforme se baja por la página (microanimación, 31-oct)
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left scale-x-0 bg-brand"
      aria-hidden="true"
    />
  );
}
