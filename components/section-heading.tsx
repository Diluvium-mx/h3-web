import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  action,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  action?: { href: string; label: string };
  id?: string;
}) {
  return (
    <div className="reveal mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="font-tech flex items-center gap-2 text-xs text-brand-hi">
          <span className="h-0.5 w-6 skew-x-[-20deg] bg-brand" />
          {eyebrow}
        </p>
        <h2 id={id} className="font-display mt-3 text-4xl sm:text-5xl">
          {title}
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className="group hidden shrink-0 items-center gap-2 text-sm font-semibold text-fg/80 hover:text-fg sm:inline-flex"
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
