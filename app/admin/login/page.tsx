import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="relative grid min-h-[calc(100dvh-3.5rem)] place-items-center overflow-hidden px-4 py-12">
      <div className="speed-lines pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-brand/25 blur-[120px]" />
      <div className="relative w-full max-w-sm animate-rise">
        <p className="font-tech text-center text-xs text-brand-hi">Solo administradores</p>
        <h1 className="font-display mt-3 text-center text-4xl">Entrar al panel</h1>
        <LoginForm />
      </div>
    </div>
  );
}
