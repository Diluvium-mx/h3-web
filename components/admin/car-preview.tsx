"use client";

import { Check, Eye, Info } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { TYPE_LABEL } from "@/components/category-tile";
import type { Car, CarStatus } from "@/lib/cars";

export type PreviewValues = {
  brand: string;
  model: string;
  version: string;
  year: string;
  price: string;
  mileage: string;
  transmission?: Car["transmission"];
  fuel?: Car["fuel"];
  body?: Car["body"];
  armored: boolean;
  status: CarStatus;
  featured: boolean;
  cover?: string;
};

// Lo que el dueño necesita saber antes de publicar: cómo se verá la tarjeta y en qué partes de la página
// va a salir el auto (todo se acomoda solo con estos datos).
export function CarPreview({ values }: { values: PreviewValues }) {
  const v = values;
  const car: Car = {
    id: "vista-previa",
    slug: "vista-previa",
    brand: v.brand || "Marca",
    model: v.model || "Modelo",
    version: v.version || undefined,
    year: Number(v.year) || new Date().getFullYear(),
    price: Number(v.price) || 0,
    mileage: v.mileage === "" ? undefined : Number(v.mileage),
    transmission: v.transmission,
    fuel: v.fuel,
    body: v.body ?? "SUV",
    armored: v.armored,
    features: [],
    description: "",
    images: v.cover ? [v.cover] : [],
    status: v.status,
    featured: v.featured,
    createdAt: "",
    updatedAt: "",
  } as Car;

  const where: { ok: boolean; text: string }[] = [];
  if (v.status === "vendido") {
    where.push({ ok: false, text: "Ya no sale en el inventario ni en el inicio." });
    where.push({ ok: true, text: "Su enlace sigue abierto: dice «Vendido» y ofrece autos parecidos." });
  } else {
    where.push({ ok: true, text: "Inventario y búsqueda." });
    if (v.body) {
      const types = [TYPE_LABEL[v.body] ?? v.body, ...(v.armored ? ["Blindados"] : [])];
      where.push({ ok: true, text: `Categoría ${types.map((t) => `«${t}»`).join(" y ")}.` });
    }
    where.push(
      v.featured
        ? { ok: true, text: "Destacado: sale primero en el inicio y puede salir en las fotos de arriba." }
        : { ok: true, text: "Inicio: entre los autos más recientes. Márcalo como destacado para que salga primero." },
    );
    if (v.status === "apartado") where.push({ ok: true, text: "Se ve con la etiqueta «Apartado»." });
    if (!v.cover) where.push({ ok: false, text: "Sin fotos todavía: agrega al menos una (la primera es la portada)." });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-card p-4 ring-1 ring-line sm:p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Eye className="size-4 text-brand" /> Así se verá en la página
        </p>
        <div className="pointer-events-none mx-auto max-w-[17rem] select-none" aria-hidden="true">
          <CarCard car={car} sizes="272px" />
        </div>
      </div>
      <div className="rounded-lg bg-card p-4 ring-1 ring-line sm:p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Info className="size-4 text-brand" /> Dónde va a aparecer
        </p>
        <ul className="space-y-2.5 text-sm">
          {where.map(({ ok, text }) => (
            <li key={text} className="flex gap-2.5">
              <span
                className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${ok ? "bg-ok text-white" : "bg-soft-2 text-mute"}`}
                aria-hidden="true"
              >
                {ok ? <Check className="size-3" strokeWidth={3} /> : <span className="text-[11px] font-bold">!</span>}
              </span>
              <span className={ok ? "text-fg" : "text-mute"}>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
