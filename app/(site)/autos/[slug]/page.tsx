import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Calendar,
  CalendarCheck,
  Car as CarIcon,
  ChevronLeft,
  Cog,
  DoorOpen,
  Fuel,
  Gauge,
  MapPin,
  Palette,
  Phone,
  Shield,
  Waypoints,
  Zap,
} from "lucide-react";
import { Gallery } from "@/components/car/gallery";
import { ShareButton } from "@/components/car/share-button";
import { StickyCta } from "@/components/car/sticky-cta";
import { CarCard, StatusBadge } from "@/components/car-card";
import { WhatsAppIcon } from "@/components/icons";
import { CarJsonLd } from "@/components/site/json-ld";
import {
  carName,
  carTitle,
  carUrl,
  carWhatsApp,
  formatKm,
  formatPrice,
  infoMessage,
  MISSING_INFO_TEXT,
  missingSpecs,
  visitMessage,
  type Car,
} from "@/lib/cars";
import { getAllCars, getCarBySlug, similarCars } from "@/lib/data";
import { site, whatsappUrl } from "@/lib/site";
import { vars } from "@/lib/ui";

export async function generateStaticParams() {
  const cars = await getAllCars();
  // Cache Components requiere al menos un parámetro
  return cars.length ? cars.map((c) => ({ slug: c.slug })) : [{ slug: "sin-autos" }];
}

export async function generateMetadata({ params }: PageProps<"/autos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: "Auto no encontrado" };
  const title = `${carTitle(car)} en Villahermosa`;
  const description = `${[
    carTitle(car),
    formatPrice(car.price),
    car.mileage != null && formatKm(car.mileage),
    car.transmission,
  ]
    .filter(Boolean)
    .join(" · ")}. ${car.description.replace(/\s+/g, " ").slice(0, 110)}…`;
  return {
    title,
    description,
    alternates: { canonical: `/autos/${car.slug}` },
    openGraph: {
      title: `${carTitle(car)} · ${formatPrice(car.price)}`,
      description,
      url: carUrl(car),
      images: car.images[0] ? [{ url: car.images[0], alt: carTitle(car) }] : undefined,
    },
  };
}

export default function CarPage(props: PageProps<"/autos/[slug]">) {
  return (
    <Suspense fallback={<CarSkeleton />}>
      <CarDetail params={props.params} />
    </Suspense>
  );
}

async function CarDetail({ params }: { params: PageProps<"/autos/[slug]">["params"] }) {
  const { slug } = await params;
  const [car, all] = await Promise.all([getCarBySlug(slug), getAllCars()]);
  if (!car) notFound();
  const similar = similarCars(car, all);
  const sold = car.status === "vendido";

  // Resumen: los datos que más pregunta la gente. Si falta uno, se invita a preguntar por WhatsApp.
  const summary: Spec[] = [
    { Icon: Calendar, label: "Año", value: String(car.year), tone: "volt" },
    { Icon: Gauge, label: "Kilometraje", value: car.mileage != null ? formatKm(car.mileage) : undefined, tone: "brand" },
    { Icon: Cog, label: "Transmisión", value: car.transmission, tone: "night" },
    { Icon: Fuel, label: "Combustible", value: car.fuel, tone: "brand" },
  ];
  const extras = [
    car.drivetrain && { Icon: Waypoints, label: "Tracción", value: car.drivetrain },
    car.color && { Icon: Palette, label: "Color", value: car.color },
    car.doors && { Icon: DoorOpen, label: "Puertas", value: String(car.doors) },
    car.armored && { Icon: Shield, label: "Blindaje", value: "Sí" },
    { Icon: MapPin, label: "Ubicación", value: `${site.address.city}, ${site.address.state}`, wide: true },
  ].filter(Boolean) as Spec[];
  const details: Spec[] = [
    ...summary,
    { Icon: Zap, label: "Motor", value: car.engine },
    { Icon: CarIcon, label: "Tipo", value: car.body },
    ...extras,
  ];
  const missing = missingSpecs(car);

  return (
    <>
      <CarJsonLd car={car} />
      <div className="mx-auto max-w-7xl lg:px-6 lg:pt-24">
        <div className="hidden items-center gap-2 pb-5 text-sm text-mute lg:flex">
          <Link href="/autos" className="inline-flex items-center gap-1 hover:text-fg">
            <ChevronLeft className="size-4" /> Catálogo
          </Link>
          <span>/</span>
          <span className="text-fg/80">{carTitle(car)}</span>
        </div>

        <div className="lg:grid lg:grid-cols-[1.25fr_1fr] lg:items-start lg:gap-10">
          <div className="relative min-w-0">
            <Gallery images={car.images} alt={carTitle(car)} carId={car.id} sold={sold} />
            <Link
              href="/autos"
              className="absolute top-20 left-4 grid size-11 place-items-center rounded-full bg-card/90 shadow-md backdrop-blur-md active:scale-95 lg:hidden"
              aria-label="Volver al catálogo"
            >
              <ChevronLeft className="size-6" />
            </Link>
          </div>

          {/* Panel de información */}
          <div className="relative -mt-6 min-w-0 rounded-t-[2rem] bg-paper px-4 pt-7 sm:px-6 lg:sticky lg:top-24 lg:mt-0 lg:rounded-3xl lg:border lg:border-line lg:bg-card lg:p-8">
            <div className="stagger">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-tech text-xs text-brand-hi">
                  {car.year} · {car.brand}
                </p>
                <StatusBadge status={car.status} />
                {car.armored && (
                  <span className="font-tech rounded-full bg-fg/10 px-2.5 py-1 text-[10px]">Blindado</span>
                )}
              </div>
              <h1 className="font-display mt-2 text-[2.6rem] leading-[0.92] sm:text-5xl" style={vars({ "--i": 1 })}>
                {car.model}
                {car.version && <span className="mt-2 block text-xl text-fg/60 sm:text-2xl">{car.version}</span>}
              </h1>
              <p
                className={`mt-5 text-4xl font-bold tracking-tight ${sold ? "text-mute line-through" : ""}`}
                style={vars({ "--i": 2 })}
              >
                {formatPrice(car.price)}
                <span className="ml-2 align-middle text-sm font-medium text-dim">MXN</span>
              </p>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-2">
              {summary.map((spec) => (
                <SpecTile key={spec.label} spec={spec} car={car} compact />
              ))}
            </dl>

            {/* Acciones (escritorio y debajo del precio en móvil) */}
            <div className="mt-7 grid gap-3">
              <a
                id="cta-principal"
                href={carWhatsApp(car)}
                target="_blank"
                rel="noopener"
                className="btn-shine group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-wa px-6 text-base font-bold text-night shadow-[0_14px_40px_-12px_rgb(37_211_102/0.7)] transition-transform active:scale-[0.97]"
              >
                <WhatsAppIcon className="size-6 transition-transform duration-500 group-hover:-rotate-12" />
                {sold ? "Búscame uno similar" : "Me interesa este auto"}
              </a>
              {!sold && (
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={whatsappUrl(visitMessage(car))}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-soft text-sm font-semibold transition-colors hover:border-fg/30"
                  >
                    <CalendarCheck className="size-4 text-brand-hi" /> Agendar visita
                  </a>
                  <a
                    href={site.phoneHref}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-soft text-sm font-semibold transition-colors hover:border-fg/30"
                  >
                    <Phone className="size-4 text-brand-hi" /> Llamar
                  </a>
                </div>
              )}
              <ShareButton title={carTitle(car)} url={carUrl(car)} className="justify-center" />
            </div>
            <p className="mt-4 text-center text-xs text-dim">
              Al tocar el botón se abre WhatsApp con el auto ya escrito en el mensaje.
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:grid lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:px-0">
          <div className="min-w-0">
            <section className="mt-12" aria-labelledby="ficha">
              <h2 id="ficha" className="font-display text-3xl">
                Ficha técnica
              </h2>
              <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {details.map((spec) => (
                  <SpecTile key={spec.label} spec={spec} car={car} />
                ))}
              </dl>
              {missing.length > 0 && (
                <div className="mt-4 flex flex-col gap-4 rounded-3xl bg-wa/10 p-5 ring-1 ring-wa/30 sm:flex-row sm:items-center">
                  <p className="flex-1 text-sm text-fg">
                    <b>{MISSING_INFO_TEXT}</b>
                    <span className="mt-1 block text-mute">Datos por confirmar: {missing.join(", ").toLowerCase()}.</span>
                  </p>
                  <a
                    href={whatsappUrl(infoMessage(car, missing))}
                    target="_blank"
                    rel="noopener"
                    className="btn-shine inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-wa px-5 font-bold text-night active:scale-95"
                  >
                    <WhatsAppIcon className="size-5" /> Preguntar
                  </a>
                </div>
              )}
            </section>

            {car.features.length > 0 && (
              <section className="mt-12" aria-labelledby="destaca">
                <h2 id="destaca" className="font-display text-3xl">
                  Lo que destaca
                </h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {car.features.map((f) => (
                    <li
                      key={f}
                      className="reveal flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2.5 text-sm"
                    >
                      <span className="size-1.5 rotate-45 bg-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {car.description && (
              <section className="mt-12" aria-labelledby="descripcion">
                <h2 id="descripcion" className="font-display text-3xl">
                  Descripción
                </h2>
                <div className="mt-5 rounded-3xl border border-line bg-card p-5 leading-relaxed whitespace-pre-line text-fg/85 sm:p-7">
                  {car.description}
                </div>
              </section>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-16 px-4 pb-8 sm:px-6 lg:px-0" aria-labelledby="similares">
            <h2 id="similares" className="font-display text-3xl sm:text-4xl">
              También te puede gustar
            </h2>
            <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
              {similar.map((c) => (
                <CarCard key={c.id} car={c} className="w-[75vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none" sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 45vw" />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Barra fija en móvil: aparece al pasar el botón principal */}
      <StickyCta targetId="cta-principal">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-mute">
              {carName(car)} {car.year}
            </p>
            <p className="text-lg font-bold">{formatPrice(car.price)}</p>
          </div>
          <a
            href={carWhatsApp(car)}
            target="_blank"
            rel="noopener"
            tabIndex={-1}
            className="btn-shine inline-flex h-12 items-center gap-2 rounded-full bg-wa px-5 font-bold text-night active:scale-95"
          >
            <WhatsAppIcon className="size-5" />
            {sold ? "Similar" : "Lo quiero"}
          </a>
        </div>
      </StickyCta>
      <div className="h-24 lg:hidden" />
    </>
  );
}

type Spec = {
  Icon: typeof Calendar;
  label: string;
  value?: string;
  tone?: "brand" | "volt" | "night";
  wide?: boolean;
};

const TONE: Record<NonNullable<Spec["tone"]>, string> = {
  brand: "bg-brand-soft text-brand-hi",
  volt: "bg-volt text-night",
  night: "bg-night text-white",
};

// Un dato del auto. Si no se tiene, invita a preguntarlo por WhatsApp (nunca se inventa).
function SpecTile({ spec, car, compact }: { spec: Spec; car: Car; compact?: boolean }) {
  const { Icon, label, value, tone = "brand", wide } = spec;
  if (!value) {
    return (
      <a
        href={whatsappUrl(infoMessage(car, [label]))}
        target="_blank"
        rel="noopener"
        className={`group flex items-center gap-3 rounded-2xl bg-wa/10 ring-1 ring-wa/30 transition-transform active:scale-[0.97] ${
          compact ? "p-3" : "p-4"
        }`}
        aria-label={`${label}: ${MISSING_INFO_TEXT}`}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-wa text-night">
          <WhatsAppIcon className="size-5" />
        </span>
        <span className="min-w-0">
          <dt className="font-tech text-[10px] text-wa-dark">{label}</dt>
          <dd className="text-sm leading-tight font-semibold text-fg">Pregúntanos</dd>
        </span>
      </a>
    );
  }
  return (
    <div
      className={`group flex items-center gap-3 rounded-2xl bg-card ring-1 ring-line transition-transform duration-300 hover:-translate-y-0.5 ${
        compact ? "p-3" : "p-4"
      } ${wide ? "col-span-2 sm:col-span-1" : ""}`}
    >
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-6 ${TONE[tone]}`}
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0">
        <dt className="font-tech text-[10px] text-dim">{label}</dt>
        <dd className="leading-tight font-semibold text-fg">{value}</dd>
      </span>
    </div>
  );
}

function CarSkeleton() {
  return (
    <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:px-6 lg:pt-32">
      <div className="skeleton aspect-[4/5] lg:aspect-[5/6] lg:rounded-3xl" />
      <div className="space-y-4 px-4 pt-8 sm:px-6 lg:px-0 lg:pt-0">
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-12 w-3/4 rounded-xl" />
        <div className="skeleton h-10 w-1/2 rounded-xl" />
        <div className="skeleton mt-8 h-14 w-full rounded-full" />
      </div>
    </div>
  );
}

