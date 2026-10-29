import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReviewManager } from "@/components/admin/review-manager";
import { requireAdmin } from "@/lib/auth";
import { sortReviews } from "@/lib/reviews";
import { listReviews } from "@/lib/storage";
import { uploadMode } from "@/lib/upload-mode";

export const metadata = { title: "Reseñas" };

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 pb-32">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-mute hover:text-fg">
        <ArrowLeft className="size-4" /> Inventario
      </Link>
      <p className="font-tech mt-6 flex items-center gap-3 text-[11px] text-dim">
        <span className="h-px w-6 rule-accent" />
        Prueba social
      </p>
      <h1 className="font-display mt-2 text-4xl">Reseñas</h1>
      <p className="mt-3 max-w-xl text-mute">
        Lo que dicen tus clientes. Aparecen en el inicio en cuanto las guardas; si no hay ninguna, la sección no
        se muestra.
      </p>
      <Suspense fallback={<div className="skeleton mt-8 h-64 rounded-lg" />}>
        <Manager />
      </Suspense>
    </div>
  );
}

async function Manager() {
  await requireAdmin();
  const reviews = (await listReviews()).sort(sortReviews);
  return <ReviewManager initial={reviews} uploadMode={uploadMode()} />;
}
