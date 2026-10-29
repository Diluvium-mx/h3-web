import { Fragment } from "react";
import { BrandLogo, hasBrandLogo } from "@/components/brand-logos";

// Franja en movimiento con el logo y el nombre de cada marca del inventario
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, "Ready to drive"];
  return (
    <div className="relative -rotate-1 overflow-hidden border-y border-line bg-card py-4" aria-hidden="true">
      {/* Bordes que se desvanecen */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-card to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-card to-transparent sm:w-24" />
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {row.map((item, i) => (
              <Fragment key={`${copy}-${i}`}>
                {item === "Ready to drive" ? (
                  <span className="font-display text-gradient-dark px-7 text-2xl tracking-[0.04em] whitespace-nowrap uppercase sm:text-3xl">
                    {item}
                  </span>
                ) : (
                  <span
                    className={`flex items-center gap-3 px-7 transition-colors duration-300 hover:text-brand ${
                      i % 2 ? "text-dim" : "text-fg"
                    }`}
                  >
                    {hasBrandLogo(item) && <BrandLogo brand={item} className="size-8 shrink-0 sm:size-9" />}
                    <span className="font-display text-2xl tracking-[0.04em] whitespace-nowrap uppercase sm:text-3xl">
                      {item}
                    </span>
                  </span>
                )}
                <span className="rule-accent size-1.5 shrink-0 rotate-45" />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
