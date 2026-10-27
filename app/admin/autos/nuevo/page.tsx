import { Suspense } from "react";
import { CarForm } from "@/components/admin/car-form";
import { FormShell, FormSkeleton } from "@/components/admin/form-shell";
import { requireAdmin } from "@/lib/auth";
import { uploadMode } from "@/lib/upload-mode";

export default function NewCarPage() {
  return (
    <FormShell eyebrow="Nuevo" title="Publicar auto">
      <Suspense fallback={<FormSkeleton />}>
        <NewCar />
      </Suspense>
    </FormShell>
  );
}

async function NewCar() {
  await requireAdmin();
  return <CarForm uploadMode={uploadMode()} />;
}
