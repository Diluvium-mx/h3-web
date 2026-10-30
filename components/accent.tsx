import type { ReactNode } from "react";

// Palabra resaltada en un título: cursiva roja y, si se pide, un trazo a mano debajo que se dibuja cuando la
// sección entra en pantalla (lo anima components/reveal.tsx; sin JavaScript se ve completo).
export function Accent({ children, underline }: { children: ReactNode; underline?: boolean }) {
  return (
    <span className="font-accent relative inline-block pr-[0.06em] text-[1.06em] text-brand">
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
