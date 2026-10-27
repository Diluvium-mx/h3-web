import { AlertTriangle, Info } from "lucide-react";

export function StorageBanner({ mode, blob }: { mode: "redis" | "local" | "demo"; blob: boolean }) {
  if (mode === "redis" && blob) return null;
  const demo = mode === "demo";
  const text = demo
    ? "Modo demo: el inventario que ves es de ejemplo y los cambios NO se guardan. Conecta Upstash Redis y Vercel Blob en Vercel (ver README)."
    : mode === "local"
      ? "Modo local de desarrollo: los cambios se guardan en data/cars.local.json y las fotos en public/uploads."
      : "Falta conectar Vercel Blob: no podrás subir fotos hasta configurarlo.";
  return (
    <div
      className={`mb-6 flex gap-3 rounded-2xl border p-4 text-sm ${
        demo || mode === "redis" ? "border-brand/40 bg-brand/10 text-fg" : "border-line bg-card text-mute"
      }`}
    >
      {demo || mode === "redis" ? (
        <AlertTriangle className="size-5 shrink-0 text-brand-hi" />
      ) : (
        <Info className="size-5 shrink-0" />
      )}
      <p>{text}</p>
    </div>
  );
}
