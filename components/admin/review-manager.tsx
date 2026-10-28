"use client";

import Image from "next/image";
import { useRef, useState, useTransition, type ReactNode } from "react";
import { ImagePlus, Loader2, Plus, Star, Trash2, X } from "lucide-react";
import { deleteReviewAction, saveReviewAction } from "@/lib/actions";
import { REVIEW_SOURCES, type Review, type ReviewSource } from "@/lib/reviews";
import { uploadPhoto } from "@/lib/upload-client";

const field =
  "h-12 w-full rounded-xl border border-line bg-soft px-4 text-fg placeholder:text-dim focus:border-brand focus:outline-none";

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

const EMPTY = { name: "", text: "", highlight: "", car: "", stars: 5, source: undefined as ReviewSource | undefined };

export function ReviewManager({
  initial,
  uploadMode,
}: {
  initial: Review[];
  uploadMode: "cloudinary" | "local" | "none";
}) {
  const [reviews, setReviews] = useState(initial);
  const [open, setOpen] = useState(initial.length === 0);
  const [v, setV] = useState(EMPTY);
  const [photo, setPhoto] = useState<{ url?: string; preview: string; progress: number } | null>(null);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);
  const set = <K extends keyof typeof v>(k: K, value: (typeof v)[K]) => setV((p) => ({ ...p, [k]: value }));

  async function pickPhoto(file?: File) {
    if (!file || uploadMode === "none") return;
    const preview = URL.createObjectURL(file);
    setPhoto({ preview, progress: 0 });
    try {
      const url = await uploadPhoto(file, "resena", uploadMode, (pct) =>
        setPhoto((p) => (p ? { ...p, progress: pct } : p)),
      );
      setPhoto({ url, preview, progress: 100 });
    } catch (e) {
      setPhoto(null);
      setError(e instanceof Error ? e.message : "No se pudo subir la foto");
    }
  }

  function save() {
    setError("");
    if (photo && !photo.url) return setError("Espera a que termine de subir la foto.");
    startSaving(async () => {
      const res = await saveReviewAction({ ...v, photo: photo?.url });
      if (!res.ok) return setError(res.error);
      setReviews((list) => [res.review, ...list]);
      setV(EMPTY);
      setPhoto(null);
      setOpen(false);
    });
  }

  function remove(id: string) {
    startSaving(async () => {
      const res = await deleteReviewAction(id);
      if (!res.ok) return setError(res.error);
      setReviews((list) => list.filter((r) => r.id !== id));
      setConfirm(null);
    });
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl bg-volt-soft p-4 text-sm leading-relaxed text-fg/85 ring-1 ring-volt/60">
        Publica solo reseñas <b>reales</b> y con <b>permiso del cliente</b>, sobre todo si pones su foto o su
        nombre completo. Puedes copiarlas de Google, Facebook o de un mensaje de WhatsApp.
      </div>

      {open ? (
        <section className="rounded-3xl border border-line bg-card p-4 sm:p-6" aria-label="Nueva reseña">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Nueva reseña</h2>
            {reviews.length > 0 && (
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="text-mute">
                <X className="size-5" />
              </button>
            )}
          </div>
          <div className="mt-5 space-y-4">
            <Field label="Nombre del cliente">
              <input className={field} value={v.name} onChange={(e) => set("name", e.target.value)} placeholder="Ej. Carlos M." />
            </Field>
            <Field label="Auto que compró" hint="Opcional">
              <input className={field} value={v.car} onChange={(e) => set("car", e.target.value)} placeholder="Ej. BMW M3 2018" />
            </Field>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-fg/90">Calificación</span>
              <div className="flex gap-1" role="radiogroup" aria-label="Calificación">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={v.stars === n}
                    aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
                    onClick={() => set("stars", n)}
                    className="grid size-11 place-items-center rounded-xl bg-soft"
                  >
                    <Star className={`size-6 ${n <= v.stars ? "fill-volt text-volt" : "text-dim"}`} />
                  </button>
                ))}
              </div>
            </div>
            <Field label="Lo que dijo" hint={`${v.text.length}/700`}>
              <textarea
                className={`${field} h-32 py-3`}
                maxLength={700}
                value={v.text}
                onChange={(e) => set("text", e.target.value)}
                placeholder="Copia aquí su reseña tal cual."
              />
            </Field>
            <Field label="Frase destacada" hint="Opcional · se ve grande">
              <input
                className={field}
                maxLength={90}
                value={v.highlight}
                onChange={(e) => set("highlight", e.target.value)}
                placeholder="Una frase corta tomada de su reseña"
              />
            </Field>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-fg/90">¿Dónde la dejó?</span>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Origen">
                {REVIEW_SOURCES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={v.source === s}
                    onClick={() => set("source", v.source === s ? undefined : s)}
                    className={`h-10 rounded-full border px-4 text-sm font-medium transition-colors ${
                      v.source === s ? "border-brand bg-brand text-white" : "border-line bg-soft text-fg/80"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {uploadMode !== "none" && (
              <div>
                <span className="mb-1.5 block text-sm font-medium text-fg/90">Foto (opcional)</span>
                <p className="mb-2 text-xs text-dim">Por ejemplo, la entrega del auto. Ayuda mucho a que la gente confíe.</p>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => pickPhoto(e.target.files?.[0])}
                />
                {photo ? (
                  <div className="relative size-28 overflow-hidden rounded-2xl bg-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local */}
                    <img src={photo.preview} alt="" className="size-full object-cover" />
                    {!photo.url && (
                      <span className="absolute inset-0 grid place-items-center bg-night/50 text-xs font-semibold text-white">
                        {Math.round(photo.progress)}%
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      aria-label="Quitar foto"
                      className="absolute top-1 right-1 grid size-7 place-items-center rounded-full bg-night/70 text-white"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="flex h-12 items-center gap-2 rounded-xl border border-dashed border-line px-4 text-sm font-medium text-fg/80"
                  >
                    <ImagePlus className="size-5 text-brand" /> Agregar foto
                  </button>
                )}
              </div>
            )}
            {error && <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-hi">{error}</p>}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="btn-shine flex h-14 w-full items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white disabled:opacity-60"
            >
              {saving && <Loader2 className="size-5 animate-spin" />} Publicar reseña
            </button>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-line bg-card font-semibold"
        >
          <Plus className="size-5" /> Agregar reseña
        </button>
      )}

      {!open && error && <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-hi">{error}</p>}

      <ul className="space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className="flex gap-3 rounded-2xl border border-line bg-card p-4">
            {r.photo && (
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-soft">
                <Image src={r.photo} alt="" fill sizes="64px" className="object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-volt" aria-label={`${r.stars} de 5 estrellas`}>
                {Array.from({ length: r.stars }, (_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </p>
              <p className="mt-1 font-semibold">
                {r.name}
                {r.car && <span className="font-normal text-mute"> · {r.car}</span>}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-mute">{r.highlight || r.text}</p>
            </div>
            {confirm === r.id ? (
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  disabled={saving}
                  className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Eliminar
                </button>
                <button type="button" onClick={() => setConfirm(null)} className="text-xs text-mute">
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirm(r.id)}
                aria-label="Eliminar"
                className="grid size-10 shrink-0 place-items-center rounded-full text-mute hover:bg-soft hover:text-brand-hi"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
