"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { ExternalLink, Loader2, Pencil, Search, Star, Trash2 } from "lucide-react";
import { deleteCarAction, updateCarAction } from "@/lib/actions";
import { STATUS_LABEL, STATUSES, carName, formatKm, formatPrice, type Car, type CarStatus } from "@/lib/cars";

const STATUS_STYLE: Record<CarStatus, string> = {
  disponible: "bg-wa/15 text-wa-dark",
  apartado: "bg-volt text-night",
  vendido: "bg-fg/10 text-mute",
};

export function AdminCarList({ cars }: { cars: Car[] }) {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<CarStatus | "todos">("todos");
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    const c = { todos: cars.length, disponible: 0, apartado: 0, vendido: 0 };
    for (const car of cars) c[car.status]++;
    return c;
  }, [cars]);

  const list = cars.filter((c) => {
    if (tab !== "todos" && c.status !== tab) return false;
    const hay = `${c.brand} ${c.model} ${c.version ?? ""} ${c.year}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  return (
    <div>
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        {(["todos", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTab(s)}
            className={`h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${
              tab === s ? "border-night bg-night text-white" : "border-line text-fg/80"
            }`}
          >
            {s === "todos" ? "Todos" : STATUS_LABEL[s] + "s"} <span className="opacity-60">{counts[s]}</span>
          </button>
        ))}
      </div>
      <label className="relative mb-5 block">
        <span className="sr-only">Buscar</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-dim" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por marca, modelo o año"
          className="h-12 w-full rounded-2xl border border-line bg-card pr-4 pl-11 focus:border-brand focus:outline-none"
        />
      </label>
      {error && (
        <p className="mb-4 rounded-xl bg-brand/15 px-4 py-3 text-sm text-brand-hi" role="alert">
          {error}
        </p>
      )}
      <ul className="space-y-3">
        {list.map((car) => (
          <Row key={car.id} car={car} onError={setError} />
        ))}
        {list.length === 0 && <li className="py-10 text-center text-mute">Sin resultados</li>}
      </ul>
    </div>
  );
}

function Row({ car, onError }: { car: Car; onError: (e: string) => void }) {
  const [pending, start] = useTransition();
  const [confirm, setConfirm] = useState(false);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    onError("");
    start(async () => {
      const res = await fn();
      if (!res.ok) onError(res.error ?? "Algo salió mal");
    });
  }

  return (
    <li
      className={`relative flex gap-3 rounded-2xl border border-line bg-card p-3 transition-opacity ${pending ? "opacity-60" : ""}`}
    >
      <Link href={`/admin/autos/${car.id}`} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-soft sm:size-24">
        {car.images[0] && (
          <Image src={car.images[0]} alt="" fill sizes="96px" quality={70} className="object-cover" />
        )}
        {car.featured && (
          <span className="absolute top-1 left-1 grid size-6 place-items-center rounded-full bg-volt text-night">
            <Star className="size-3.5 fill-current" />
          </span>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/admin/autos/${car.id}`} className="min-w-0">
            <p className="truncate font-semibold">
              {carName(car)} <span className="text-mute">{car.year}</span>
            </p>
            <p className="mt-0.5 text-sm text-mute">
              {formatPrice(car.price)} · {formatKm(car.mileage)} · {car.images.length} fotos
            </p>
          </Link>
          {pending && <Loader2 className="size-4 shrink-0 animate-spin text-mute" />}
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Estado</span>
            <select
              value={car.status}
              onChange={(e) => run(() => updateCarAction(car.id, { status: e.target.value as CarStatus }))}
              className={`h-9 appearance-none rounded-full border-0 px-3 pr-7 text-xs font-semibold ${STATUS_STYLE[car.status]}`}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-card text-fg">
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px] opacity-70">▼</span>
          </label>
          <button
            type="button"
            onClick={() => run(() => updateCarAction(car.id, { featured: !car.featured }))}
            className={`inline-flex h-9 items-center gap-1 rounded-full border px-3 text-xs font-medium ${
              car.featured ? "border-volt bg-volt text-night" : "border-line text-mute"
            }`}
            aria-pressed={car.featured}
          >
            <Star className={`size-3.5 ${car.featured ? "fill-current" : ""}`} />
            Destacado
          </button>
          <div className="ml-auto flex items-center gap-1">
            <Link
              href={`/autos/${car.slug}`}
              target="_blank"
              className="grid size-9 place-items-center rounded-full text-mute hover:bg-soft hover:text-fg"
              aria-label="Ver en el sitio"
            >
              <ExternalLink className="size-4" />
            </Link>
            <Link
              href={`/admin/autos/${car.id}`}
              className="grid size-9 place-items-center rounded-full text-mute hover:bg-soft hover:text-fg"
              aria-label="Editar"
            >
              <Pencil className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => setConfirm(true)}
              className="grid size-9 place-items-center rounded-full text-mute hover:bg-brand/15 hover:text-brand-hi"
              aria-label="Eliminar"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
      {confirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-between gap-3 rounded-2xl bg-soft/95 px-4 backdrop-blur-sm animate-fade">
          <p className="text-sm">
            ¿Eliminar <b>{car.model}</b> y sus fotos?
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setConfirm(false)} className="h-10 rounded-full border border-line px-4 text-sm">
              No
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirm(false);
                run(() => deleteCarAction(car.id));
              }}
              className="h-10 rounded-full bg-brand px-4 text-sm font-semibold text-white"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
