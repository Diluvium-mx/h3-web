import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100dvh-3.5rem)] place-items-center px-4 py-12">
      <div className="w-full max-w-sm animate-rise">
        <Image src="/brand/mark-dark.png" alt="" width={344} height={186} className="mx-auto h-10 w-auto" />
        <p className="font-tech mt-8 flex items-center justify-center gap-3 text-[11px] text-dim">
          <span className="h-px w-6 bg-brand" />
          Solo administradores
          <span className="h-px w-6 bg-brand" />
        </p>
        <h1 className="font-display mt-3 text-center text-4xl">Entrar al panel</h1>
        <LoginForm />
      </div>
    </div>
  );
}
