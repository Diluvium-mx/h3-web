"use client";

import { useState, useTransition } from "react";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { changePasswordAction } from "@/lib/actions";

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
