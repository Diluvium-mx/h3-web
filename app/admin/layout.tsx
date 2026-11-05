import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/brand/mark-dark.png" alt="H3" width={344} height={186} className="h-6 w-auto" />
            <span className="font-tech text-xs text-mute">Panel</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-fg/80 transition-colors hover:border-fg/40 hover:text-fg"
          >
            Ver sitio <ExternalLink className="size-3.5" />
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
