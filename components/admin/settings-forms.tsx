"use client";

import { useState, useTransition } from "react";
import { Check, Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import { changePasswordAction, saveStatsAction } from "@/lib/actions";
import type { TrustStat } from "@/lib/settings";

const field =
  "h-12 w-full rounded-md border border-line bg-paper px-4 text-fg placeholder:text-dim focus:border-fg/50 focus:bg-card focus:ring-4 focus:ring-fg/5 focus:outline-none";

function Status({ error, done }: { error: string; done: string }) {
  if (error) {
    return (
      <p className="rounded-md border-l-2 border-brand bg-brand-soft px-4 py-3 text-sm text-brand-hi" role="alert">
        {error}
      </p>
    );
  }
  if (done) {
    return (
      <p className="flex items-center gap-2 rounded-md border-l-2 border-wa-dark bg-wa/10 px-4 py-3 text-sm" role="status">
        <Check className="size-4 text-wa-dark" /> {done}
      </p>
    );
  }
  return null;
}

export function PasswordForm() {
  const [pending, start] = useTransition();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [v, setV] = useState({ current: "", next: "", confirm: "" });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setV((p) => ({ ...p, [k]: e.target.value }));
    setError("");
    setDone("");
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await changePasswordAction(v.current, v.next, v.confirm);
          if (!res.ok) return setError(res.error);
          setV({ current: "", next: "", confirm: "" });
          setDone("Listo. La próxima vez entra con tu nueva contraseña.");
        });
      }}
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Contraseña actual</span>
        <input
          className={field}
          type={show ? "text" : "password"}
          value={v.current}
          onChange={set("current")}
          autoComplete="current-password"
          required
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Nueva contraseña</span>
          <input
            className={field}
            type={show ? "text" : "password"}
            value={v.next}
            onChange={set("next")}
            autoComplete="new-password"
            minLength={5}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Repite la nueva</span>
          <input
            className={field}
            type={show ? "text" : "password"}
            value={v.confirm}
            onChange={set("confirm")}
            autoComplete="new-password"
            minLength={5}
            required
          />
        </label>
      </div>
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="inline-flex items-center gap-2 text-sm text-mute hover:text-fg"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        {show ? "Ocultar contraseñas" : "Mostrar contraseñas"}
      </button>
      <Status error={error} done={done} />
      <button type="submit" disabled={pending} className="btn btn-dark btn-shine w-full disabled:opacity-60 sm:w-auto">
        {pending && <Loader2 className="size-4 animate-spin" />}
        Cambiar contraseña
      </button>
    </form>
  );
}

type Row = { prefix: string; value: string; suffix: string; label: string };

const toRow = (s: TrustStat): Row => ({
  prefix: s.prefix?.trim() ?? "",
  value: String(s.value),
  suffix: s.suffix?.trim() ?? "",
  label: s.label,
});

export function StatsForm({ initial, example }: { initial: TrustStat[]; example: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [rows, setRows] = useState<Row[]>(initial.map(toRow));
  const update = (i: number, k: keyof Row, value: string) => {
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: value } : r)));
    setError("");
    setDone("");
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const res = await saveStatsAction(
            rows
              .filter((r) => r.value.trim() && r.label.trim())
              .map((r) => ({ prefix: r.prefix, value: Number(r.value.replace(/\D/g, "")), suffix: r.suffix, label: r.label })),
          );
          if (!res.ok) return setError(res.error);
          setDone(rows.length ? "Guardado. Ya se ven en el inicio." : "Listo. La sección ya no se muestra en el inicio.");
        });
      }}
    >
      {example && (
        <p className="rounded-md bg-paper p-4 text-sm text-mute">
          Estos son <b className="text-fg">números de ejemplo</b> y no se publican. Cámbialos por los reales y
          guarda; desde ese momento aparecen en el inicio.
        </p>
      )}
      <ul className="space-y-3">
        {rows.map((r, i) => (
          <li key={i} className="grid grid-cols-[4rem_1fr_5rem_auto] gap-2 rounded-md bg-paper p-3 sm:grid-cols-[4rem_8rem_5rem_1fr_auto]">
            <label>
              <span className="mb-1 block text-xs text-mute">Antes</span>
              <input className={`${field} px-2 text-center`} value={r.prefix} onChange={(e) => update(i, "prefix", e.target.value)} maxLength={3} placeholder="+" />
            </label>
            <label>
              <span className="mb-1 block text-xs text-mute">Número</span>
              <input
                className={field}
                value={r.value}
                onChange={(e) => update(i, "value", e.target.value.replace(/\D/g, "").slice(0, 8))}
                inputMode="numeric"
                placeholder="500"
                required
              />
            </label>
            <label>
              <span className="mb-1 block text-xs text-mute">Después</span>
              <input className={`${field} px-2 text-center`} value={r.suffix} onChange={(e) => update(i, "suffix", e.target.value)} maxLength={8} placeholder="min" />
            </label>
            <label className="col-span-4 row-start-2 sm:col-span-1 sm:row-start-auto">
              <span className="mb-1 block text-xs text-mute">Texto</span>
              <input className={field} value={r.label} onChange={(e) => update(i, "label", e.target.value)} maxLength={40} placeholder="Autos entregados" required />
            </label>
            <button
              type="button"
              onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
              className="mt-5 grid size-12 place-items-center self-start rounded-md text-mute hover:bg-soft hover:text-brand-hi"
              aria-label={`Quitar número ${i + 1}`}
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      {rows.length < 4 && (
        <button
          type="button"
          onClick={() => setRows((rs) => [...rs, { prefix: "", value: "", suffix: "", label: "" }])}
          className="inline-flex items-center gap-2 text-sm font-semibold"
        >
          <Plus className="size-4" /> Agregar número
        </button>
      )}
      <Status error={error} done={done} />
      <button type="submit" disabled={pending} className="btn btn-dark btn-shine w-full disabled:opacity-60 sm:w-auto">
        {pending && <Loader2 className="size-4 animate-spin" />}
        Guardar números
      </button>
    </form>
  );
}
