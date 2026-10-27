"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Camera } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { site, whatsappUrl } from "@/lib/site";

type Data = {
  marca: string;
  modelo: string;
  version: string;
  anio: string;
  km: string;
  transmision: string;
  estado: string;
  factura: string;
  duenos: string;
  nombre: string;
  precio: string;
  comentarios: string;
};

const INITIAL: Data = {
  marca: "",
  modelo: "",
  version: "",
  anio: "",
  km: "",
  transmision: "",
  estado: "",
  factura: "",
  duenos: "",
  nombre: "",
  precio: "",
  comentarios: "",
};

const STORAGE_KEY = "h3-vende-borrador";
const STEPS = ["Tu auto", "Detalles", "Contacto"];

const field =
  "h-13 w-full rounded-2xl border border-line bg-soft px-4 text-fg placeholder:text-dim transition-colors focus:border-brand focus:outline-none";

function Options({
  value,
  onChange,
  options,
  name,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  name: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(value === o ? "" : o)}
          className={`h-11 rounded-full border px-4 text-sm font-medium transition-all duration-300 active:scale-95 ${
            value === o ? "border-brand bg-brand text-white" : "border-line bg-soft text-fg/80 hover:border-fg/30"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <span className="mb-2 flex items-baseline justify-between gap-2 text-sm font-medium text-fg/90">
      {children}
      {hint && <span className="text-xs font-normal text-dim">{hint}</span>}
    </span>
  );
}

export function SellForm() {
  const [d, setD] = useState<Data>(INITIAL);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Se restaura después de hidratar para que el HTML del servidor coincida
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setD({ ...INITIAL, ...JSON.parse(saved) });
    } catch {
      // sin almacenamiento disponible
    }
  }, []);

  // Guarda el borrador en cada cambio del usuario (no en efectos, para no pisar lo restaurado)
  const set = (k: keyof Data) => (v: string) =>
    setD((p) => {
      const next = { ...p, [k]: v };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // sin almacenamiento disponible
      }
      return next;
    });

  function validate(s: number) {
    if (s === 0) {
      if (!d.marca.trim() || !d.modelo.trim()) return "Escribe la marca y el modelo.";
      const y = Number(d.anio);
      if (!y || y < 1970 || y > new Date().getFullYear() + 1) return "Escribe un año válido.";
    }
    if (s === 1 && !d.km.trim()) return "Escribe el kilometraje aproximado.";
    if (s === 2 && !d.nombre.trim()) return "¿Cómo te llamas?";
    return "";
  }

  function next() {
    const e = validate(step);
    setError(e);
    if (!e) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function message() {
    const lines = [
      `Hola ${site.name} 👋 Quiero vender mi auto:`,
      "",
      `🚗 *${d.marca} ${d.modelo}${d.version ? ` ${d.version}` : ""} ${d.anio}*`,
      `📏 Kilometraje: ${d.km} km`,
      d.transmision ? `⚙️ Transmisión: ${d.transmision}` : null,
      d.estado ? `✨ Estado: ${d.estado}` : null,
      d.factura ? `📄 Factura: ${d.factura}` : null,
      d.duenos ? `👤 Dueños: ${d.duenos}` : null,
      d.precio ? `💰 Precio esperado: $${d.precio}` : null,
      d.comentarios ? `📝 ${d.comentarios}` : null,
      "",
      `Soy ${d.nombre}. Les envío fotos por aquí 📸`,
    ];
    return lines.filter((l) => l !== null).join("\n");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    for (let s = 0; s < STEPS.length; s++) {
      const err = validate(s);
      if (err) {
        setStep(s);
        setError(err);
        return;
      }
    }
    window.open(whatsappUrl(message()), "_blank", "noopener");
  }

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-line bg-card p-5 sm:p-8" noValidate>
      {/* Progreso */}
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Pasos">
        {STEPS.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className="w-full text-left"
              aria-current={i === step ? "step" : undefined}
            >
              <span className="block h-1.5 overflow-hidden rounded-full bg-soft-2">
                <span
                  className={`block h-full origin-left bg-brand transition-transform duration-700 ease-[var(--ease-out-expo)] ${
                    i <= step ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </span>
              <span className={`font-tech mt-2 block text-[10px] ${i <= step ? "text-fg" : "text-dim"}`}>
                0{i + 1} · {label}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div key={step} className="animate-rise space-y-5">
        {step === 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <Label>Marca</Label>
                <input className={field} value={d.marca} onChange={(e) => set("marca")(e.target.value)} placeholder="Ej. BMW" autoComplete="off" />
              </label>
              <label className="block">
                <Label>Modelo</Label>
                <input className={field} value={d.modelo} onChange={(e) => set("modelo")(e.target.value)} placeholder="Ej. Serie 3" autoComplete="off" />
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <Label>Año</Label>
                <input className={field} value={d.anio} onChange={(e) => set("anio")(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" placeholder="Ej. 2021" />
              </label>
              <label className="block">
                <Label hint="Opcional">Versión</Label>
                <input className={field} value={d.version} onChange={(e) => set("version")(e.target.value)} placeholder="Ej. M Sport" autoComplete="off" />
              </label>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <label className="block">
              <Label>Kilometraje</Label>
              <input
                className={field}
                value={d.km}
                onChange={(e) => {
                  const n = e.target.value.replace(/\D/g, "").slice(0, 7);
                  set("km")(n ? Number(n).toLocaleString("es-MX") : "");
                }}
                inputMode="numeric"
                placeholder="Ej. 45,000"
              />
            </label>
            <div>
              <Label>Transmisión</Label>
              <Options name="Transmisión" value={d.transmision} onChange={set("transmision")} options={["Automática", "Manual"]} />
            </div>
            <div>
              <Label>Estado general</Label>
              <Options name="Estado" value={d.estado} onChange={set("estado")} options={["Excelente", "Muy bueno", "Bueno", "Necesita detalles"]} />
            </div>
            <div>
              <Label>Factura</Label>
              <Options name="Factura" value={d.factura} onChange={set("factura")} options={["Original", "Refacturado", "De empresa", "De aseguradora"]} />
            </div>
            <div>
              <Label>Número de dueños</Label>
              <Options name="Dueños" value={d.duenos} onChange={set("duenos")} options={["1", "2", "3 o más"]} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block">
              <Label>Tu nombre</Label>
              <input className={field} value={d.nombre} onChange={(e) => set("nombre")(e.target.value)} placeholder="¿Cómo te llamas?" autoComplete="given-name" />
            </label>
            <label className="block">
              <Label hint="Opcional">¿Cuánto esperas recibir?</Label>
              <input
                className={field}
                value={d.precio}
                onChange={(e) => {
                  const n = e.target.value.replace(/\D/g, "").slice(0, 9);
                  set("precio")(n ? Number(n).toLocaleString("es-MX") : "");
                }}
                inputMode="numeric"
                placeholder="Ej. 350,000"
              />
            </label>
            <label className="block">
              <Label hint="Opcional">Comentarios</Label>
              <textarea
                className={`${field} h-auto min-h-24 py-3`}
                value={d.comentarios}
                onChange={(e) => set("comentarios")(e.target.value.slice(0, 400))}
                placeholder="Servicios, modificaciones, detalles…"
                rows={3}
              />
            </label>
            <p className="flex items-start gap-2 rounded-2xl bg-soft p-4 text-sm text-mute">
              <Camera className="mt-0.5 size-4 shrink-0 text-brand" />
              Se abrirá WhatsApp con tus datos listos. Después solo envía 4–6 fotos de tu auto (frente, lados, interior y tablero).
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-5 rounded-xl bg-brand/15 px-4 py-3 text-sm text-brand-hi" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => {
              setError("");
              setStep((s) => s - 1);
            }}
            className="grid size-14 shrink-0 place-items-center rounded-full border border-line active:scale-95"
            aria-label="Paso anterior"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="btn-shine group inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white active:scale-[0.98]"
          >
            Continuar
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <button
            type="submit"
            className="btn-shine group inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-wa font-bold text-night active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-6 transition-transform group-hover:-rotate-12" />
            Enviar por WhatsApp
          </button>
        )}
      </div>
    </form>
  );
}
