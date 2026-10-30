import Image from "next/image";
import type { Car } from "@/lib/cars";

export const TYPE_LABEL: Record<string, string> = {
  Deportivo: "Deportivos",
  Blindado: "Blindados",
  Convertible: "Convertibles",
  Recreativo: "Recreativos",
  Pickup: "Pickups",
};

export type Category = { type: string; count: number; images: string[] };

// Categorías del inventario con la foto real de un auto de cada tipo (pedido del dueño, 31-oct: los íconos
// dibujados no gustaron). Los blindados cuentan también como su carrocería. Primero los destacados.
export function categoriesOf(cars: Car[]): { all: Category; types: Category[] } {
  const ordered = [...cars].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  const map = new Map<string, Category>();
  for (const car of ordered) {
    for (const t of car.armored ? [car.body, "Blindado"] : [car.body]) {
      const c = map.get(t) ?? { type: t, count: 0, images: [] };
      c.count += 1;
      if (car.images[0] && c.images.length < 1) c.images.push(car.images[0]);
      map.set(t, c);
    }
  }
  const types = [...map.values()].sort((a, b) => b.count - a.count);
  const all = {
    type: "Todos",
    count: cars.length,
    images: ordered.flatMap((c) => (c.images[0] ? [c.images[0]] : [])).slice(0, 4),
  };
  return { all, types };
}

export function CategoryTileContent({ category, active }: { category: Category; active?: boolean }) {
  const { type, count, images } = category;
  const label = type === "Todos" ? "Todos" : (TYPE_LABEL[type] ?? type);
  return (
    <>
      <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-md bg-soft">
        {type === "Todos" && images.length > 1 ? (
          // Mosaico de 4 autos
          <span className="grid h-full grid-cols-2 gap-0.5">
            {images.map((src) => (
              <span key={src} className="relative overflow-hidden">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="76px"
                  quality={70}
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110"
                />
              </span>
            ))}
          </span>
        ) : images[0] ? (
          <Image
            src={images[0]}
            alt=""
            fill
            sizes="152px"
            quality={70}
            className="object-cover object-[50%_60%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110"
          />
        ) : null}
      </span>
      <span className="mt-2.5 flex w-full items-baseline justify-between gap-2 px-1">
        <span className="text-sm font-semibold">{label}</span>
        <span className={`text-xs tabular-nums ${active ? "text-white/70" : "text-dim"}`}>{count}</span>
      </span>
    </>
  );
}

export function categoryTileClass(active?: boolean) {
  return `group relative flex w-[9.5rem] shrink-0 snap-start flex-col rounded-lg p-1.5 pb-2.5 ring-1 transition-[transform,box-shadow,background-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 active:scale-[0.97] ${
    active
      ? "bg-night text-white shadow-[0_16px_34px_-18px_rgb(20_20_20/0.6)] ring-night"
      : "bg-card text-fg ring-line hover:shadow-[0_16px_34px_-20px_rgb(20_20_20/0.4)] hover:ring-fg/25"
  }`;
}
