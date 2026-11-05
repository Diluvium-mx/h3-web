"use client";

import { useState } from "react";
import { CloudUpload, Loader2 } from "lucide-react";
import { moveCarPhotosAction } from "@/lib/actions";

type Item = { id: string; title: string; photos: number };

// Aviso con botón mientras queden fotos en Shopify: las pasa a Cloudinary auto por auto. Al terminar
// desaparece solo (ya no hay fotos pendientes). Hay que hacerlo antes de cancelar Shopify.
export function MovePhotos({ cars }: { cars: Item[] }) {
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState("");
  const total = cars.reduce((n, c) => n + c.photos, 0);

  async function run() {
    setRunning(true);
    let done = 0;
    let failed = 0;
    for (const car of cars) {
      for (;;) {
        setMsg(`Pasando las fotos de ${car.title}… (${done} de ${total})`);
        const r = await moveCarPhotosAction(car.id);
        if (!r.ok) {
          setMsg(r.error);
          setRunning(false);
          return;
        }
        done += r.moved;
        if (r.remaining === 0 || r.moved === 0) {
          failed += r.remaining;
          break;
        }
      }
    }
    setRunning(false);
    setMsg(failed ? `${done} fotos pasadas; ${failed} no se pudieron. Vuelve a intentarlo.` : `Listo: ${done} fotos pasadas.`);
  }

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-md border-l-2 border-brand bg-card p-4 text-sm ring-1 ring-line sm:flex-row sm:items-center">
      <CloudUpload className="size-5 shrink-0 text-brand" />
      <p className="flex-1" role="status">
        {msg || (
          <>
            <b>{total} fotos de {cars.length} autos siguen guardadas en Shopify.</b> Pásalas a Cloudinary para que
            carguen más rápido y no se pierdan al cancelar Shopify.
          </>
        )}
      </p>
      <button type="button" onClick={run} disabled={running} className="btn btn-dark min-h-11 shrink-0 text-sm">
        {running ? <Loader2 className="size-4 animate-spin" /> : <CloudUpload className="size-4" />}
        {running ? "Pasando fotos…" : "Pasar fotos a Cloudinary"}
      </button>
    </div>
  );
}
