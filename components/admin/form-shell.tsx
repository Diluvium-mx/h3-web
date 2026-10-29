import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function FormShell({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-mute hover:text-fg">
        <ChevronLeft className="size-4" /> Inventario
      </Link>
      <p className="font-tech mt-4 flex items-center gap-3 text-[11px] text-dim"><span className="h-px w-6 rule-accent" />{eyebrow}</p>
      <h1 className="font-display mt-2 mb-6 text-4xl">{title}</h1>
      {children}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-56 rounded-lg" />
      <div className="skeleton h-72 rounded-lg" />
    </div>
  );
}
