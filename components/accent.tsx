import type { ReactNode } from "react";

// Palabra resaltada en un título: cursiva roja y, si se pide, un trazo a mano debajo que se dibuja cuando la
// sección entra en pantalla (lo anima components/reveal.tsx; sin JavaScript se ve completo).
// `onDark`: rojo más claro para fondos oscuros.
export function Accent({ children, underline, onDark }: { children: ReactNode; underline?: boolean; onDark?: boolean }) {
  return (
    <span
      className={`font-accent relative inline-block pr-[0.06em] text-[1.06em] ${onDark ? "text-brand-glow" : "text-brand"}`}
    >
      {children}
      {underline && (
        <svg
          className="pointer-events-none absolute -bottom-[0.06em] left-0 h-[0.2em] w-full"
          viewBox="0 0 200 20"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M3 14 C 50 6, 110 4, 197 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            pathLength={1}
            data-draw=""
            strokeDasharray="1"
          />
        </svg>
      )}
    </span>
  );
}

// Frase marcada como con plumón rojo detrás del texto (también se dibuja al aparecer)
export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative isolate inline-block whitespace-nowrap">
      <svg
        className="pointer-events-none absolute inset-x-[-0.08em] bottom-[0.02em] -z-10 h-[0.42em] w-[calc(100%+0.16em)]"
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M4 11 C 60 8, 140 13, 196 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
          pathLength={1}
          data-draw=""
          strokeDasharray="1"
          className="text-brand"
        />
      </svg>
      {children}
    </span>
  );
}
