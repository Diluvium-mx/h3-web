import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { cardData } from "@/lib/cars";
import { getPublicCars } from "@/lib/data";
import { vars } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Catálogo de autos seminuevos en Villahermosa",
  description:
    "Inventario actualizado de autos y camionetas seminuevas en Villahermosa, Tabasco: SUVs, pickups, deportivos y blindados. Cotiza por WhatsApp.",
  alternates: { canonical: "/autos" },
};

export default async function CatalogPage() {
  const cars = await getPublicCars();
  return (
    <div className="relative overflow-hidden">
      {/* Franjas de carreras en los colores de la marca */}
      <div className="pointer-events-none absolute -top-10 -right-24 h-56 w-[28rem] -rotate-12 sm:-right-10 lg:top-8" aria-hidden="true">
        <span className="absolute top-8 left-0 h-6 w-full origin-right -skew-x-12 bg-volt animate-[stripe_0.9s_var(--ease-out-expo)_both]" />
        <span className="absolute top-16 left-10 h-6 w-full origin-right -skew-x-12 bg-brand animate-[stripe_0.9s_var(--ease-out-expo)_0.12s_both]" />
        <span className="absolute top-24 left-20 h-2 w-full origin-right -skew-x-12 bg-night animate-[stripe_0.9s_var(--ease-out-expo)_0.24s_both]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-24 sm:px-6 sm:pt-28">
        <header className="stagger mb-6">
          <p className="flex w-fit items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-fg shadow-sm ring-1 ring-line">
            <MapPin className="size-3.5 text-brand" />
            Villahermosa, Tabasco
          </p>
          <h1 className="font-display relative isolate mt-4 inline-block text-[3.4rem] sm:text-7xl" style={vars({ "--i": 1 })}>
            <span className="absolute inset-x-[-0.15em] bottom-[0.08em] -z-10 h-[0.38em] -skew-x-12 bg-volt" />
            Catálogo
          </h1>
          <p className="mt-3 max-w-xl text-mute" style={vars({ "--i": 2 })}>
            <b className="text-fg">{cars.length} autos</b> listos para rodar. Toca el que te guste y escríbenos directo
            por WhatsApp.
          </p>
        </header>
        <CatalogBrowser cars={cars.map(cardData)} />
      </div>
    </div>
  );
}
