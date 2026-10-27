import { Suspense } from "react";
import Link from "next/link";
import { Download, Plus } from "lucide-react";
import { AdminCarList } from "@/components/admin/car-list";
import { StorageBanner } from "@/components/admin/storage-banner";
import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdmin } from "@/lib/auth";
import { sortNewest } from "@/lib/cars";
import { cloudinaryEnabled } from "@/lib/images";
import { listCars, storageMode } from "@/lib/storage";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-32">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-tech text-xs text-brand-hi">Inventario</p>
          <h1 className="font-display mt-2 text-4xl">Tus autos</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/importar"
            className="hidden h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium sm:inline-flex"
          >
            <Download className="size-4" /> Importar de Shopify
          </Link>
          <Link
            href="/admin/autos/nuevo"
            className="btn-shine hidden h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white sm:inline-flex"
          >
            <Plus className="size-4" /> Nuevo auto
          </Link>
        </div>
      </div>
      <Suspense fallback={<ListSkeleton />}>
        <Dashboard />
      </Suspense>
      <Link
        href="/admin/autos/nuevo"
        className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex h-14 items-center gap-2 rounded-full bg-brand px-6 font-semibold text-white shadow-[0_12px_40px_-8px_rgb(227_20_31/0.8)] active:scale-95 sm:hidden"
      >
        <Plus className="size-5" /> Nuevo auto
      </Link>
    </div>
  );
}

async function Dashboard() {
  await requireAdmin();
  const cars = (await listCars()).sort(sortNewest);
  return (
    <>
      <StorageBanner mode={storageMode} photos={cloudinaryEnabled} />
      {cars.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line p-10 text-center">
          <p className="font-display text-2xl">Aún no hay autos</p>
          <p className="mt-2 text-mute">Agrega el primero o importa tu inventario actual de Shopify.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/admin/autos/nuevo" className="rounded-full bg-brand px-6 py-3 font-semibold text-white">
              Agregar auto
            </Link>
            <Link href="/admin/importar" className="rounded-full border border-line px-6 py-3 font-semibold">
              Importar de Shopify
            </Link>
          </div>
        </div>
      ) : (
        <AdminCarList cars={cars} />
      )}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm text-mute">
        <Link href="/admin/importar" className="inline-flex items-center gap-2 hover:text-fg sm:hidden">
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
        <div key={i} className="skeleton h-24 rounded-2xl" />
      ))}
    </div>
  );
}
