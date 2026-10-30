import { AlertTriangle, Info } from "lucide-react";

type Mode = "redis" | "blobs" | "local" | "demo";

export function StorageBanner({ mode, photos }: { mode: Mode; photos: boolean }) {
  if ((mode === "redis" || mode === "blobs") && photos) return null;
  const demo = mode === "demo";
  const text = demo
    ? "Modo demo: el inventario que ves es de ejemplo y los cambios NO se guardan. Conecta Upstash Redis y Cloudinary (ver README)."
    : mode === "local"
      ? "Modo local de desarrollo: los cambios se guardan en data/cars.local.json y las fotos en public/uploads."
      : mode === "blobs"
        ? "Los cambios se guardan en Netlify (los mismos datos en las 2 versiones del sitio). Falta conectar Cloudinary para subir fotos nuevas; las fotos actuales se pueden ordenar, clasificar y quitar."
        : "Falta conectar Cloudinary: no podrás subir fotos hasta configurarlo.";
  return (
    <div
      className={`mb-6 flex gap-3 rounded-lg border p-4 text-sm ${
        demo || mode === "redis" || mode === "blobs" ? "border-brand/40 bg-brand/10 text-fg" : "border-line bg-card text-mute"
      }`}
    >
      {demo || mode === "redis" || mode === "blobs" ? (
        <AlertTriangle className="size-5 shrink-0 text-brand-hi" />
      ) : (
        <Info className="size-5 shrink-0" />
      )}
      <p>{text}</p>
    </div>
  );
}
