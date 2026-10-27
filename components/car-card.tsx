import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight, Cog, Fuel, Gauge, MessageCircle } from "lucide-react";
import { formatKm, formatPrice, highlightBadges, type Car } from "@/lib/cars";

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
      className={`font-tech rounded-full px-2.5 py-1 text-[10px] shadow-sm ${
        status === "apartado" ? "bg-volt text-night" : "bg-night text-white"
      }`}
    >
      {status === "apartado" ? "Apartado" : "Vendido"}
    </span>
  );
}

// Características resumidas: lo que más pregunta la gente, en palabras simples
function SpecChips({ car }: { car: Car }) {
  const chips = [
    car.mileage != null
      ? { Icon: Gauge, text: formatKm(car.mileage) }
      : { Icon: MessageCircle, text: "Km: pregúntanos", ask: true },
    car.transmission && { Icon: Cog, text: car.transmission },
    car.fuel && { Icon: Fuel, text: car.fuel },
  ].filter(Boolean) as { Icon: typeof Gauge; text: string; ask?: boolean }[];
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Características">
      {chips.map(({ Icon, text, ask }) => (
        <li
          key={text}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            ask ? "bg-wa/15 text-wa-dark" : "bg-soft text-fg/85"
          }`}
        >
          <Icon className={`size-3.5 ${ask ? "" : "text-brand"}`} aria-hidden="true" />
          {text}
        </li>
      ))}
    </ul>
  );
}

export function CarCard({
  car,
  sizes = "(min-width: 1536px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 50vw",
  preload,
  className = "",
}: Props) {
  const badges = highlightBadges(car);
  const cover = car.images[0];
  const sold = car.status === "vendido";
  return (
    <Link
      href={`/autos/${car.slug}`}
      prefetch
      className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-card shadow-[0_2px_10px_-4px_rgb(20_20_23/0.15)] ring-1 ring-line transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-18px_rgb(227_20_31/0.35)] active:scale-[0.98] ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-soft">
        {cover ? (
          <ViewTransition name={`car-${car.id}`} share="morph" default="none">
            <Image
              src={cover}
              alt={`${car.brand} ${car.model} ${car.year}`}
              fill
              sizes={sizes}
              quality={70}
              preload={preload}
              className={`object-cover object-[50%_62%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06] ${
                sold ? "grayscale" : ""
              }`}
            />
          </ViewTransition>
        ) : (
          <div className="skeleton absolute inset-0" />
        )}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-night/35 to-transparent" />
        {/* Año en amarillo de marca */}
        <span className="font-display absolute top-3 left-3 -skew-x-6 rounded-lg bg-volt px-2.5 py-1 text-base text-night shadow-md">
          {car.year}
        </span>
        <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1.5">
          <StatusBadge status={car.status} />
          {badges.map((b) => (
            <span
              key={b}
              className="font-tech rounded-full bg-card/90 px-2.5 py-1 text-[10px] text-fg shadow-sm backdrop-blur-md"
            >
              {b}
            </span>
          ))}
        </div>
        {/* Precio como etiqueta roja */}
        <span
          className={`absolute bottom-3 left-3 -skew-x-6 rounded-xl px-3.5 py-1.5 text-lg font-bold tracking-tight shadow-lg transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-0.5 ${
            sold ? "bg-night text-white/80 line-through" : "bg-brand text-white"
          }`}
        >
          {formatPrice(car.price)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="font-tech text-[11px] text-brand-hi">{car.brand}</p>
        <h3 className="font-display mt-1 text-[1.55rem] leading-[0.95] text-fg">{car.model}</h3>
        {car.version && <p className="mt-1 truncate text-sm text-mute">{car.version}</p>}
        <SpecChips car={car} />
        <span className="mt-auto flex items-center justify-between pt-4 text-sm font-semibold text-fg">
          Ver detalles
          <span className="grid size-9 place-items-center rounded-full bg-soft transition-all duration-500 ease-[var(--ease-spring)] group-hover:translate-x-0.5 group-hover:bg-brand group-hover:text-white">
            <ArrowRight className="size-4" />
          </span>
        </span>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand to-volt transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
    </Link>
  );
}
