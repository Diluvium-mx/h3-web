"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction } from "@/lib/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="relative block">
        <span className="sr-only">Contraseña</span>
        <input
          name="password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          required
          autoFocus
          placeholder="Contraseña"
          className={`h-14 w-full rounded-md border bg-card pr-14 pl-5 text-fg placeholder:text-dim focus:border-fg/50 focus:ring-4 focus:ring-fg/5 focus:outline-none ${
            state?.error ? "border-brand" : "border-line"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-md text-mute hover:text-fg"
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </label>
      {state?.error && (
        <p className="animate-rise text-center text-sm text-brand-hi" role="alert">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="btn btn-dark btn-shine h-14 w-full disabled:opacity-70"
      >
        {pending && <Loader2 className="size-5 animate-spin" />}
        Entrar
      </button>
    </form>
  );
}
