"use client";

import { useEffect, useState, type ReactNode } from "react";

// Renderiza a sus hijos solo cuando la página ya terminó de cargar
export function AfterLoad({ children, delay = 300 }: { children: ReactNode; delay?: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const go = () => {
      timer = setTimeout(() => setReady(true), delay);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", go);
    };
  }, [delay]);
  return ready ? children : null;
}
