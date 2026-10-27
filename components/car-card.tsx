import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import { carName, formatKm, formatPrice, highlightBadges, type Car } from "@/lib/cars";

type Props = {
  car: Car;
  sizes?: string;
  preload?: boolean;
  className?: string;
};

export function StatusBadge({ status }: { status: Car["status"] }) {
  if (status === "disponible") return null;
  return (
    <span
      className={`font-tech rounded-full px-2.5 py-1 text-[10px] ${
        status === "apartado" ? "bg-volt text-ink" : "bg-fg text-ink"
      }`}
    >
      {status === "apartado" ? "Apartado" : "Vendido"}
    </span>
  );
}

export function CarCard({
  car,
  sizes = "(min-width: 1536px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw",
  preload,
  className = "",
}: Props) {
  const badges = highlightBadges(car);
  const cover = car.images[0];
  return (
    <Link
      href={`/autos/${car.slug}`}
      prefetch
      className={`group relative block overflow-hidden rounded-3xl bg-ink-3 ring-1 ring-line transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgb(227_20_31/0.45)] hover:ring-brand/50 active:scale-[0.98] ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {cover ? (
          <ViewTransition name={`car-${car.id}`} share="morph" default="none">
            <Image
              src={cover}
              alt={`${carName(car)} ${car.year}`}
              fill
              sizes={sizes}
              quality={70}
              preload={preload}
              className={`object-cover object-[50%_60%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06] ${
                car.status === "vendido" ? "grayscale" : ""
              }`}
            />
          </ViewTransition>
        ) : (
          <div className="skeleton absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink from-5% via-ink/75 via-30% to-transparent to-65%" />
        <div className="absolute inset-x-3 top-3 flex flex-wrap items-start gap-1.5">
          <StatusBadge status={car.status} />
          {badges.map((b) => (
            <span
              key={b}
              className="font-tech rounded-full bg-ink/70 px-2.5 py-1 text-[10px] text-fg ring-1 ring-white/15 backdrop-blur-md"
            >
              {b}
            </span>
          ))}
        </div>
        <span className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-fg text-ink opacity-0 transition-all duration-500 ease-[var(--ease-spring)] group-hover:rotate-0 group-hover:opacity-100 rotate-[-45deg] scale-75 group-hover:scale-100">
          <ArrowUpRight className="size-5" />
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="font-tech flex items-center gap-2 text-[11px] text-fg/80">
            <span className="h-0.5 w-4 skew-x-[-20deg] bg-brand" />
            {car.year} · {car.brand}
          </p>
          <h3 className="font-display mt-1 text-[1.6rem] leading-[0.95] text-fg sm:text-[1.75rem]">
            {car.model}
          </h3>
          {car.version && <p className="mt-1 truncate text-sm text-fg/70">{car.version}</p>}
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-xl font-bold tracking-tight text-fg">{formatPrice(car.price)}</p>
            <p className="text-xs text-fg/65">
              {[
                car.mileage != null && formatKm(car.mileage),
                car.transmission && (car.transmission === "Automática" ? "Aut." : "Std."),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <span className="mt-3 block h-0.5 w-10 origin-left skew-x-[-20deg] bg-brand transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:w-full" />
        </div>
      </div>
    </Link>
  );
}
