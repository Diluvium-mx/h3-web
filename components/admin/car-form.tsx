"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, ImagePlus, Loader2, Plus, Star, Trash2, X } from "lucide-react";
import { CarPreview } from "@/components/admin/car-preview";
import { saveCarAction, type CarInput } from "@/lib/actions";
import {
  BODY_TYPES,
  FUELS,
  INVOICES,
  SERVICE_HISTORY,
  STATUS_LABEL,
  STATUSES,
  TRANSMISSIONS,
  slugify,
  type Car,
  type CarStatus,
} from "@/lib/cars";
import { uploadPhoto } from "@/lib/upload-client";
import {
  EQUIPMENT,
  EQUIPMENT_GROUPS,
  PHOTO_SECTION_LABEL,
  PHOTO_SECTIONS,
  isPhotoSection,
  type PhotoSection,
} from "@/lib/equipment";

type Photo = { key: string; url?: string; preview?: string; progress: number; error?: string; section?: PhotoSection };

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
  "h-12 w-full rounded-md border border-line bg-paper px-4 text-fg placeholder:text-dim focus:border-fg/50 focus:bg-card focus:ring-4 focus:ring-fg/5 focus:outline-none";

function Section({
  step,
  title,
  hint,
  id,
  children,
}: {
  step?: number;
  title: string;
  hint?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 rounded-lg bg-card p-4 ring-1 ring-line sm:p-6">
      <h2 className="flex items-center gap-3 font-display text-xl">
        {step && (
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-night text-sm text-white">{step}</span>
        )}
        {title}
      </h2>
      {hint && <p className="mt-2 text-sm text-mute">{hint}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

// Lo opcional va plegado para que subir un auto sea rápido
function MoreDetails({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <details open={open} className="group rounded-lg bg-card ring-1 ring-line">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-6 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-display text-xl">Más detalles (opcional)</span>
          <span className="mt-1 block text-sm text-mute">
            Motor, color, documentos, equipamiento, video… Lo que no llenes no aparece en la página.
          </span>
        </span>
        <Plus className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
      </summary>
      <div className="space-y-4 border-t border-line p-4 sm:p-6">{children}</div>
    </details>
  );
}

function SubSection({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-4 border-b border-line pb-6 last:border-0 last:pb-0">
      <div>
        <h3 className="font-tech text-[11px] text-dim">{title}</h3>
        {hint && <p className="mt-1 text-sm text-mute">{hint}</p>}
      </div>
      {children}
    </div>
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
  labels,
}: {
  value?: T;
  options: readonly T[];
  onChange: (v?: T) => void;
  allowEmpty?: boolean;
  label: string;
  labels?: Record<T, string>;
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
            className={`h-10 rounded-md border px-4 text-sm font-medium transition-colors ${
              value === o ? "border-night bg-night text-white" : "border-line bg-paper text-fg/80 hover:border-fg/40"
            }`}
          >
            {labels?.[o] ?? o}
          </button>
        ))}
      </div>
    </div>
  );
}

const digits = (s: string) => s.replace(/\D/g, "");
// crypto.randomUUID solo existe con https o localhost; desde el celular en la red local (http) no está
const localId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
const withCommas = (s: string) => (s ? Number(s).toLocaleString("es-MX") : "");

export function CarForm({
  initial,
  uploadMode,
}: {
  initial?: Car;
  uploadMode: "cloudinary" | "local" | "none";
}) {
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
    video: initial?.video ?? "",
    equipment: initial?.equipment ?? [],
    ownerCount: initial?.ownerCount ? String(initial.ownerCount) : "",
    invoice: initial?.invoice,
    serviceHistory: initial?.serviceHistory,
    papersInOrder: initial?.papersInOrder ?? false,
    armorLevel: initial?.armorLevel ?? "",
    status: initial?.status ?? ("disponible" as CarStatus),
    featured: initial?.featured ?? false,
  });
  const [photos, setPhotos] = useState<Photo[]>(
    (initial?.images ?? []).map((url) => ({ key: url, url, progress: 100, section: initial?.photoSections?.[url] })),
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
  const coverUrl = photos.find((p) => p.url)?.url;
  // Lo indispensable para que el auto se vea completo en la página
  const missing = [
    !coverUrl && { label: "Fotos", target: "paso-fotos" },
    !v.brand.trim() && { label: "Marca", target: "paso-datos" },
    !v.model.trim() && { label: "Modelo", target: "paso-datos" },
    !v.year && { label: "Año", target: "paso-datos" },
    !v.price && { label: "Precio", target: "paso-datos" },
    !v.body && { label: "Tipo", target: "paso-datos" },
  ].filter(Boolean) as { label: string; target: string }[];

  async function addFiles(files: FileList | null) {
    if (!files?.length || uploadMode === "none") return;
    const base = slugify(`${v.brand} ${v.model} ${v.year}`) || "auto";
    const items = Array.from(files).map((file) => ({
      file,
      photo: { key: localId(), preview: URL.createObjectURL(file), progress: 0 } as Photo,
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
      video: v.video.trim() || undefined,
      equipment: v.equipment,
      ownerCount: v.ownerCount ? Number(v.ownerCount) : undefined,
      invoice: v.invoice,
      serviceHistory: v.serviceHistory,
      papersInOrder: v.papersInOrder,
      armorLevel: v.armored ? v.armorLevel.trim() || undefined : undefined,
      photoSections: Object.fromEntries(
        photos.flatMap((p) => (p.url && p.section ? [[p.url, p.section] as const] : [])),
      ),
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
      router.push(`/admin?${initial ? "guardado" : "publicado"}=${res.id}`);
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-8"
    >
      <div className="min-w-0 space-y-4">
      {error && (
        <p className="rounded-md border-l-2 border-brand bg-brand-soft px-4 py-3 text-sm text-brand-hi" role="alert">
          {error}
        </p>
      )}

      <Section
        step={1}
        id="paso-fotos"
        title="Fotos"
        hint="La primera es la portada (la que sale en el inicio y en el inventario): usa una del exterior, de frente o de lado. Ordénalas con las flechas y marca si cada una es del exterior o del interior. Se comprimen solas antes de subir."
      >
        {uploadMode === "none" ? (
          <p className="rounded-md bg-paper p-4 text-sm text-mute">
            Conecta Cloudinary para poder subir fotos (ver README).
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
              className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-line bg-paper px-4 py-8 text-center transition-colors hover:border-fg/40"
            >
              <ImagePlus className="size-8 text-brand" />
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
                className={`flex flex-col gap-1 ${dragIndex === i ? "opacity-40" : ""}`}
              >
                <div
                  className={`group relative aspect-[3/4] overflow-hidden rounded-md bg-soft ring-2 ${
                    i === 0 ? "ring-night" : "ring-transparent"
                  }`}
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
                      <span className="absolute inset-x-2 bottom-2 h-1 overflow-hidden bg-white/20">
                        <span className="block h-full bg-brand transition-all" style={{ width: `${Math.max(8, p.progress)}%` }} />
                      </span>
                    </div>
                  )}
                  {p.error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-paper/80 p-2 text-center text-[11px] text-brand-hi">
                      {p.error}
                      <button type="button" onClick={() => setPhotos((ps) => ps.filter((x) => x.key !== p.key))} className="rounded-md bg-soft px-3 py-1 text-fg">
                        Quitar
                      </button>
                    </div>
                  )}
                  {i === 0 && p.url && (
                    <span className="font-tech absolute top-1.5 left-1.5 rounded-sm bg-night px-2 py-0.5 text-[9px] text-white">Portada</span>
                  )}
                  {p.url && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotos((ps) => ps.filter((x) => x.key !== p.key));
                          setDirty(true);
                        }}
                        className="absolute top-1 right-1 grid size-7 place-items-center rounded-md bg-paper/85 text-brand-hi"
                        aria-label="Quitar foto"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                      <div className="absolute inset-x-1 bottom-1 flex items-center justify-between">
                        <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} className="grid size-7 place-items-center rounded-md bg-paper/85 disabled:opacity-30" aria-label="Mover a la izquierda">
                          <ArrowLeft className="size-3.5" />
                        </button>
                        {i !== 0 && (
                          <button type="button" onClick={() => move(i, 0)} className="grid size-7 place-items-center rounded-md bg-paper/85" aria-label="Usar como portada">
                            <Star className="size-3.5" />
                          </button>
                        )}
                        <button type="button" onClick={() => move(i, i + 1)} disabled={i === photos.length - 1} className="grid size-7 place-items-center rounded-md bg-paper/85 disabled:opacity-30" aria-label="Mover a la derecha">
                          <ArrowRight className="size-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {p.url && (
                  <select
                    value={p.section ?? ""}
                    onChange={(e) => {
                      const section = isPhotoSection(e.target.value) ? e.target.value : undefined;
                      setPhotos((ps) => ps.map((x) => (x.key === p.key ? { ...x, section } : x)));
                      setDirty(true);
                    }}
                    aria-label={`Sección de la foto ${i + 1}`}
                    className={`h-9 w-full rounded-md border px-1.5 text-xs font-medium ${
                      p.section ? "border-night bg-night text-white" : "border-line bg-paper text-mute"
                    }`}
                  >
                    <option value="">Sin sección</option>
                    {PHOTO_SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>
                        {PHOTO_SECTION_LABEL[sec]}
                      </option>
                    ))}
                  </select>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section step={2} id="paso-datos" title="Datos del auto">
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
          <Field label="Kilometraje" hint="Si no lo sabes, déjalo vacío (no se muestra)">
            <input className={field} value={withCommas(v.mileage)} onChange={(e) => set("mileage", digits(e.target.value).slice(0, 7))} inputMode="numeric" placeholder="45,000" />
          </Field>
        </div>
        <Pills label="Tipo" value={v.body} options={BODY_TYPES} onChange={(x) => set("body", x)} allowEmpty={false} />
        <Pills label="Transmisión" value={v.transmission} options={TRANSMISSIONS} onChange={(x) => set("transmission", x)} />
      </Section>

      <Section step={3} title="Descripción" hint="Cuéntalo como se lo contarías a un cliente.">
        <textarea
          className={`${field} h-auto min-h-40 py-3 leading-relaxed`}
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Estado, servicios, extras, por qué vale la pena…"
          maxLength={6000}
        />
        <p className="text-right text-xs text-dim">{v.description.length} / 6000</p>
      </Section>

      <MoreDetails open={Boolean(initial)}>
      <SubSection title="Características">
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
        <label className="flex items-center justify-between gap-4 rounded-md bg-paper p-4">
          <span>
            <span className="block font-medium">Blindado</span>
            <span className="text-sm text-mute">Aparece en la categoría «Blindados»</span>
          </span>
          <input type="checkbox" checked={v.armored} onChange={(e) => set("armored", e.target.checked)} className="size-6 accent-[var(--color-brand)]" />
        </label>
        {v.armored && (
          <Field label="Nivel de blindaje" hint="Opcional">
            <input className={field} value={v.armorLevel} onChange={(e) => set("armorLevel", e.target.value)} maxLength={60} placeholder="Ej. Nivel 3 Plus" />
          </Field>
        )}
      </SubSection>

      <SubSection title="Documentos e historial" hint="Lo que más pregunta quien compra.">
        <Field label="Número de dueños" hint="Opcional · 1 = único dueño">
          <input
            className={field}
            value={v.ownerCount}
            onChange={(e) => set("ownerCount", digits(e.target.value).slice(0, 2))}
            inputMode="numeric"
            placeholder="1"
          />
        </Field>
        <Pills label="Factura" value={v.invoice} options={INVOICES} onChange={(x) => set("invoice", x)} />
        <Pills label="Servicios" value={v.serviceHistory} options={SERVICE_HISTORY} onChange={(x) => set("serviceHistory", x)} />
        <label className="flex items-center justify-between gap-4 rounded-md bg-paper p-4">
          <span>
            <span className="block font-medium">Papeles en regla</span>
            <span className="text-sm text-mute">Márcalo solo si ya lo revisaste</span>
          </span>
          <input
            type="checkbox"
            checked={v.papersInOrder}
            onChange={(e) => set("papersInOrder", e.target.checked)}
            className="size-6 accent-[var(--color-brand)]"
          />
        </label>
      </SubSection>

      <SubSection title="Lo que destaca" hint="Frases cortas que aparecen en la ficha.">
        <div className="flex flex-wrap gap-2">
          {v.features.map((f) => (
            <span key={f} className="inline-flex items-center gap-1 rounded-md bg-night py-1.5 pr-1.5 pl-3 text-sm text-white">
              {f}
              <button type="button" onClick={() => set("features", v.features.filter((x) => x !== f))} className="grid size-6 place-items-center rounded-sm hover:bg-white/15" aria-label={`Quitar ${f}`}>
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
          <button type="button" onClick={() => addFeature(featureDraft)} className="grid size-12 shrink-0 place-items-center rounded-md bg-soft-2" aria-label="Agregar">
            <Plus className="size-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FEATURE_IDEAS.filter((f) => !v.features.includes(f)).map((f) => (
            <button key={f} type="button" onClick={() => addFeature(f)} className="rounded-md border border-dashed border-line px-3 py-1.5 text-xs text-mute hover:border-fg/40 hover:text-fg">
              + {f}
            </button>
          ))}
        </div>
      </SubSection>

      <SubSection title="Equipamiento" hint="Marca solo lo que tiene este auto. En la página se ve agrupado y con íconos.">
        {EQUIPMENT_GROUPS.map((group) => (
          <div key={group}>
            <span className="mb-1.5 block text-sm font-medium text-fg/90">{group}</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label={group}>
              {EQUIPMENT.filter((e) => e.group === group).map(({ key, label, Icon }) => {
                const on = v.equipment.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set("equipment", on ? v.equipment.filter((k) => k !== key) : [...v.equipment, key])}
                    className={`inline-flex h-10 items-center gap-1.5 rounded-md border px-3.5 text-sm font-medium transition-colors ${
                      on ? "border-night bg-night text-white" : "border-line bg-paper text-fg/80 hover:border-fg/40"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </SubSection>

      <SubSection title="Video" hint="Un recorrido del auto ayuda mucho a decidir. YouTube se ve dentro de la página; TikTok, Instagram y Facebook abren la red social.">
        <Field label="Enlace del video">
          <input
            className={field}
            type="url"
            inputMode="url"
            value={v.video}
            onChange={(e) => set("video", e.target.value)}
            placeholder="https://youtube.com/shorts/… o https://www.tiktok.com/@…"
          />
        </Field>
      </SubSection>
      </MoreDetails>

      <Section step={4} title="Publicar">
        <Pills
          label="Estado"
          value={v.status}
          options={STATUSES}
          labels={STATUS_LABEL}
          onChange={(x) => x && set("status", x)}
          allowEmpty={false}
        />
        <p className="-mt-2 text-xs text-dim">
          {STATUS_LABEL[v.status]}:{" "}
          {v.status === "vendido"
            ? "sale del inventario; su enlace dice «Vendido» y ofrece autos parecidos."
            : v.status === "apartado"
              ? "sigue visible con la etiqueta «Apartado»."
              : "visible en el catálogo."}
        </p>
        <label className="flex items-center justify-between gap-4 rounded-md bg-paper p-4">
          <span>
            <span className="block font-medium">Destacado</span>
            <span className="text-sm text-mute">Sale primero en el inicio y puede salir en las fotos de arriba</span>
          </span>
          <input type="checkbox" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} className="size-6 accent-[var(--color-brand)]" />
        </label>
      </Section>

      </div>

      {/* Vista previa y dónde va a aparecer (en computadora queda fija a la derecha) */}
      <aside className="mt-4 lg:sticky lg:top-6 lg:mt-0">
        <CarPreview
          values={{
            brand: v.brand,
            model: v.model,
            version: v.version,
            year: v.year,
            price: v.price,
            mileage: v.mileage,
            transmission: v.transmission,
            fuel: v.fuel,
            body: v.body,
            armored: v.armored,
            status: v.status,
            featured: v.featured,
            cover: coverUrl,
          }}
        />
      </aside>

      <div className="sticky bottom-0 z-30 -mx-4 border-t border-line bg-paper/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:col-span-2 lg:mx-0 lg:mt-4 lg:rounded-t-lg">
        {/* Qué falta para publicar: cada dato lleva a su sección */}
        <p className="mb-2.5 flex flex-wrap items-center gap-1.5 text-xs" aria-live="polite">
          {missing.length > 0 ? (
            <>
              <span className="text-mute">Falta:</span>
              {missing.map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => document.getElementById(m.target)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="rounded-sm bg-brand-soft px-2 py-1 font-semibold text-brand-hi"
                >
                  {m.label}
                </button>
              ))}
            </>
          ) : (
            <span className="flex items-center gap-1.5 font-semibold text-wa-dark">
              <Check className="size-3.5" strokeWidth={3} /> Todo listo para {initial ? "guardar" : "publicar"}
            </span>
          )}
        </p>
        <div className="flex gap-3">
          <Link href="/admin" className="btn btn-outline h-14">
            Cancelar
          </Link>
          <button type="submit" disabled={saving || uploading} className="btn btn-dark btn-shine h-14 flex-1 disabled:opacity-60">
            {(saving || uploading) && <Loader2 className="size-5 animate-spin" />}
            {uploading ? "Subiendo fotos…" : saving ? "Guardando…" : initial ? "Guardar cambios" : "Publicar auto"}
          </button>
        </div>
      </div>
    </form>
  );
}
