import { Suspense } from "react";
import Link from "next/link";
import { Download, KeyRound, MessageSquareQuote, Plus, Settings } from "lucide-react";
import { AdminCarList } from "@/components/admin/car-list";
import { StorageBanner } from "@/components/admin/storage-banner";
import { LogoutButton } from "@/components/admin/logout-button";
import { usingDefaultPassword } from "@/lib/admin-password";
import { requireAdmin } from "@/lib/auth";
import { sortNewest } from "@/lib/cars";
import { cloudinaryEnabled } from "@/lib/images";
import { listCars, storageMode } from "@/lib/storage";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-32">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-tech flex items-center gap-3 text-[11px] text-dim">
            <span className="h-px w-6 rule-accent" />
            Inventario
          </p>
          <h1 className="font-display mt-2 text-4xl">Tus autos</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/resenas"
            className="hidden h-11 items-center gap-2 rounded-md border border-line px-4 text-sm font-medium transition-colors hover:border-fg/40 sm:inline-flex"
          >
            <MessageSquareQuote className="size-4" /> Reseñas
          </Link>
          <Link
            href="/admin/ajustes"
            className="hidden h-11 items-center gap-2 rounded-md border border-line px-4 text-sm font-medium transition-colors hover:border-fg/40 sm:inline-flex"
          >
            <Settings className="size-4" /> Ajustes
          </Link>
          <Link href="/admin/autos/nuevo" className="btn btn-dark btn-shine hidden min-h-11 text-sm sm:inline-flex">
            <Plus className="size-4" /> Nuevo auto
          </Link>
        </div>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-2 sm:hidden">
        <Link href="/admin/resenas" className="flex items-center gap-2.5 rounded-md bg-card p-3 text-sm ring-1 ring-line">
          <MessageSquareQuote className="size-5 shrink-0 text-brand" />
          <span className="font-semibold">Reseñas</span>
        </Link>
        <Link href="/admin/ajustes" className="flex items-center gap-2.5 rounded-md bg-card p-3 text-sm ring-1 ring-line">
          <Settings className="size-5 shrink-0 text-brand" />
          <span className="font-semibold">Ajustes</span>
        </Link>
      </div>
      <Suspense fallback={<ListSkeleton />}>
        <Dashboard />
      </Suspense>
      <Link
        href="/admin/autos/nuevo"
        className="btn btn-dark fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 h-14 px-6 shadow-[0_12px_40px_-10px_rgb(12_13_15/0.6)] sm:hidden"
      >
        <Plus className="size-5" /> Nuevo auto
      </Link>
    </div>
  );
}

async function Dashboard() {
  await requireAdmin();
  const [list, isDefault] = await Promise.all([listCars(), usingDefaultPassword()]);
  const cars = list.sort(sortNewest);
  return (
    <>
      {isDefault && (
        <Link
          href="/admin/ajustes"
          className="mb-4 flex items-center gap-3 rounded-md border-l-2 border-brand bg-card p-4 text-sm ring-1 ring-line"
        >
          <KeyRound className="size-5 shrink-0 text-brand" />
          <span>
            <b>Estás usando la contraseña inicial.</b>{" "}
            <span className="text-mute underline underline-offset-4">Cámbiala en Ajustes</span>
          </span>
        </Link>
      )}
      <StorageBanner mode={storageMode} photos={cloudinaryEnabled} />
      {cars.length === 0 ? (
        <div className="rounded-lg bg-card p-10 text-center ring-1 ring-line">
          <p className="font-display text-2xl">Aún no hay autos</p>
          <p className="mt-2 text-mute">Agrega el primero o importa tu inventario actual de Shopify.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/admin/autos/nuevo" className="btn btn-dark">
              Agregar auto
            </Link>
            <Link href="/admin/importar" className="btn btn-outline">
              Importar de Shopify
            </Link>
          </div>
        </div>
      ) : (
        <AdminCarList cars={cars} />
      )}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm text-mute">
        <Link href="/admin/importar" className="inline-flex items-center gap-2 hover:text-fg">
          <Download className="size-4" /> Importar de Shopify
        </Link>
        <LogoutButton />
      </div>
    </>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="skeleton h-24 rounded-lg" />
      ))}
    </div>
  );
}
