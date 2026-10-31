import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CarForm } from "@/components/admin/car-form";
import { FormShell, FormSkeleton } from "@/components/admin/form-shell";
import { requireAdmin } from "@/lib/auth";
import { getCar } from "@/lib/storage";
import { uploadMode } from "@/lib/upload-mode";

export default function EditCarPage(props: PageProps<"/admin/autos/[id]">) {
  return (
    <FormShell wide eyebrow="Editar" title="Editar auto">
      <Suspense fallback={<FormSkeleton />}>
        <EditCar params={props.params} />
      </Suspense>
    </FormShell>
  );
}

async function EditCar({ params }: { params: PageProps<"/admin/autos/[id]">["params"] }) {
  await requireAdmin();
  const { id } = await params;
  const car = await getCar(id);
  if (!car) notFound();
  return <CarForm initial={car} uploadMode={uploadMode()} />;
}
