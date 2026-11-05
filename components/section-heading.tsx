import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  action,
  id,
  dark,
}: {
  eyebrow?: string;
  title: ReactNode;
  action?: { href: string; label: string };
  id?: string;
  dark?: boolean;
}) {
  return (
    <div className="reveal mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className={`font-tech mb-4 flex items-center gap-3 text-[11px] ${dark ? "text-silver" : "text-dim"}`}>
            <span className="h-px w-8 rule-accent" />
            {eyebrow}
          </p>
        )}
        <h2 id={id} className={`font-display text-[2rem] sm:text-5xl ${dark ? "text-white" : ""}`}>
          {title}
        </h2>
      </div>
      {action && (
        <Link
          href={action.href}
          className={`group hidden shrink-0 items-center gap-2 text-sm font-semibold sm:inline-flex ${
            dark ? "text-white/80 hover:text-white" : "text-fg/80 hover:text-fg"
          }`}
        >
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
            {action.label}
          </span>
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
