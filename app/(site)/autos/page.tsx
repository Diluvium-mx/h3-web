import type { Metadata } from "next";
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
    <>
      {/* Franja oscura como el inicio; el buscador queda flotando sobre su borde */}
      <header className="glow-night relative overflow-hidden px-4 pt-24 pb-14 text-white sm:px-6 sm:pt-32 sm:pb-20">
        <div className="stagger relative mx-auto max-w-7xl">
          <p className="font-tech flex items-center gap-3 text-[11px] text-white/65" style={vars({ "--i": 0 })}>
            <span className="draw-line rule-accent h-px w-8" />
            Villahermosa, Tabasco
          </p>
          <h1 className="font-display mt-4 text-[2.8rem] sm:text-7xl" style={vars({ "--i": 1 })}>
            Inventario
          </h1>
          <p className="mt-3 max-w-xl text-white/70" style={vars({ "--i": 2 })}>
            Autos verificados y con papeles en regla. Toca el que te guste y escríbenos por WhatsApp para agendar tu cita.
          </p>
        </div>
      </header>
      <div className="mx-auto -mt-7 max-w-7xl px-4 pb-24 sm:px-6">
        <CatalogBrowser cars={cars.map(cardData)} />
      </div>
    </>
  );
}
