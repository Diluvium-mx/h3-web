import type { CSSProperties } from "react";

// Permite pasar variables CSS (ej. --i para animaciones escalonadas)
export function vars(v: Record<`--${string}`, string | number>) {
  return v as CSSProperties;
}
