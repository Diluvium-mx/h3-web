import { SquaresFourIcon } from "@phosphor-icons/react/dist/ssr";
import { VehicleIcon } from "@/components/vehicle-icons";
import type { Car } from "@/lib/cars";

export const TYPE_LABEL: Record<string, string> = {
  Deportivo: "Deportivos",
  Blindado: "Blindados",
  Convertible: "Convertibles",
  Recreativo: "Recreativos",
  Pickup: "Pickups",
};

export type Category = { type: string; count: number };

// Categorías del inventario con su número de autos. Los blindados cuentan también como su carrocería.
export function categoriesOf(cars: Car[]): { all: Category; types: Category[] } {
  const map = new Map<string, Category>();
  for (const car of cars) {
    for (const t of car.armored ? [car.body, "Blindado"] : [car.body]) {
      const c = map.get(t) ?? { type: t, count: 0 };
      c.count += 1;
      map.set(t, c);
    }
  }
  const types = [...map.values()].sort((a, b) => b.count - a.count);
  return { all: { type: "Todos", count: cars.length }, types };
}

// Categoría con ícono a dos tonos en un cuadro de color (31-oct: el dueño prefiere íconos, no fotos)
export function CategoryTileContent({ category, active }: { category: Category; active?: boolean }) {
  const { type, count } = category;
  const label = type === "Todos" ? "Todos" : (TYPE_LABEL[type] ?? type);
  return (
    <>
      <span
        className={`grid size-14 place-items-center rounded-lg transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:scale-105 ${
          active ? "bg-white/10 text-white" : "bg-brand-soft text-brand group-hover:bg-brand group-hover:text-white"
        }`}
      >
        {type === "Todos" ? (
          <SquaresFourIcon weight="duotone" className="size-8" aria-hidden="true" />
        ) : (
          <VehicleIcon type={type} className="size-8" />
        )}
      </span>
      <span className="mt-3 text-sm font-semibold">{label}</span>
      <span className={`text-xs tabular-nums ${active ? "text-white/70" : "text-dim"}`}>
        {count} {count === 1 ? "auto" : "autos"}
      </span>
    </>
  );
}

export function categoryTileClass(active?: boolean) {
  return `group relative flex w-[7.75rem] shrink-0 snap-start flex-col items-center rounded-xl px-3 pt-4 pb-3.5 ring-1 transition-[transform,box-shadow,background-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 active:scale-[0.97] ${
    active
      ? "bg-night text-white shadow-[0_16px_34px_-18px_rgb(20_20_20/0.6)] ring-night"
      : "bg-card text-fg ring-line hover:shadow-[0_16px_34px_-20px_rgb(20_20_20/0.4)] hover:ring-fg/25"
  }`;
}
