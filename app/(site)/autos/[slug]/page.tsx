import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import {
  ArrowRight,
  Calendar,
  CalendarCheck,
  Car as CarIcon,
  Check,
  ChevronLeft,
  Clock,
  Cog,
  DoorOpen,
  Fuel,
  Gauge,
  ListChecks,
  MapPin,
  MessageCircle,
  MessageCircleQuestion,
  Navigation,
  PlayCircle,
  Send,
  Palette,
  Phone,
  Shield,
  ShieldCheck,
  Waypoints,
  Zap,
} from "lucide-react";
import { Gallery, PhotoGrid } from "@/components/car/gallery";
import { ShareButton } from "@/components/car/share-button";
import { YouTubeVideo } from "@/components/car/video";
import { StickyCta } from "@/components/car/sticky-cta";
import { CarCard, StatusBadge } from "@/components/car-card";
import { WhatsAppIcon } from "@/components/icons";
import { Stars } from "@/components/home/reviews";
import { BreadcrumbJsonLd, CarJsonLd } from "@/components/site/json-ld";
import {
  carName,
  carTitle,
  carUrl,
  carWhatsApp,
  ctaLabel,
  formatKm,
  formatPrice,
  infoMessage,
  MISSING_INFO_TEXT,
  missingSpecs,
  parseVideo,
  questionMessage,
  slugify,
  visitMessage,
  type Car,
} from "@/lib/cars";
import { getAllCars, getCarBySlug, getReviews, similarCars } from "@/lib/data";
import { equipmentByGroup, featuresWithoutEquipment } from "@/lib/equipment";
import { reviewSummary, type Review } from "@/lib/reviews";
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
  if (!car) return { title: "Este auto ya no está", robots: { index: false } };
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

const TYPE_PLURAL: Record<string, string> = {
  SUV: "SUVs",
  Pickup: "pickups",
  Deportivo: "deportivos",
  Sedán: "sedanes",
  Coupé: "coupés",
  Hatchback: "hatchbacks",
  Convertible: "convertibles",
  Van: "vans",
  Recreativo: "recreativos",
};

// Lo que quita miedos junto al botón (cierto para cualquier auto del sitio)
const FUDS = ["Te respondemos de inmediato", "El mensaje ya lleva este auto", "Sin registros"];

async function CarDetail({ params }: { params: PageProps<"/autos/[slug]">["params"] }) {
  const { slug } = await params;
  const [car, all, reviews] = await Promise.all([getCarBySlug(slug), getAllCars(), getReviews()]);
  if (!car) return <GoneCar slug={slug} cars={all} />;
  const similar = similarCars(car, all);
  const sold = car.status === "vendido";
  const rating = reviewSummary(reviews);
  const sameType = all.filter((c) => c.status !== "vendido" && c.body === car.body).length;

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
  const video = parseVideo(car.video);
  const equipment = equipmentByGroup(car.equipment);
  const equipmentCount = equipment.reduce((n, g) => n + g.items.length, 0);
  // «Lo que destaca» sin repetir lo que ya está en el equipamiento
  const highlights = featuresWithoutEquipment(car.features, car.equipment);
  // Para mandárselo a la pareja o la familia: WhatsApp sin número, el usuario elige a quién
  const shareToSomeone = `https://wa.me/?text=${encodeURIComponent(
    `Mira este ${carTitle(car)} en ${site.name}: ${formatPrice(car.price)}\n${carUrl(car)}`,
  )}`;

  return (
    <>
      <CarJsonLd car={car} />
      <BreadcrumbJsonLd car={car} />
      <div className="mx-auto max-w-7xl lg:px-6 lg:pt-24">
        <nav aria-label="Migas de pan" className="hidden items-center gap-2 pb-5 text-sm text-mute lg:flex">
          <Link href="/autos" className="inline-flex items-center gap-1 hover:text-fg">
            <ChevronLeft className="size-4" /> Catálogo
          </Link>
          <span>/</span>
          <span className="text-fg/80">{carTitle(car)}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1.25fr_1fr] lg:items-start lg:gap-10">
          <div className="relative min-w-0">
            <Gallery images={car.images} alt={carTitle(car)} carId={car.id} sold={sold} sections={car.photoSections} />
            <Link
              href="/autos"
              className="absolute top-20 left-4 grid size-11 place-items-center rounded-full bg-card/90 shadow-md backdrop-blur-md active:scale-95 lg:hidden"
              aria-label="Volver al catálogo"
            >
              <ChevronLeft className="size-6" />
            </Link>
          </div>

          {/* Panel de información: todo lo necesario para decidir, con el botón en el primer pantallazo */}
          <div className="relative -mt-6 min-w-0 rounded-t-[2rem] bg-paper px-4 pt-6 sm:px-6 lg:sticky lg:top-24 lg:mt-0 lg:rounded-3xl lg:border lg:border-line lg:bg-card lg:p-8">
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
              <h1 className="font-display mt-2 text-[2.4rem] leading-[0.92] sm:text-5xl" style={vars({ "--i": 1 })}>
                {car.model}
                {car.version && <span className="mt-1.5 block text-lg text-fg/60 sm:text-2xl">{car.version}</span>}
              </h1>
              <p
                className={`mt-3 text-[2.1rem] font-bold tracking-tight sm:text-4xl ${sold ? "text-mute line-through" : ""}`}
                style={vars({ "--i": 2 })}
              >
                {formatPrice(car.price)}
                <span className="ml-2 align-middle text-sm font-medium text-dim">MXN</span>
              </p>
            </div>

            {/* Resumen en una línea; si falta un dato, se pregunta con un toque */}
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Resumen del auto">
              {/* El año ya va arriba del título */}
              {summary.slice(1).map((spec) => (
                <QuickChip key={spec.label} spec={spec} car={car} />
              ))}
              {equipmentCount > 0 && (
                <li>
                  <a
                    href="#equipamiento"
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-volt px-3 text-sm font-semibold text-night active:scale-95"
                  >
                    <ListChecks className="size-4" /> Equipamiento ({equipmentCount})
                  </a>
                </li>
              )}
              {video && (
                <li>
                  <a
                    href="#video"
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-night px-3 text-sm font-semibold text-white active:scale-95"
                  >
                    <PlayCircle className="size-4 text-volt" /> Ver video
                  </a>
                </li>
              )}
            </ul>

            <div className="mt-5 grid gap-3">
              <a
                id="cta-principal"
                href={carWhatsApp(car)}
                target="_blank"
                rel="noopener"
                className="btn-shine group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-wa px-6 text-base font-bold text-night shadow-[0_14px_40px_-12px_rgb(37_211_102/0.7)] transition-transform active:scale-[0.97]"
              >
                <WhatsAppIcon className="size-6 transition-transform duration-500 group-hover:-rotate-12" />
                {ctaLabel(car)}
              </a>
              <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-mute">
                {FUDS.map((f) => (
                  <li key={f} className="flex items-center gap-1">
                    <Check className="size-3.5 text-wa-dark" strokeWidth={3} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className={`grid gap-2 ${sold ? "grid-cols-2" : "grid-cols-3"}`}>
                {!sold && (
                  <a
                    href={whatsappUrl(visitMessage(car))}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-line bg-soft text-sm font-semibold transition-colors hover:border-fg/30"
                  >
                    <CalendarCheck className="size-4 text-brand-hi" /> Visita
                  </a>
                )}
                <a
                  href={site.phoneHref}
                  className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-line bg-soft text-sm font-semibold transition-colors hover:border-fg/30"
                >
                  <Phone className="size-4 text-brand-hi" /> Llamar
                </a>
                <ShareButton title={carTitle(car)} url={carUrl(car)} />
              </div>
            </div>

            {/* Confianza: lo que es cierto de este auto y del negocio */}
            <ul className="mt-6 grid gap-3 rounded-2xl bg-card p-4 text-sm ring-1 ring-line lg:bg-paper">
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-wa-dark" />
                <span>
                  <b>Auto verificado.</b> <span className="text-mute">Fotos reales de este auto y precio a la vista.</span>
                </span>
              </li>
              {rating.count > 0 && (
                <li>
                  <Link href="/#resenas" className="flex gap-3">
                    <span className="mt-0.5 shrink-0">
                      <Stars value={rating.avg} className="size-3.5" />
                    </span>
                    <span>
                      <b>{rating.avg.toFixed(1)} de 5</b>{" "}
                      <span className="text-mute underline">
                        en {rating.count} {rating.count === 1 ? "reseña" : "reseñas"} de clientes
                      </span>
                    </span>
                  </Link>
                </li>
              )}
              {!sold && (
                <li>
                  <a href="#dudas" className="flex gap-3">
                    <MessageCircleQuestion className="mt-0.5 size-5 shrink-0 text-brand" />
                    <span>
                      <b>¿Dudas?</b>{" "}
                      <span className="text-mute underline">Dueños, factura, servicios y más, aquí mismo</span>
                    </span>
                  </a>
                </li>
              )}
              <li>
                <a href={shareToSomeone} target="_blank" rel="noopener" className="flex gap-3">
                  <Send className="mt-0.5 size-5 shrink-0 text-wa-dark" />
                  <span>
                    <b>¿Lo decides con alguien más?</b>{" "}
                    <span className="text-mute underline">Mándaselo por WhatsApp</span>
                  </span>
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-brand" />
                <span>
                  <b>Míralo en persona:</b>{" "}
                  <a href={site.mapsUrl} target="_blank" rel="noopener" className="text-mute underline">
                    {site.address.street}, {site.address.city}
                  </a>
                  <span className="block text-mute">{site.hours}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:grid lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:px-0">
          <div className="min-w-0">
            {car.images.length > 1 && (
              <section className="mt-12 lg:hidden" aria-labelledby="fotos">
                <h2 id="fotos" className="font-display text-3xl">
                  {car.images.length} fotos <span className="text-brand">reales</span>
                </h2>
                <p className="mt-1 text-sm text-mute">
                  Todas son de este auto.{" "}
                  {car.photoSections && Object.keys(car.photoSections).length > 0
                    ? "Elige exterior, interior o motor, y toca una para verla completa."
                    : "Toca una para verla completa."}
                </p>
                <div className="mt-5">
                  <PhotoGrid images={car.images} alt={carTitle(car)} sold={sold} sections={car.photoSections} />
                </div>
              </section>
            )}

            {video && (
              <section id="video" className="mt-12 scroll-mt-24" aria-labelledby="video-title">
                <h2 id="video-title" className="font-display text-3xl">
                  Míralo en <span className="text-brand">video</span>
                </h2>
                <div className="mt-5">
                  {video.kind === "youtube" ? (
                    <YouTubeVideo
                      id={video.id}
                      title={carTitle(car)}
                      cover={car.images[0]}
                      vertical={video.url.includes("/shorts/")}
                    />
                  ) : (
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-4 rounded-3xl bg-night p-5 text-white transition-transform active:scale-[0.98]"
                    >
                      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-brand">
                        <PlayCircle className="size-7" />
                      </span>
                      <span>
                        <span className="block font-semibold">Ver el video en {video.platform}</span>
                        <span className="text-sm text-white/70">Se abre en la app o en una pestaña nueva.</span>
                      </span>
                    </a>
                  )}
                </div>
              </section>
            )}

            <section className="mt-12" aria-labelledby="ficha">
              <h2 id="ficha" className="font-display text-3xl">
                Ficha técnica
              </h2>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {details.map((spec) => (
                  <SpecTile key={spec.label} spec={spec} car={car} />
                ))}
              </ul>
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

            {equipmentCount > 0 && (
              <section id="equipamiento" className="mt-12 scroll-mt-24" aria-labelledby="equipamiento-title">
                <h2 id="equipamiento-title" className="font-display text-3xl">
                  Equipamiento
                </h2>
                <div className="mt-5 space-y-5">
                  {equipment.map(({ group, items }) => (
                    <div key={group}>
                      <h3 className="font-tech flex items-center gap-2 text-xs text-brand-hi">
                        <span className="h-0.5 w-5 skew-x-[-20deg] bg-brand" />
                        {group}
                      </h3>
                      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {items.map(({ key, label, Icon }) => (
                          <li key={key} className="reveal flex items-center gap-2.5 rounded-2xl bg-card p-3 text-sm font-medium ring-1 ring-line">
                            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-volt-soft text-fg" aria-hidden="true">
                              <Icon className="size-[1.1rem]" />
                            </span>
                            <span className="leading-tight">{label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {highlights.length > 0 && (
              <section className="mt-12" aria-labelledby="destaca">
                <h2 id="destaca" className="font-display text-3xl">
                  Lo que destaca
                </h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {highlights.map((f) => (
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

            {!sold && <CarQuestions car={car} />}

            {!sold && <NextSteps car={car} />}

            {reviews.length > 0 && <ReviewSnippets reviews={reviews} />}
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-16 px-4 pb-8 sm:px-6 lg:px-0" aria-labelledby="similares">
            <div className="flex items-end justify-between gap-4">
              <h2 id="similares" className="font-display text-3xl sm:text-4xl">
                {sold ? "Te pueden interesar" : "También te puede gustar"}
              </h2>
              {sameType > 1 && (
                <Link
                  href={`/autos?tipo=${encodeURIComponent(car.body)}`}
                  className="group hidden shrink-0 items-center gap-2 text-sm font-semibold text-fg/80 hover:text-fg sm:inline-flex"
                >
                  Ver los {sameType} {TYPE_PLURAL[car.body] ?? car.body}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
            <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
              {similar.map((c) => (
                <CarCard key={c.id} car={c} className="w-[75vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none" sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 75vw" />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 sm:hidden">
              {sameType > 1 && (
                <Link
                  href={`/autos?tipo=${encodeURIComponent(car.body)}`}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-card text-sm font-semibold"
                >
                  Ver los {sameType} {TYPE_PLURAL[car.body] ?? car.body}
                </Link>
              )}
              <Link
                href="/autos"
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-card text-sm font-semibold"
              >
                Todo el catálogo
              </Link>
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
            href={site.phoneHref}
            tabIndex={-1}
            aria-label="Llamar"
            className="grid size-12 shrink-0 place-items-center rounded-full border border-line bg-card active:scale-95"
          >
            <Phone className="size-5 text-brand-hi" />
          </a>
          <a
            href={carWhatsApp(car)}
            target="_blank"
            rel="noopener"
            tabIndex={-1}
            className="btn-shine inline-flex h-12 items-center gap-2 rounded-full bg-wa px-5 font-bold text-night active:scale-95"
          >
            <WhatsAppIcon className="size-5" />
            {ctaLabel(car, true)}
          </a>
        </div>
      </StickyCta>
      <div className="h-24 lg:hidden" />
    </>
  );
}

// Auto borrado o enlace viejo (por ejemplo, compartido por WhatsApp hace meses): en vez de un
// error, se ofrecen autos de la misma marca (se deduce del enlace) o los más recientes.
function GoneCar({ slug, cars }: { slug: string; cars: Car[] }) {
  const available = cars.filter((c) => c.status !== "vendido");
  const brand = [...new Set(available.map((c) => c.brand))].find((b) => slug.startsWith(`${slugify(b)}-`));
  const sameBrand = brand ? available.filter((c) => c.brand === brand) : [];
  const picks = (sameBrand.length ? sameBrand : available).slice(0, 4);
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return (
    <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-card p-6 ring-1 ring-line sm:p-10">
        <div className="speed-lines pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative max-w-xl">
          <p className="font-tech text-xs text-brand-hi">Ya no está disponible</p>
          <h1 className="font-display mt-3 text-4xl sm:text-5xl">Este auto ya no está</h1>
          <p className="mt-4 text-lg leading-relaxed text-mute">
            Puede que ya tenga nuevo dueño.{" "}
            {sameBrand.length > 0
              ? `Mira los ${brand} que tenemos hoy, o dinos qué buscas y te ayudamos.`
              : "Mira lo que tenemos hoy, o dinos qué buscas y te ayudamos."}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={whatsappUrl(`Hola ${site.name} 👋 Buscaba un auto que vi en su página (${name}) y ya no está. ¿Tienen algo parecido?`)}
              target="_blank"
              rel="noopener"
              className="btn-shine inline-flex h-14 items-center gap-2 rounded-full bg-wa px-6 font-bold text-night active:scale-95"
            >
              <WhatsAppIcon className="size-5" /> Búscame uno parecido
            </a>
            <Link
              href={brand && sameBrand.length > 1 ? `/autos?marca=${encodeURIComponent(brand)}` : "/autos"}
              className="inline-flex h-14 items-center gap-2 rounded-full bg-night px-6 font-semibold text-white active:scale-95"
            >
              {brand && sameBrand.length > 1 ? `Ver los ${sameBrand.length} ${brand}` : "Ver catálogo"} <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
      {picks.length > 0 && (
        <section className="mt-12" aria-labelledby="parecidos">
          <h2 id="parecidos" className="font-display text-3xl">
            {sameBrand.length ? `${brand} disponibles` : "Disponibles hoy"}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {picks.map((c) => (
              <CarCard key={c.id} car={c} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 92vw" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Las dudas de siempre, contestadas con los datos del auto. Si falta un dato, se pregunta con un toque
// (el mensaje lleva la pregunta exacta). Nunca se inventa una respuesta.
function CarQuestions({ car }: { car: Car }) {
  const invoice = { Original: "Factura original.", "De empresa": "Factura de empresa.", Refacturada: "Refacturada." };
  const items: { q: string; a?: ReactNode }[] = [
    {
      q: "¿Sigue disponible?",
      a:
        car.status === "apartado"
          ? "Está apartado. Si se libera, te avisamos."
          : "Sí, está a la venta. Escríbenos y te lo confirmamos al momento.",
    },
    { q: "¿Cuántos kilómetros tiene?", a: car.mileage != null ? formatKm(car.mileage) : undefined },
    {
      q: "¿Es automático o estándar?",
      a: car.transmission === "Automática" ? "Automático." : car.transmission === "Manual" ? "Estándar (manual)." : undefined,
    },
    {
      q: "¿Cuántos dueños ha tenido?",
      a: car.ownerCount === 1 ? "Único dueño." : car.ownerCount ? `${car.ownerCount} dueños.` : undefined,
    },
    { q: "¿Qué factura tiene?", a: car.invoice ? invoice[car.invoice] : undefined },
    {
      q: "¿Tiene sus servicios?",
      a: car.serviceHistory ? `Sí, servicios ${car.serviceHistory === "De agencia" ? "de agencia" : "al día"}.` : undefined,
    },
    { q: "¿Los papeles están en regla?", a: car.papersInOrder ? "Sí, papeles en regla." : undefined },
    ...(car.armored ? [{ q: "¿Qué nivel de blindaje tiene?", a: car.armorLevel ? `${car.armorLevel}.` : undefined }] : []),
    {
      q: "¿Dónde lo puedo ver?",
      a: (
        <>
          {site.address.street}, {site.address.city}. {site.hours}.{" "}
          <a href={site.mapsUrl} target="_blank" rel="noopener" className="font-semibold text-brand-hi underline">
            Cómo llegar
          </a>
        </>
      ),
    },
  ];
  return (
    <section id="dudas" className="mt-12 scroll-mt-24" aria-labelledby="dudas-title">
      <h2 id="dudas-title" className="font-display text-3xl">
        Tus dudas, <span className="text-brand">resueltas</span>
      </h2>
      <p className="mt-1 text-sm text-mute">Lo que más nos preguntan de este auto. Si algo falta, pregúntalo con un toque.</p>
      <dl className="mt-5 divide-y divide-line overflow-hidden rounded-3xl bg-card ring-1 ring-line">
        {items.map(({ q, a }) => (
          <div key={q} className="flex flex-col gap-1.5 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5">
            <dt className="font-semibold">{q}</dt>
            <dd className="text-fg/80 sm:text-right">
              {a ?? (
                <a
                  href={whatsappUrl(questionMessage(car, q))}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-wa/15 px-3 text-sm font-semibold text-fg active:scale-95"
                >
                  <WhatsAppIcon className="size-4 text-wa-dark" /> Pregúntanos<span className="sr-only"> por WhatsApp</span>
                </a>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// Qué pasa después de tocar el botón: que se vea fácil y seguro
function NextSteps({ car }: { car: Car }) {
  const steps = [
    {
      Icon: MessageCircle,
      title: "Escríbenos",
      text: `Toca «${ctaLabel(car)}»: el mensaje ya lleva este ${car.model}, su precio y el enlace.`,
    },
    {
      Icon: Clock,
      title: "Te respondemos de inmediato",
      text: "Te confirmamos si sigue disponible y cualquier dato que quieras saber.",
    },
    {
      Icon: MapPin,
      title: "Ven a conocerlo",
      text: `${site.address.street}, ${site.address.neighborhood}, ${site.address.city}. ${site.hours}.`,
    },
  ];
  return (
    <section className="mt-12" aria-labelledby="pasos">
      <h2 id="pasos" className="font-display text-3xl">
        Así de <span className="text-brand">fácil</span>
      </h2>
      <ol className="relative mt-5 grid gap-3">
        <span className="absolute top-8 bottom-8 left-[1.85rem] w-0.5 bg-gradient-to-b from-brand to-volt" aria-hidden="true" />
        {steps.map(({ Icon, title, text }, i) => (
          <li key={title} className="reveal relative flex gap-4 rounded-2xl border border-line bg-card p-4" style={vars({ "--i": i })}>
            <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white">
              <Icon className="size-5" />
              <span className="font-display absolute -top-2 -right-2 grid size-6 -skew-x-6 place-items-center rounded-md bg-volt text-xs text-night">
                {i + 1}
              </span>
            </span>
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-mute">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={carWhatsApp(car)}
          target="_blank"
          rel="noopener"
          className="btn-shine inline-flex h-12 items-center gap-2 rounded-full bg-wa px-5 font-bold text-night active:scale-95"
        >
          <WhatsAppIcon className="size-5" /> {ctaLabel(car)}
        </a>
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-card px-5 font-semibold"
        >
          <Navigation className="size-4" /> Cómo llegar
        </a>
      </div>
    </section>
  );
}

// Dos reseñas reales cerca del momento de decidir (solo si el dueño agregó alguna)
function ReviewSnippets({ reviews }: { reviews: Review[] }) {
  const top = [...reviews].sort((a, b) => b.stars - a.stars).slice(0, 2);
  return (
    <section className="mt-12" aria-labelledby="opiniones">
      <div className="flex items-end justify-between gap-4">
        <h2 id="opiniones" className="font-display text-3xl">
          Lo que dicen <span className="text-brand">nuestros clientes</span>
        </h2>
        <Link href="/#resenas" className="shrink-0 text-sm font-semibold text-brand-hi underline">
          Ver todas
        </Link>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {top.map((r) => (
          <figure key={r.id} className="rounded-2xl bg-card p-5 ring-1 ring-line">
            <Stars value={r.stars} />
            {r.highlight && <p className="mt-2 font-semibold">«{r.highlight}»</p>}
            <blockquote className="mt-2 line-clamp-4 text-sm leading-relaxed text-fg/80">{r.text}</blockquote>
            <figcaption className="mt-3 text-sm">
              <b>{r.name}</b>
              {r.car && <span className="text-mute"> · {r.car}</span>}
              {r.source && <span className="text-mute"> · {r.source === "En persona" ? "En persona" : `Reseña de ${r.source}`}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
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

// Dato del resumen en forma de chip. Si falta, el chip pregunta por WhatsApp.
function QuickChip({ spec, car }: { spec: Spec; car: Car }) {
  const { Icon, label, value, tone = "brand" } = spec;
  if (!value) {
    return (
      <li>
        <a
          href={whatsappUrl(infoMessage(car, [label]))}
          target="_blank"
          rel="noopener"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-wa/15 px-3 text-sm font-semibold text-fg active:scale-95"
        >
          <WhatsAppIcon className="size-4 text-wa-dark" /> {label}: pregúntanos
          <span className="sr-only"> por WhatsApp</span>
        </a>
      </li>
    );
  }
  return (
    <li
      className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold ${
        tone === "volt" ? "bg-volt text-night" : "bg-card text-fg ring-1 ring-line"
      }`}
    >
      <Icon className={`size-4 ${tone === "volt" ? "" : "text-brand"}`} aria-hidden="true" />
      <span className="sr-only">{label}: </span>
      {value}
    </li>
  );
}

// Un dato del auto. Si no se tiene, invita a preguntarlo por WhatsApp (nunca se inventa).
function SpecTile({ spec, car }: { spec: Spec; car: Car }) {
  const { Icon, label, value, tone = "brand", wide } = spec;
  if (!value) {
    return (
      <li>
        <a
          href={whatsappUrl(infoMessage(car, [label]))}
          target="_blank"
          rel="noopener"
          className="group flex h-full items-center gap-3 rounded-2xl bg-wa/10 p-4 ring-1 ring-wa/30 transition-transform active:scale-[0.97]"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-wa text-night">
            <WhatsAppIcon className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="font-tech block text-[10px] text-fg/75">{label}</span>
            <span className="block text-sm leading-tight font-semibold text-fg">
              Pregúntanos<span className="sr-only"> por WhatsApp</span>
            </span>
          </span>
        </a>
      </li>
    );
  }
  return (
    <li
      className={`group flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-line transition-transform duration-300 hover:-translate-y-0.5 ${
        wide ? "col-span-2 sm:col-span-1" : ""
      }`}
    >
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-6 ${TONE[tone]}`}
        aria-hidden="true"
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="font-tech block text-[10px] text-dim">{label}</span>
        <span className="block leading-tight font-semibold text-fg">{value}</span>
      </span>
    </li>
  );
}

function CarSkeleton() {
  return (
    <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:px-6 lg:pt-32">
      <div className="skeleton aspect-square lg:aspect-[5/6] lg:rounded-3xl" />
      <div className="space-y-4 px-4 pt-8 sm:px-6 lg:px-0 lg:pt-0">
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-12 w-3/4 rounded-xl" />
        <div className="skeleton h-10 w-1/2 rounded-xl" />
        <div className="skeleton mt-8 h-14 w-full rounded-full" />
      </div>
    </div>
  );
}

