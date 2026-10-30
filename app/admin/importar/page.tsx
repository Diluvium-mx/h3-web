import { Suspense } from "react";
import { FormShell, FormSkeleton } from "@/components/admin/form-shell";
import { ShopifyImport } from "@/components/admin/shopify-import";
import { StorageBanner } from "@/components/admin/storage-banner";
import { requireAdmin } from "@/lib/auth";
import { cloudinaryEnabled } from "@/lib/images";
import { getStorageMode } from "@/lib/storage";

export default function ImportPage() {
  return (
    <FormShell eyebrow="Migración" title="Importar de Shopify">
      <Suspense fallback={<FormSkeleton />}>
        <Import />
      </Suspense>
    </FormShell>
  );
}

async function Import() {
  await requireAdmin();
  return (
    <>
      <StorageBanner mode={getStorageMode()} photos={cloudinaryEnabled} />
      <ShopifyImport defaultStore="https://www.h3seminuevos.com" />
    </>
  );
}
