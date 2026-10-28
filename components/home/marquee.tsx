import { Fragment } from "react";

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, "Ready to drive"];
  return (
    <div className="relative -rotate-1 overflow-hidden border-y border-line bg-card py-4" aria-hidden="true">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {row.map((item, i) => (
              <Fragment key={`${copy}-${i}`}>
                <span
                  className={`font-display px-6 text-3xl whitespace-nowrap sm:text-4xl ${
                    i % 2 ? "text-dim" : "text-fg"
                  } ${item === "Ready to drive" ? "!text-brand-hi" : ""}`}
                >
                  {item}
                </span>
                <span className="size-2 rotate-45 bg-brand" />
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
