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
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-24 sm:px-6 sm:pt-28">
      <header className="stagger mb-8">
        <p className="font-tech flex items-center gap-2 text-xs text-brand-hi">
          <span className="h-0.5 w-6 skew-x-[-20deg] bg-brand" />
          Villahermosa, Tabasco
        </p>
        <h1 className="font-display mt-3 text-5xl sm:text-7xl" style={vars({ "--i": 1 })}>
          Catálogo
        </h1>
        <p className="mt-3 max-w-xl text-mute" style={vars({ "--i": 2 })}>
          {cars.length} autos listos para rodar. Toca el que te guste y escríbenos directo por WhatsApp.
        </p>
      </header>
      <CatalogBrowser cars={cars.map(cardData)} />
    </div>
  );
}
