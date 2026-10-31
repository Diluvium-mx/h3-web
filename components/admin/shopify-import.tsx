"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Download, Loader2, X } from "lucide-react";
import { importShopifyAction, listShopifyAction, type ShopifyListItem } from "@/lib/actions";
import { formatPrice } from "@/lib/cars";

type State = "idle" | "working" | "done" | "error";

export function ShopifyImport({ defaultStore }: { defaultStore: string }) {
  const [store, setStore] = useState(defaultStore);
  const [items, setItems] = useState<ShopifyListItem[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<Record<string, { state: State; msg?: string }>>({});
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    const res = await listShopifyAction(store);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems(res.items);
    setSelected(new Set(res.items.filter((i) => !i.imported).map((i) => i.handle)));
  }

  async function run() {
    if (!items) return;
    setRunning(true);
    for (const item of items.filter((i) => selected.has(i.handle))) {
      setStatus((s) => ({ ...s, [item.handle]: { state: "working" } }));
      const res = await importShopifyAction(store, item.handle);
      setStatus((s) => ({
        ...s,
        [item.handle]: res.ok ? { state: "done" } : { state: "error", msg: res.error },
      }));
      if (res.ok) setSelected((sel) => {
        const next = new Set(sel);
        next.delete(item.handle);
        return next;
      });
    }
    setRunning(false);
  }

  const doneCount = Object.values(status).filter((s) => s.state === "done").length;

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-line bg-card p-4 sm:p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Dirección de la tienda Shopify</span>
          <div className="flex gap-2">
            <input
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className="h-12 w-full rounded-md border border-line bg-soft px-4 focus:border-fg/50 focus:outline-none"
              placeholder="https://www.h3seminuevos.com"
            />
            <button
              type="button"
              onClick={load}
              disabled={loading || running}
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-md bg-night px-4 font-semibold text-white disabled:opacity-60"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Buscar
            </button>
          </div>
        </label>
        <p className="mt-3 text-sm text-mute">
          Copia los autos y sus fotos a tu nuevo sitio. Hazlo <b>antes</b> de cancelar Shopify: después las fotos
          dejarán de existir.
        </p>
        {error && <p className="mt-3 text-sm text-brand-hi">{error}</p>}
      </div>

      {items && (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-mute">
              {items.length} productos · {selected.size} seleccionados
              {doneCount > 0 && ` · ${doneCount} importados`}
            </p>
            <button
              type="button"
              onClick={run}
              disabled={running || selected.size === 0}
              className="btn btn-dark btn-shine disabled:opacity-50"
            >
              {running ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              {running ? "Importando…" : "Importar seleccionados"}
            </button>
          </div>
          <ul className="space-y-2">
            {items.map((item) => {
              const st = status[item.handle];
              const disabled = item.imported || st?.state === "done";
              return (
                <li key={item.handle} className="flex items-center gap-3 rounded-lg border border-line bg-card p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(item.handle)}
                    disabled={disabled || running}
                    onChange={(e) =>
                      setSelected((sel) => {
                        const next = new Set(sel);
                        if (e.target.checked) next.add(item.handle);
                        else next.delete(item.handle);
                        return next;
                      })
                    }
                    className="size-5 accent-[var(--color-brand)]"
                    aria-label={`Seleccionar ${item.title}`}
                  />
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-soft">
                    {item.image && <Image src={item.image} alt="" fill sizes="56px" quality={70} className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.title}</p>
                    <p className="text-sm text-mute">
                      {formatPrice(item.price)} · {item.images} fotos
                    </p>
                    {st?.msg && <p className="text-xs text-brand-hi">{st.msg}</p>}
                  </div>
                  <span className="shrink-0">
                    {item.imported && !st && <span className="text-xs text-mute">Ya importado</span>}
                    {st?.state === "working" && <Loader2 className="size-5 animate-spin text-mute" />}
                    {st?.state === "done" && <Check className="size-5 text-wa-dark" />}
                    {st?.state === "error" && <X className="size-5 text-brand-hi" />}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
