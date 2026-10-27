"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Plus, Star, Trash2, X } from "lucide-react";
import { saveCarAction, type CarInput } from "@/lib/actions";
import {
  BODY_TYPES,
  FUELS,
  STATUS_LABEL,
  STATUSES,
  TRANSMISSIONS,
  slugify,
  type Car,
  type CarStatus,
} from "@/lib/cars";
import { uploadPhoto } from "@/lib/upload-client";

type Photo = { key: string; url?: string; preview?: string; progress: number; error?: string };

const BRANDS = [
  "Audi", "BMW", "Cadillac", "Chevrolet", "Dodge", "FIAT", "Ford", "GMC", "Honda", "Hyundai", "Jeep",
  "Kia", "Land Rover", "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "MINI", "Mitsubishi", "Nissan",
  "Porsche", "RAM", "Range Rover", "SEAT", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo",
];

const FEATURE_IDEAS = [
  "Único dueño", "Factura original", "Servicios de agencia", "Bajo kilometraje", "Quemacocos",
  "Asientos de piel", "CarPlay / Android Auto", "Cámara de reversa", "Sensores", "Rines deportivos",
  "PPF", "Wrap", "Escape deportivo", "Garantía vigente", "Tenencias al corriente",
];

const field =
  "h-12 w-full rounded-xl border border-line bg-soft px-4 text-fg placeholder:text-dim focus:border-brand focus:outline-none";

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-card p-4 sm:p-6">
      <h2 className="font-display text-xl">{title}</h2>
      {hint && <p className="mt-1 text-sm text-mute">{hint}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex justify-between text-sm font-medium text-fg/90">
        {label}
        {hint && <span className="text-xs font-normal text-dim">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Pills<T extends string>({
  value,
  options,
  onChange,
  allowEmpty = true,
  label,
}: {
  value?: T;
  options: readonly T[];
  onChange: (v?: T) => void;
  allowEmpty?: boolean;
  label: string;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-fg/90">{label}</span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={value === o}
            onClick={() => onChange(value === o && allowEmpty ? undefined : o)}
            className={`h-10 rounded-full border px-4 text-sm font-medium transition-colors ${
              value === o ? "border-brand bg-brand text-white" : "border-line bg-soft text-fg/80"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

const digits = (s: string) => s.replace(/\D/g, "");
const withCommas = (s: string) => (s ? Number(s).toLocaleString("es-MX") : "");

export function CarForm({ initial, uploadMode }: { initial?: Car; uploadMode: "blob" | "local" | "none" }) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [v, setV] = useState({
    brand: initial?.brand ?? "",
    model: initial?.model ?? "",
    version: initial?.version ?? "",
    year: initial ? String(initial.year) : "",
    price: initial ? String(initial.price) : "",
    mileage: initial?.mileage != null ? String(initial.mileage) : "",
    transmission: initial?.transmission,
    fuel: initial?.fuel ?? ("Gasolina" as Car["fuel"]),
    body: initial?.body,
    engine: initial?.engine ?? "",
    drivetrain: initial?.drivetrain ?? "",
    color: initial?.color ?? "",
    doors: initial?.doors ? String(initial.doors) : "",
    armored: initial?.armored ?? false,
    features: initial?.features ?? [],
    description: initial?.description ?? "",
    status: initial?.status ?? ("disponible" as CarStatus),
    featured: initial?.featured ?? false,
  });
  const [photos, setPhotos] = useState<Photo[]>(
    (initial?.images ?? []).map((url) => ({ key: url, url, progress: 100 })),
  );
  const [featureDraft, setFeatureDraft] = useState("");

  const set = <K extends keyof typeof v>(k: K, value: (typeof v)[K]) => {
    setV((p) => ({ ...p, [k]: value }));
    setDirty(true);
  };

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const uploading = photos.some((p) => !p.url && !p.error);

  async function addFiles(files: FileList | null) {
    if (!files?.length || uploadMode === "none") return;
    const base = slugify(`${v.brand} ${v.model} ${v.year}`) || "auto";
    const items = Array.from(files).map((file) => ({
      file,
      photo: { key: crypto.randomUUID(), preview: URL.createObjectURL(file), progress: 0 } as Photo,
    }));
    setPhotos((p) => [...p, ...items.map((i) => i.photo)]);
    setDirty(true);
    const update = (key: string, patch: Partial<Photo>) =>
      setPhotos((p) => p.map((ph) => (ph.key === key ? { ...ph, ...patch } : ph)));
    let next = 0;
    const worker = async () => {
      while (next < items.length) {
        const { file, photo } = items[next++];
        try {
          const url = await uploadPhoto(file, base, uploadMode, (pct) => update(photo.key, { progress: pct }));
          update(photo.key, { url, progress: 100 });
        } catch (e) {
          update(photo.key, { error: e instanceof Error ? e.message : "Error al subir" });
        }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= photos.length || from === to) return;
    setPhotos((p) => {
      const copy = [...p];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
    setDirty(true);
  }

  function addFeature(text: string) {
    const t = text.trim();
    if (!t || v.features.includes(t)) return;
    set("features", [...v.features, t]);
    setFeatureDraft("");
  }

  function save() {
    setError("");
    if (!v.body) {
      setError("Elige el tipo de auto.");
      return;
    }
    const input: CarInput = {
      id: initial?.id,
      brand: v.brand,
      model: v.model,
      version: v.version,
      year: Number(v.year),
      price: Number(v.price),
      mileage: v.mileage === "" ? undefined : Number(v.mileage),
      transmission: v.transmission,
      fuel: v.fuel,
      body: v.body,
      engine: v.engine,
      drivetrain: v.drivetrain,
      color: v.color,
      doors: v.doors ? Number(v.doors) : undefined,
      armored: v.armored,
      features: v.features,
      description: v.description,
      images: photos.filter((p) => p.url).map((p) => p.url!),
      status: v.status,
      featured: v.featured,
    };
    startSaving(async () => {
      const res = await saveCarAction(input);
      if (!res.ok) {
        setError(res.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setDirty(false);
      router.push("/admin");
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="space-y-4"
    >
      {error && (
        <p className="rounded-2xl bg-brand/15 px-4 py-3 text-sm text-brand-hi" role="alert">
          {error}
        </p>
      )}

      <Section title="Fotos" hint="La primera es la portada. Se comprimen solas antes de subir.">
        {uploadMode === "none" ? (
          <p className="rounded-xl bg-soft p-4 text-sm text-mute">
            Conecta Vercel Blob para poder subir fotos (ver README).
          </p>
        ) : (
          <>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
              className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line bg-soft/50 px-4 py-8 text-center transition-colors hover:border-brand/60"
            >
              <ImagePlus className="size-8 text-brand-hi" />
              <span className="font-semibold">Agregar fotos</span>
              <span className="text-xs text-mute">Desde tu galería o cámara · puedes elegir varias</span>
            </button>
          </>
        )}
        {photos.length > 0 && (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {photos.map((p, i) => (
              <li
                key={p.key}
                draggable={Boolean(p.url)}
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) move(dragIndex, i);
                  setDragIndex(null);
                }}
                className={`group relative aspect-[3/4] overflow-hidden rounded-xl bg-soft ring-2 ${
                  i === 0 ? "ring-brand" : "ring-transparent"
                } ${dragIndex === i ? "opacity-40" : ""}`}
              >
                {p.url ? (
                  <Image src={p.url} alt="" fill sizes="200px" quality={70} className="object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  p.preview && <img src={p.preview} alt="" className="absolute inset-0 size-full object-cover opacity-50" />
                )}
                {!p.url && !p.error && (
                  <div className="absolute inset-0 grid place-items-center">
                    <Loader2 className="size-6 animate-spin" />
                    <span className="absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full bg-white/20">
                      <span className="block h-full bg-brand transition-all" style={{ width: `${Math.max(8, p.progress)}%` }} />
                    </span>
                  </div>
                )}
                {p.error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-paper/80 p-2 text-center text-[11px] text-brand-hi">
                    {p.error}
                    <button type="button" onClick={() => setPhotos((ps) => ps.filter((x) => x.key !== p.key))} className="rounded-full bg-soft px-3 py-1 text-fg">
                      Quitar
                    </button>
                  </div>
                )}
                {i === 0 && p.url && (
                  <span className="font-tech absolute top-1.5 left-1.5 rounded-full bg-brand px-2 py-0.5 text-[9px] text-white">Portada</span>
                )}
                {p.url && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotos((ps) => ps.filter((x) => x.key !== p.key));
                        setDirty(true);
                      }}
                      className="absolute top-1 right-1 grid size-7 place-items-center rounded-full bg-paper/80 text-brand-hi"
                      aria-label="Quitar foto"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                    <div className="absolute inset-x-1 bottom-1 flex items-center justify-between">
                      <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="grid size-7 place-items-center rounded-full bg-paper/80 disabled:opacity-30" aria-label="Mover a la izquierda">
                        <ArrowLeft className="size-3.5" />
                      </button>
                      {i !== 0 && (
                        <button type="button" onClick={() => move(i, 0)} className="grid size-7 place-items-center rounded-full bg-paper/80" aria-label="Usar como portada">
                          <Star className="size-3.5" />
                        </button>
                      )}
                      <button type="button" onClick={() => move(i, i + 1)} disabled={i === photos.length - 1} className="grid size-7 place-items-center rounded-full bg-paper/80 disabled:opacity-30" aria-label="Mover a la derecha">
                        <ArrowRight className="size-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Datos principales">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Marca">
            <input className={field} value={v.brand} onChange={(e) => set("brand", e.target.value)} list="brands" placeholder="Ej. BMW" required />
            <datalist id="brands">
              {BRANDS.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </Field>
          <Field label="Modelo">
            <input className={field} value={v.model} onChange={(e) => set("model", e.target.value)} placeholder="Ej. M3" required />
          </Field>
          <Field label="Versión" hint="Opcional">
            <input className={field} value={v.version} onChange={(e) => set("version", e.target.value)} placeholder="Ej. Competition" />
          </Field>
          <Field label="Año">
            <input className={field} value={v.year} onChange={(e) => set("year", digits(e.target.value).slice(0, 4))} inputMode="numeric" placeholder="2021" required />
          </Field>
          <Field label="Precio (MXN)">
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mute">$</span>
              <input className={`${field} pl-8`} value={withCommas(v.price)} onChange={(e) => set("price", digits(e.target.value).slice(0, 9))} inputMode="numeric" placeholder="650,000" required />
            </div>
          </Field>
          <Field label="Kilometraje" hint="Vacío = «Pregúntanos» por WhatsApp">
            <input className={field} value={withCommas(v.mileage)} onChange={(e) => set("mileage", digits(e.target.value).slice(0, 7))} inputMode="numeric" placeholder="45,000" />
          </Field>
        </div>
      </Section>

      <Section title="Características">
        <Pills label="Tipo" value={v.body} options={BODY_TYPES} onChange={(x) => set("body", x)} allowEmpty={false} />
        <Pills label="Transmisión" value={v.transmission} options={TRANSMISSIONS} onChange={(x) => set("transmission", x)} />
        <Pills label="Combustible" value={v.fuel} options={FUELS} onChange={(x) => set("fuel", x)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Motor" hint="Opcional">
            <input className={field} value={v.engine} onChange={(e) => set("engine", e.target.value)} placeholder="Ej. 3.0L 6 cil. Turbo" />
          </Field>
          <Field label="Tracción" hint="Opcional">
            <input className={field} value={v.drivetrain} onChange={(e) => set("drivetrain", e.target.value)} placeholder="Ej. 4x4, AWD" />
          </Field>
          <Field label="Color" hint="Opcional">
            <input className={field} value={v.color} onChange={(e) => set("color", e.target.value)} placeholder="Ej. Blanco perla" />
          </Field>
          <Field label="Puertas" hint="Opcional">
            <input className={field} value={v.doors} onChange={(e) => set("doors", digits(e.target.value).slice(0, 1))} inputMode="numeric" placeholder="4" />
          </Field>
        </div>
        <label className="flex items-center justify-between gap-4 rounded-xl bg-soft p-4">
          <span>
            <span className="block font-medium">Blindado</span>
            <span className="text-sm text-mute">Aparece en la categoría «Blindados»</span>
          </span>
          <input type="checkbox" checked={v.armored} onChange={(e) => set("armored", e.target.checked)} className="size-6 accent-[var(--color-brand)]" />
        </label>
      </Section>

      <Section title="Lo que destaca" hint="Frases cortas que aparecen como etiquetas.">
        <div className="flex flex-wrap gap-2">
          {v.features.map((f) => (
            <span key={f} className="inline-flex items-center gap-1 rounded-full bg-brand/15 py-1.5 pr-1.5 pl-3 text-sm text-fg">
              {f}
              <button type="button" onClick={() => set("features", v.features.filter((x) => x !== f))} className="grid size-6 place-items-center rounded-full hover:bg-brand/30" aria-label={`Quitar ${f}`}>
                <X className="size-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className={field}
            value={featureDraft}
            onChange={(e) => setFeatureDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature(featureDraft);
              }
            }}
            placeholder="Ej. Escape modificado"
            maxLength={60}
          />
          <button type="button" onClick={() => addFeature(featureDraft)} className="grid size-12 shrink-0 place-items-center rounded-xl bg-soft-2" aria-label="Agregar">
            <Plus className="size-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FEATURE_IDEAS.filter((f) => !v.features.includes(f)).map((f) => (
            <button key={f} type="button" onClick={() => addFeature(f)} className="rounded-full border border-dashed border-line px-3 py-1.5 text-xs text-mute hover:border-fg/40 hover:text-fg">
              + {f}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Descripción">
        <textarea
          className={`${field} h-auto min-h-48 py-3 leading-relaxed`}
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Cuenta la historia del auto: estado, servicios, extras, por qué vale la pena…"
          maxLength={6000}
        />
        <p className="text-right text-xs text-dim">{v.description.length} / 6000</p>
      </Section>

      <Section title="Publicación">
        <Pills
          label="Estado"
          value={v.status}
          options={STATUSES}
          onChange={(x) => x && set("status", x)}
          allowEmpty={false}
        />
        <p className="-mt-2 text-xs text-dim">
          {STATUS_LABEL[v.status]}:{" "}
          {v.status === "vendido"
            ? "se oculta del catálogo y aparece en «Recién vendidos»."
            : v.status === "apartado"
              ? "sigue visible con la etiqueta «Apartado»."
              : "visible en el catálogo."}
        </p>
        <label className="flex items-center justify-between gap-4 rounded-xl bg-soft p-4">
          <span>
            <span className="block font-medium">Destacado</span>
            <span className="text-sm text-mute">Aparece primero en el inicio</span>
          </span>
          <input type="checkbox" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} className="size-6 accent-[var(--color-brand)]" />
        </label>
      </Section>

      <div className="sticky bottom-0 z-30 -mx-4 border-t border-line bg-paper/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
        <div className="flex gap-3">
          <Link href="/admin" className="inline-flex h-14 items-center rounded-full border border-line px-5 font-medium">
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving || uploading}
            className="btn-shine flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white disabled:opacity-60"
          >
            {(saving || uploading) && <Loader2 className="size-5 animate-spin" />}
            {uploading ? "Subiendo fotos…" : saving ? "Guardando…" : initial ? "Guardar cambios" : "Publicar auto"}
          </button>
        </div>
      </div>
    </form>
  );
}
