import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { carTitle, carWhatsApp, formatKm, formatPrice, highlightBadges, type Car } from "@/lib/cars";
import { vars } from "@/lib/ui";

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
      className={`font-tech rounded-sm px-2 py-1 text-[10px] ${
        status === "apartado" ? "bg-white text-night ring-1 ring-line" : "bg-night text-white"
      }`}
    >
      {status === "apartado" ? "Apartado" : "Vendido"}
    </span>
  );
}

// Datos clave en una línea, separados por divisiones finas (sin «píldoras»). Lo que no se tiene no se muestra.
function SpecLine({ car }: { car: Car }) {
  const items = [car.mileage != null && formatKm(car.mileage), car.transmission, car.fuel].filter(Boolean) as string[];
  return (
    <ul className="mt-3 flex flex-wrap items-center text-[13px] text-mute" aria-label="Características">
      {items.map((text, i) => (
        <li key={text} className="flex items-center">
          {i > 0 && <span className="mx-2.5 h-3 w-px bg-line" aria-hidden="true" />}
          {text}
        </li>
      ))}
    </ul>
  );
}

// Toda la tarjeta lleva a la ficha (enlace estirado) y aparte tiene un botón directo de WhatsApp
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
    <article
      className={`group relative flex flex-col overflow-hidden rounded-lg bg-card ring-1 ring-line transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] focus-within:ring-2 focus-within:ring-fg/40 hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgb(10_15_26/0.5),0_0_0_1px_rgb(208_18_46/0.18)] active:scale-[0.99] ${className}`}
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
              className={`object-cover object-[50%_62%] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] ${
                sold ? "grayscale" : ""
              }`}
            />
          </ViewTransition>
        ) : (
          <div className="skeleton absolute inset-0" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/40 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <StatusBadge status={car.status} />
          {badges.slice(0, 1).map((b) => (
            <span key={b} className="font-tech rounded-sm bg-night/75 px-2 py-1 text-[10px] text-white backdrop-blur-md">
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="font-tech text-[10px] text-dim">
          {car.year} · {car.brand}
        </p>
        <h3 className="font-display mt-1.5 text-[1.35rem] text-fg">
          <Link
            href={`/autos/${car.slug}`}
            prefetch
            className="outline-none after:absolute after:inset-0 after:z-[1] after:content-['']"
          >
            {car.model}
          </Link>
        </h3>
        {car.version && <p className="mt-0.5 truncate text-sm text-mute">{car.version}</p>}
        <SpecLine car={car} />
        <div className="min-h-4 flex-1" />
        <div className="flex items-end justify-between gap-3 border-t border-line pt-4">
          <p className={`font-display text-[1.3rem] ${sold ? "text-dim line-through" : "text-fg"}`}>
            {formatPrice(car.price)}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={carWhatsApp(car)}
              target="_blank"
              rel="noopener"
              aria-label={`Escribir por WhatsApp sobre el ${carTitle(car)}`}
              className="btn-wa btn-shine relative z-[2] grid size-10 place-items-center rounded-md transition-transform duration-300 hover:scale-105 active:scale-95"
              style={vars({ "--shine-delay": `${(car.year % 5) * 0.7}s` })}
            >
              <WhatsAppIcon className="size-[1.15rem]" />
            </a>
            <span
              className="grid size-10 shrink-0 place-items-center rounded-md ring-1 ring-line transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:bg-night group-hover:text-white group-hover:ring-night"
              aria-hidden="true"
            >
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
            </span>
          </div>
        </div>
      </div>
      <span className="rule-accent absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
    </article>
  );
}
