import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { PasswordForm, StatsForm } from "@/components/admin/settings-forms";
import { usingDefaultPassword } from "@/lib/admin-password";
import { requireAdmin } from "@/lib/auth";
import { EXAMPLE_STATS, type TrustStat } from "@/lib/settings";
import { getSetting } from "@/lib/storage";

export const metadata = { title: "Ajustes" };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 pb-32">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-fg">
        <ArrowLeft className="size-4" /> Inventario
      </Link>
      <p className="font-tech mt-6 flex items-center gap-3 text-[11px] text-dim">
        <span className="h-px w-6 bg-brand" />
        Panel
      </p>
      <h1 className="font-display mt-2 text-4xl">Ajustes</h1>
      <Suspense fallback={<div className="skeleton mt-8 h-96 rounded-lg" />}>
        <Settings />
      </Suspense>
    </div>
  );
}

async function Settings() {
  await requireAdmin();
  const [saved, isDefault] = await Promise.all([
    getSetting<TrustStat[]>("stats").catch(() => null),
    usingDefaultPassword(),
  ]);
  return (
    <div className="mt-8 space-y-6">
      <section className="rounded-lg bg-card p-5 ring-1 ring-line sm:p-7" aria-labelledby="contrasena">
        <h2 id="contrasena" className="font-display flex items-center gap-2.5 text-2xl">
          <KeyRound className="size-5 text-brand" /> Contraseña del panel
        </h2>
        {isDefault ? (
          <p className="mt-2 text-sm text-brand-hi">
            Estás usando la contraseña inicial. Cámbiala antes de publicar el sitio: cualquiera que la conozca
            podría entrar.
          </p>
        ) : (
          <p className="mt-2 text-sm text-mute">Usa una que no uses en otro lado y que sea fácil de recordar para ti.</p>
        )}
        <div className="mt-6">
          <PasswordForm />
        </div>
      </section>

      <section className="rounded-lg bg-card p-5 ring-1 ring-line sm:p-7" aria-labelledby="numeros">
        <h2 id="numeros" className="font-display text-2xl">
          Números de confianza
        </h2>
        <p className="mt-2 text-sm text-mute">
          Aparecen en el inicio, debajo de la foto principal. Pon de 2 a 3 números reales del negocio (por ejemplo,
          autos entregados o años de experiencia). Si no guardas ninguno, la sección no se muestra.
        </p>
        <div className="mt-6">
          <StatsForm initial={saved ?? EXAMPLE_STATS} example={!saved} />
        </div>
      </section>
    </div>
  );
}
