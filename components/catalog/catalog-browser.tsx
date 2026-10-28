"use client";

import { useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { CategoryTileContent, categoryTileClass } from "@/components/category-tile";
import { WhatsAppIcon } from "@/components/icons";
import type { Car } from "@/lib/cars";
import { site, whatsappUrl } from "@/lib/site";

type Filters = {
  q: string;
  tipo: string;
  marca: string;
  precio: string;
  anio: string;
  trans: string;
  orden: string;
};

const EMPTY: Filters = { q: "", tipo: "", marca: "", precio: "", anio: "", trans: "", orden: "recientes" };

const PRICES = [
  { label: "Hasta $300k", value: "0-300000" },
  { label: "$300k – $600k", value: "300000-600000" },
  { label: "$600k – $1M", value: "600000-1000000" },
  { label: "Más de $1M", value: "1000000-" },
];

const SORTS = [
  { label: "Más recientes", value: "recientes" },
  { label: "Menor precio", value: "precio-asc" },
  { label: "Mayor precio", value: "precio-desc" },
  { label: "Modelo más nuevo", value: "anio-desc" },
  { label: "Menos kilómetros", value: "km-asc" },
];

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function applyFilters(cars: Car[], f: Filters) {
  const q = normalize(f.q.trim());
  const [min, max] = f.precio ? f.precio.split("-").map((v) => (v ? Number(v) : undefined)) : [];
  const list = cars.filter((c) => {
    if (q) {
      const hay = normalize(`${c.brand} ${c.model} ${c.version ?? ""} ${c.year} ${c.body} ${c.color ?? ""} ${c.engine ?? ""}`);
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    if (f.tipo === "Blindado" ? !c.armored : f.tipo && c.body !== f.tipo) return false;
    if (f.marca && c.brand !== f.marca) return false;
    if (min != null && c.price < min) return false;
    if (max != null && c.price > max) return false;
    if (f.anio && c.year < Number(f.anio)) return false;
    if (f.trans && c.transmission !== f.trans) return false;
    return true;
  });
  const sorters: Record<string, (a: Car, b: Car) => number> = {
    "precio-asc": (a, b) => a.price - b.price,
    "precio-desc": (a, b) => b.price - a.price,
    "anio-desc": (a, b) => b.year - a.year,
    "km-asc": (a, b) => (a.mileage ?? Infinity) - (b.mileage ?? Infinity),
  };
  return sorters[f.orden] ? [...list].sort(sorters[f.orden]) : list;
}

function Chip({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md border px-3.5 text-sm font-medium transition-all duration-300 active:scale-95 ${
        active ? "border-night bg-night text-white" : "border-line bg-card text-fg/80 hover:border-fg/40 hover:text-fg"
      }`}
    >
      {children}
      {count != null && <span className={`text-xs ${active ? "text-white/70" : "text-dim"}`}>{count}</span>}
    </button>
  );
}

// Categoría con ícono propio, la misma del inicio
function TypeTile({
  type,
  count,
  active,
  onClick,
}: {
  type: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={categoryTileClass(active)}>
      <CategoryTileContent type={type} count={count} active={active} />
    </button>
  );
}

export function CatalogBrowser({ cars }: { cars: Car[] }) {
  const [f, setF] = useState<Filters>(EMPTY);
  const [sheet, setSheet] = useState(false);
  // Estado (no ref): así el primer efecto, que aún tiene los filtros vacíos, no borra el ?tipo= del URL
  const [ready, setReady] = useState(false);

  // Lee los filtros del URL (?tipo=SUV, etc.) antes de pintar
  useIsoLayoutEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setF({
      ...EMPTY,
      ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, p.get(k) ?? EMPTY[k as keyof Filters]])),
    });
    setReady(true);
  }, []);

  // Mantiene el URL sincronizado para poder compartir la búsqueda
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(f)) if (v && v !== EMPTY[k as keyof Filters]) p.set(k, v);
    const qs = p.toString();
    if (qs === window.location.search.slice(1)) return;
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [f, ready]);

  useEffect(() => {
    document.documentElement.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [sheet]);

  const results = useMemo(() => applyFilters(cars, f), [cars, f]);
  const set = (k: keyof Filters, v: string) => setF((prev) => ({ ...prev, [k]: prev[k] === v ? EMPTY[k] : v }));

  const types = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of cars) {
      for (const t of c.armored ? [c.body, "Blindado"] : [c.body]) m.set(t, (m.get(t) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [cars]);
  const brands = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of cars) m.set(c.brand, (m.get(c.brand) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [cars]);
  const years = useMemo(() => {
    const ys = [...new Set(cars.map((c) => c.year))].sort((a, b) => b - a);
    return ys.filter((y, i) => i === 0 || y % 2 === 0 || i === ys.length - 1);
  }, [cars]);

  const activeCount = (["tipo", "marca", "precio", "anio", "trans"] as const).filter((k) => f[k]).length;
  const filterKey = JSON.stringify(f);

  const summary = [f.tipo, f.marca, PRICES.find((p) => p.value === f.precio)?.label, f.anio && `desde ${f.anio}`, f.q]
    .filter(Boolean)
    .join(", ");

  const advanced = (
    <div className="space-y-7">
      <fieldset>
        <legend className="font-tech mb-3 text-xs text-dim">Marca</legend>
        <div className="flex flex-wrap gap-2">
          {brands.map(([b, n]) => (
            <Chip key={b} active={f.marca === b} onClick={() => set("marca", b)} count={n}>
              {b}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-tech mb-3 text-xs text-dim">Precio</legend>
        <div className="flex flex-wrap gap-2">
          {PRICES.map((p) => (
            <Chip key={p.value} active={f.precio === p.value} onClick={() => set("precio", p.value)}>
              {p.label}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-tech mb-3 text-xs text-dim">Año desde</legend>
        <div className="flex flex-wrap gap-2">
          {years.map((y) => (
            <Chip key={y} active={f.anio === String(y)} onClick={() => set("anio", String(y))}>
              {y}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-tech mb-3 text-xs text-dim">Transmisión</legend>
        <div className="flex flex-wrap gap-2">
          {["Automática", "Manual"].map((t) => (
            <Chip key={t} active={f.trans === t} onClick={() => set("trans", t)}>
              {t}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
      {/* Filtros en escritorio */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2 pb-6">
          {advanced}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => setF((p) => ({ ...EMPTY, q: p.q, orden: p.orden }))}
              className="mt-7 text-sm font-semibold underline underline-offset-4 hover:text-brand-hi"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Buscador + orden */}
        <div className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Buscar auto</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-dim" />
            <input
              type="search"
              value={f.q}
              onChange={(e) => setF((p) => ({ ...p, q: e.target.value }))}
              placeholder="Busca marca, modelo o año…"
              className="h-12 w-full rounded-md border border-line bg-card pr-4 pl-12 text-fg placeholder:text-dim focus:border-fg/50 focus:ring-4 focus:ring-fg/5 focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => setSheet(true)}
            className={`relative inline-flex h-12 items-center gap-2 rounded-md border px-4 font-medium transition-colors lg:hidden ${
              activeCount > 0 ? "border-night bg-night text-white" : "border-line bg-card"
            }`}
          >
            <SlidersHorizontal className="size-5" />
            <span className="sr-only sm:not-sr-only">Filtros</span>
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-sm bg-brand text-[11px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>
          <label className="hidden sm:block">
            <span className="sr-only">Ordenar</span>
            <select
              value={f.orden}
              onChange={(e) => setF((p) => ({ ...p, orden: e.target.value }))}
              className="h-12 rounded-md border border-line bg-card px-4 pr-8 text-fg focus:border-fg/50 focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Tipos con ícono (acceso rápido) */}
        <div
          className="no-scrollbar -mx-4 mt-5 flex snap-x scroll-px-4 gap-2.5 overflow-x-auto px-4 pt-1 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0"
          role="group"
          aria-label="Tipo de auto"
        >
          <TypeTile type="Todos" count={cars.length} active={!f.tipo} onClick={() => setF((p) => ({ ...p, tipo: "" }))} />
          {types.map(([t, count]) => (
            <TypeTile key={t} type={t} count={count} active={f.tipo === t} onClick={() => set("tipo", t)} />
          ))}
        </div>

        <div className="mt-6 mb-4 flex items-center justify-between gap-3">
          <p className="flex items-baseline gap-2 text-sm text-mute" aria-live="polite">
            <span key={results.length} className="font-display inline-block text-2xl text-fg animate-rise">
              {results.length}
            </span>{" "}
            {results.length === 1 ? "auto encontrado" : "autos encontrados"}
          </p>
          {(activeCount > 0 || f.q) && (
            <button
              type="button"
              onClick={() => setF((p) => ({ ...EMPTY, orden: p.orden }))}
              className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline"
            >
              <X className="size-4" /> Limpiar
            </button>
          )}
        </div>

        <h2 className="sr-only">Resultados</h2>
        {results.length > 0 ? (
          <div key={filterKey} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((car, i) => (
              <div key={car.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
                <CarCard car={car} preload={i < 2} sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 50vw" />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-card px-6 py-14 text-center ring-1 ring-line">
            <p className="font-display text-3xl">Sin resultados… por ahora.</p>
            <p className="mx-auto mt-3 max-w-sm text-mute">
              Nuestro inventario cambia rápido. Dinos qué buscas y te avisamos cuando llegue.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={whatsappUrl(
                  `Hola ${site.name} 👋 Estoy buscando un auto${summary ? ` (${summary})` : ""}. ¿Me avisan si tienen algo así?`,
                )}
                target="_blank"
                rel="noopener"
                className="btn btn-wa btn-shine"
              >
                <WhatsAppIcon className="size-5" /> Búscame uno
              </a>
              <button
                type="button"
                onClick={() => setF(EMPTY)}
                className="btn btn-outline"
              >
                Ver todos
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hoja de filtros en móvil */}
      {sheet && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade"
            onClick={() => setSheet(false)}
            aria-label="Cerrar filtros"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-xl border-t border-line bg-card animate-sheet">
            <div className="mx-auto mt-3 h-1 w-10 rounded-sm bg-soft-2" />
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <p className="font-display text-2xl">Filtros</p>
              <button
                type="button"
                onClick={() => setSheet(false)}
                className="grid size-10 place-items-center rounded-md bg-soft"
                aria-label="Cerrar"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 pt-3 pb-6">
              <fieldset className="mb-7">
                <legend className="font-tech mb-3 text-xs text-dim">Ordenar por</legend>
                <div className="flex flex-wrap gap-2">
                  {SORTS.map((s) => (
                    <Chip key={s.value} active={f.orden === s.value} onClick={() => setF((p) => ({ ...p, orden: s.value }))}>
                      {s.label}
                    </Chip>
                  ))}
                </div>
              </fieldset>
              {advanced}
            </div>
            <div className="flex gap-3 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setF((p) => ({ ...EMPTY, q: p.q }))}
                className="btn btn-outline"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setSheet(false)}
                className="btn btn-dark btn-shine flex-1"
              >
                Ver {results.length} {results.length === 1 ? "auto" : "autos"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
