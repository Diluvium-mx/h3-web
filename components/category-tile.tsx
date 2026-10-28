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
          <AllCarsIcon className="h-9 w-[4.5rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
        ) : (
          <BodyIcon type={type} className="h-9 w-[4.5rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
        )}
      </span>
      <span className="text-sm font-semibold">{type === "Todos" ? "Todos" : (TYPE_LABEL[type] ?? type)}</span>
      <span className={`text-[11px] ${active ? "text-white/70" : "text-dim"}`}>
        {count} {count === 1 ? "auto" : "autos"}
      </span>
      <span
        className={`absolute inset-x-4 bottom-0 h-0.5 origin-left bg-brand transition-transform duration-500 ease-[var(--ease-out-expo)] ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </>
  );
}

export function categoryTileClass(active?: boolean) {
  return `group relative flex w-[7.5rem] shrink-0 snap-start flex-col items-center gap-1.5 rounded-lg px-3 pt-4 pb-3.5 ring-1 transition-colors duration-300 active:scale-[0.98] ${
    active ? "bg-night text-white ring-night" : "bg-card text-fg ring-line hover:ring-fg/30"
  }`;
}
