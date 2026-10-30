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
  /** "foto": la información va sobre la imagen (carruseles y autos similares) */
  variant?: "tarjeta" | "foto";
};

export function StatusBadge({ status }: { status: Car["status"] }) {
  if (status === "disponible") return null;
  return (
    <span
      className={`rounded-sm px-2 py-1 text-[10px] font-semibold tracking-wide uppercase ${
        status === "apartado" ? "bg-white text-night ring-1 ring-line" : "bg-night text-white"
      }`}
    >
      {status === "apartado" ? "Apartado" : "Vendido"}
    </span>
  );
}

function CardImage({ car, sizes, preload, className = "" }: { car: Car; sizes: string; preload?: boolean; className?: string }) {
  const cover = car.images[0];
  if (!cover) return <div className="skeleton absolute inset-0" />;
  return (
    <ViewTransition name={`car-${car.id}`} share="morph" default="none">
      <Image
        src={cover}
        alt={`${car.brand} ${car.model} ${car.year}`}
        fill
        sizes={sizes}
        quality={70}
        preload={preload}
        className={`object-cover object-[50%_62%] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] ${
          car.status === "vendido" ? "grayscale" : ""
        } ${className}`}
      />
    </ViewTransition>
  );
}

function WhatsAppMini({ car, className = "" }: { car: Car; className?: string }) {
  return (
    <a
      href={carWhatsApp(car)}
      target="_blank"
      rel="noopener"
      aria-label={`Escribir por WhatsApp sobre el ${carTitle(car)}`}
      className={`btn-wa btn-shine relative z-[2] grid shrink-0 place-items-center rounded-md transition-transform duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={vars({ "--shine-delay": `${(car.year % 5) * 0.7}s` })}
    >
      <WhatsAppIcon className="size-[1.1rem]" />
    </a>
  );
}

// Enlace que cubre toda la tarjeta (el botón de WhatsApp queda por encima)
function CardLink({ car, children }: { car: Car; children: React.ReactNode }) {
  return (
    <Link href={`/autos/${car.slug}`} prefetch className="outline-none after:absolute after:inset-0 after:z-[1] after:content-['']">
      {children}
    </Link>
  );
}

export function CarCard({
  car,
  sizes = "(min-width: 1536px) 22vw, (min-width: 1024px) 30vw, 50vw",
  preload,
  className = "",
  variant = "tarjeta",
}: Props) {
  const badges = highlightBadges(car);
  const sold = car.status === "vendido";
  const specs = [car.mileage != null && formatKm(car.mileage), car.transmission, car.fuel].filter(Boolean) as string[];

  if (variant === "foto") {
    return (
      <article
        className={`group relative isolate aspect-[4/5] overflow-hidden rounded-lg bg-graphite text-white shadow-[0_24px_50px_-28px_rgb(20_20_20/0.6)] transition-transform duration-500 ease-[var(--ease-out-expo)] focus-within:ring-2 focus-within:ring-white/60 hover:-translate-y-1 active:scale-[0.99] ${className}`}
      >
        <CardImage car={car} sizes={sizes} preload={preload} />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 via-45% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="flex items-center gap-2 text-[11px] font-medium text-white/70">
            {car.year} · {car.brand}
            <StatusBadge status={car.status} />
          </p>
          <h3 className="font-display mt-1 text-2xl">
            <CardLink car={car}>{car.model}</CardLink>
          </h3>
          {specs.length > 0 && <p className="mt-1 truncate text-[13px] text-white/70">{specs.slice(0, 2).join(" · ")}</p>}
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/15 pt-3">
            <p className={`font-display text-xl ${sold ? "text-white/60 line-through" : ""}`}>{formatPrice(car.price)}</p>
            <WhatsAppMini car={car} className="size-10" />
          </div>
        </div>
        <span className="rule-accent absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
      </article>
    );
  }

  // Tarjeta normal: se adapta a su ancho (compacta en 2 columnas del celular, amplia en pantallas grandes)
  return (
    <article
      className={`@container group relative flex flex-col overflow-hidden rounded-lg bg-card ring-1 ring-line transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] focus-within:ring-2 focus-within:ring-fg/40 hover:-translate-y-1 hover:shadow-[0_24px_50px_-26px_rgb(20_20_20/0.45)] active:scale-[0.99] ${className}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-soft">
        <CardImage car={car} sizes={sizes} preload={preload} />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/35 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-3 @[15rem]:p-5">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-dim @[15rem]:text-xs">
          {car.year} · {car.brand}
          <StatusBadge status={car.status} />
          {badges.slice(0, 1).map((b) => (
            <span key={b} className="hidden text-brand-hi @[15rem]:inline">
              · {b}
            </span>
          ))}
        </p>
        <h3 className="font-display mt-1 text-[1.05rem] leading-tight text-fg @[15rem]:text-[1.4rem]">
          <CardLink car={car}>{car.model}</CardLink>
        </h3>
        {car.version && <p className="mt-0.5 truncate text-xs text-mute @[15rem]:text-sm">{car.version}</p>}
        {specs.length > 0 && (
          <ul className="mt-2 flex flex-wrap items-center text-[11px] text-mute @[15rem]:mt-3 @[15rem]:text-[13px]" aria-label="Características">
            {specs.map((text, i) => (
              <li key={text} className={`flex items-center ${i === 2 ? "hidden @[15rem]:flex" : ""}`}>
                {i > 0 && <span className="mx-1.5 h-3 w-px bg-line @[15rem]:mx-2.5" aria-hidden="true" />}
                {text}
              </li>
            ))}
          </ul>
        )}
        <div className="min-h-3 flex-1" />
        <div className="flex items-end justify-between gap-2 border-t border-line pt-3 @[15rem]:pt-4">
          <p className={`font-display text-[1.05rem] @[15rem]:text-[1.3rem] ${sold ? "text-dim line-through" : "text-fg"}`}>
            {formatPrice(car.price)}
          </p>
          <div className="flex items-center gap-2">
            <WhatsAppMini car={car} className="size-9 @[15rem]:size-10" />
            <span
              className="hidden size-10 shrink-0 place-items-center rounded-md ring-1 ring-line transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:bg-night group-hover:text-white group-hover:ring-night @[15rem]:grid"
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
