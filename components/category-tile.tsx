import { AllCarsIcon, BodyIcon } from "@/components/body-icons";

export const TYPE_LABEL: Record<string, string> = {
  Deportivo: "Deportivos",
  Blindado: "Blindados",
  Convertible: "Convertibles",
  Recreativo: "Recreativos",
  Pickup: "Pickups",
};

// Categoría con ícono propio (sirve como enlace en el inicio y como botón en el inventario)
export function CategoryTileContent({
  type,
  count,
  active,
}: {
  type: string | "Todos";
  count: number;
  active?: boolean;
}) {
  return (
    <>
      <span className="relative block">
        {type === "Todos" ? (
          <AllCarsIcon className="h-10 w-[5.5rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
        ) : (
          <BodyIcon type={type} className="h-10 w-[5.5rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
        )}
      </span>
      <span className="mt-1 text-sm font-semibold">{type === "Todos" ? "Todos" : (TYPE_LABEL[type] ?? type)}</span>
      <span className={`text-[11px] ${active ? "text-white/70" : "text-dim"}`}>
        {count} {count === 1 ? "auto" : "autos"}
      </span>
      <span
        className={`absolute inset-x-4 bottom-0 h-0.5 origin-left rule-accent transition-transform duration-500 ease-[var(--ease-out-expo)] ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </>
  );
}

export function categoryTileClass(active?: boolean) {
  return `group relative flex w-[8.5rem] shrink-0 snap-start flex-col items-center gap-1 rounded-lg px-3 pt-5 pb-4 ring-1 transition-[transform,box-shadow,background-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 active:scale-[0.97] ${
    active
      ? "bg-night text-white shadow-[0_16px_34px_-18px_rgb(20_20_20/0.6)] ring-night"
      : "bg-card text-fg ring-line hover:shadow-[0_16px_34px_-20px_rgb(20_20_20/0.4)] hover:ring-fg/25"
  }`;
}
