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
  FileCheck,
  FileText,
  Fuel,
  Gauge,
  ListChecks,
  MapPin,
  MessageCircle,
  Navigation,
  PlayCircle,
  Send,
  Palette,
  Phone,
  Shield,
  ShieldCheck,
  Users,
  Waypoints,
  Wrench,
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

  // Resumen: los datos que más pregunta la gente. Lo que no se tiene no se muestra (pedido del dueño, 29-oct);
  // abajo de la ficha hay un aviso con botón de WhatsApp para preguntarlo.
  const summary: Spec[] = [
    { Icon: Calendar, label: "Año", value: String(car.year) },
    { Icon: Gauge, label: "Kilometraje", value: car.mileage != null ? formatKm(car.mileage) : undefined },
    { Icon: Cog, label: "Transmisión", value: car.transmission },
    { Icon: Fuel, label: "Combustible", value: car.fuel },
  ];
  // Documentos e historial: solo lo que el dueño confirmó en el panel
  const history: Spec[] = [
    { Icon: Users, label: "Dueños", value: car.ownerCount ? (car.ownerCount === 1 ? "Único dueño" : `${car.ownerCount} dueños`) : undefined },
    { Icon: FileText, label: "Factura", value: car.invoice },
    { Icon: Wrench, label: "Servicios", value: car.serviceHistory },
    { Icon: FileCheck, label: "Papeles", value: car.papersInOrder ? "En regla" : undefined },
  ];
  const details: Spec[] = [
    ...summary,
    { Icon: Zap, label: "Motor", value: car.engine },
    { Icon: CarIcon, label: "Tipo", value: car.body },
    { Icon: Waypoints, label: "Tracción", value: car.drivetrain },
    { Icon: Palette, label: "Color", value: car.color },
    { Icon: DoorOpen, label: "Puertas", value: car.doors ? String(car.doors) : undefined },
    { Icon: Shield, label: "Blindaje", value: car.armored ? (car.armorLevel ?? "Sí") : undefined },
    ...history,
    { Icon: MapPin, label: "Ubicación", value: `${site.address.city}, ${site.address.state}` },
  ].filter((spec) => spec.value);
  const quick = summary.slice(1).filter((spec) => spec.value);
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
            <ChevronLeft className="size-4" /> Inventario
          </Link>
          <span>/</span>
          <span className="text-fg/80">{carTitle(car)}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[1.25fr_1fr] lg:items-start lg:gap-10">
          <div className="relative min-w-0">
            <Gallery images={car.images} alt={carTitle(car)} carId={car.id} sold={sold} sections={car.photoSections} />
            <Link
              href="/autos"
              className="absolute top-20 left-4 grid size-11 place-items-center rounded-md bg-card/90 shadow-md backdrop-blur-md active:scale-95 lg:hidden"
              aria-label="Volver al catálogo"
            >
              <ChevronLeft className="size-6" />
            </Link>
          </div>

          {/* Panel de información: todo lo necesario para decidir, con el botón en el primer pantallazo */}
          <div className="relative -mt-4 min-w-0 rounded-t-xl bg-paper px-4 pt-6 sm:px-6 lg:sticky lg:top-24 lg:mt-0 lg:rounded-lg lg:bg-card lg:p-8 lg:ring-1 lg:ring-line">
            <div className="stagger">
              <div className="flex flex-wrap items-center gap-2.5">
                <p className="font-tech flex items-center gap-3 text-[11px] text-dim">
                  <span className="draw-line h-px w-6 rule-accent" />
                  {car.year} · {car.brand}
                </p>
                <StatusBadge status={car.status} />
                {car.armored && (
                  <span className="font-tech inline-flex items-center gap-1 rounded-sm border border-fg/20 px-2 py-1 text-[10px]">
                    <Shield className="size-3 text-brand" aria-hidden="true" /> Blindado
                  </span>
                )}
              </div>
              <h1 className="font-display mt-3 text-[2.4rem] leading-[0.98] sm:text-5xl" style={vars({ "--i": 1 })}>
                {car.model}
                {car.version && (
                  <span className="mt-2 block font-sans text-lg font-normal tracking-normal text-mute sm:text-xl">
                    {car.version}
                  </span>
                )}
              </h1>
              <p
                className={`font-display mt-4 text-[2.2rem] leading-none sm:text-[2.6rem] ${sold ? "text-mute line-through" : ""}`}
                style={vars({ "--i": 2 })}
              >
                {formatPrice(car.price)}
                <span className="font-tech ml-2 align-middle text-[10px] text-dim">MXN</span>
              </p>
            </div>

            {/* Resumen: los datos que más se preguntan; si falta uno, se pregunta con un toque */}
            {quick.length > 0 && (
              <ul
                className={`mt-6 grid divide-x divide-line border-y border-line ${quick.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}
                aria-label="Resumen del auto"
              >
                {/* El año ya va arriba del título */}
                {quick.map((spec) => (
                  <QuickSpec key={spec.label} spec={spec} />
                ))}
              </ul>
            )}
            {(equipmentCount > 0 || video) && (
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
                {equipmentCount > 0 && (
                  <a href="#equipamiento" className="group inline-flex items-center gap-1.5 py-1">
                    <ListChecks className="size-4 text-brand" />
                    <span className="underline decoration-line underline-offset-4 transition-colors group-hover:decoration-fg">
                      Equipamiento ({equipmentCount})
                    </span>
                  </a>
                )}
                {video && (
                  <a href="#video" className="group inline-flex items-center gap-1.5 py-1">
                    <PlayCircle className="size-4 text-brand" />
                    <span className="underline decoration-line underline-offset-4 transition-colors group-hover:decoration-fg">
                      Ver video
                    </span>
                  </a>
                )}
              </div>
            )}

            <div className="mt-6 grid gap-3">
              <a
                id="cta-principal"
                href={carWhatsApp(car)}
                target="_blank"
                rel="noopener"
                className="btn btn-wa btn-shine group h-14 text-base"
              >
                <WhatsAppIcon className="size-6 transition-transform duration-500 group-hover:-rotate-12" />
                {ctaLabel(car)}
              </a>
              <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-mute">
                {FUDS.map((f) => (
                  <li key={f} className="flex items-center gap-1">
                    <Check className="size-3.5 text-brand" strokeWidth={2.5} aria-hidden="true" />
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
                    className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md border border-line bg-card text-sm font-semibold transition-colors hover:border-fg/40"
                  >
                    <CalendarCheck className="size-4" /> Visita
                  </a>
                )}
                <a
                  href={site.phoneHref}
                  className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md border border-line bg-card text-sm font-semibold transition-colors hover:border-fg/40"
                >
                  <Phone className="size-4" /> Llamar
                </a>
                <ShareButton title={carTitle(car)} url={carUrl(car)} />
              </div>
            </div>

            {/* Confianza: lo que es cierto de este auto y del negocio */}
            <ul className="mt-6 divide-y divide-line border-t border-line text-sm">
              <li className="flex gap-3 py-3.5">
                <ShieldCheck className="mt-0.5 size-[1.15rem] shrink-0 text-brand" />
                <span>
                  <b>Auto verificado.</b> <span className="text-mute">Fotos reales de este auto y precio a la vista.</span>
                </span>
              </li>
              {rating.count > 0 && (
                <li>
                  <Link href="/#resenas" className="flex gap-3 py-3.5">
                    <span className="mt-0.5 shrink-0">
                      <Stars value={rating.avg} className="size-3.5" />
                    </span>
                    <span>
                      <b>{rating.avg.toFixed(1)} de 5</b>{" "}
                      <span className="text-mute underline underline-offset-4">
                        en {rating.count} {rating.count === 1 ? "reseña" : "reseñas"} de clientes
                      </span>
                    </span>
                  </Link>
                </li>
              )}
              <li>
                <a href={shareToSomeone} target="_blank" rel="noopener" className="flex gap-3 py-3.5">
                  <Send className="mt-0.5 size-[1.15rem] shrink-0 text-brand" />
                  <span>
                    <b>¿Lo decides con alguien más?</b>{" "}
                    <span className="text-mute underline underline-offset-4">Mándaselo por WhatsApp</span>
                  </span>
                </a>
              </li>
              <li className="flex gap-3 py-3.5">
                <MapPin className="mt-0.5 size-[1.15rem] shrink-0 text-brand" />
                <span>
                  <b>Míralo en persona:</b>{" "}
                  <a href={site.mapsUrl} target="_blank" rel="noopener" className="text-mute underline underline-offset-4">
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
              <section className="mt-14 lg:hidden" aria-labelledby="fotos">
                <SectionTitle id="fotos" eyebrow="Galería">
                  {car.images.length} fotos reales
                </SectionTitle>
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
              <section id="video" className="mt-14 scroll-mt-24" aria-labelledby="video-title">
                <SectionTitle id="video-title" eyebrow="Video">
                  Míralo en video
                </SectionTitle>
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
                      className="flex items-center gap-4 rounded-lg bg-night p-5 text-white transition-transform active:scale-[0.98]"
                    >
                      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-night">
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

            <section className="mt-14" aria-labelledby="ficha">
              <SectionTitle id="ficha" eyebrow="Especificaciones">
                Ficha técnica
              </SectionTitle>
              <dl className="mt-6 overflow-hidden rounded-lg bg-card px-5 ring-1 ring-line sm:grid sm:grid-cols-2 sm:gap-x-10 sm:px-7">
                {details.map((spec, i) => (
                  <SpecRow key={spec.label} spec={spec} i={i} />
                ))}
              </dl>
              {missing.length > 0 && (
                <div className="mt-3 flex flex-col gap-4 rounded-lg bg-card p-5 ring-1 ring-line sm:flex-row sm:items-center">
                  <p className="flex-1 text-sm text-fg">
                    <b>{MISSING_INFO_TEXT}</b>
                    <span className="mt-1 block text-mute">Datos por confirmar: {missing.join(", ").toLowerCase()}.</span>
                  </p>
                  <a
                    href={whatsappUrl(infoMessage(car, missing))}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-wa btn-shine shrink-0"
                  >
                    <WhatsAppIcon className="size-5" /> Preguntar
                  </a>
                </div>
              )}
            </section>

            {equipmentCount > 0 && (
              <section id="equipamiento" className="mt-14 scroll-mt-24" aria-labelledby="equipamiento-title">
                <SectionTitle id="equipamiento-title" eyebrow={`${equipmentCount} elementos`}>
                  Equipamiento
                </SectionTitle>
                <div className="mt-6 space-y-7">
                  {equipment.map(({ group, items }) => (
                    <div key={group}>
                      <h3 className="font-tech text-[11px] text-dim">{group}</h3>
                      <ul className="mt-2 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
                        {items.map(({ key, label, Icon }, i) => (
                          <li
                            key={key}
                            className="reveal flex items-center gap-3 border-b border-line py-3 text-[15px]"
                            style={vars({ "--i": i })}
                          >
                            <Icon className="size-[1.1rem] shrink-0 text-fg/70" strokeWidth={1.75} aria-hidden="true" />
                            <span className="leading-tight">{label}</span>
                            <Check className="ml-auto size-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden="true" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {highlights.length > 0 && (
              <section className="mt-14" aria-labelledby="destaca">
                <SectionTitle id="destaca" eyebrow="Detalles">
                  Lo que destaca
                </SectionTitle>
                <ul className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                  {highlights.map((f, i) => (
                    <li key={f} className="reveal flex items-start gap-3 leading-snug" style={vars({ "--i": i })}>
                      <span className="mt-2 size-1.5 shrink-0 rotate-45 bg-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {car.description && (
              <section className="mt-14" aria-labelledby="descripcion">
                <SectionTitle id="descripcion" eyebrow="Del vendedor">
                  Descripción
                </SectionTitle>
                <div className="mt-6 rounded-lg bg-card p-5 leading-relaxed whitespace-pre-line text-fg/85 ring-1 ring-line sm:p-7">
                  {car.description}
                </div>
              </section>
            )}

            {!sold && <NextSteps car={car} />}

            {reviews.length > 0 && <ReviewSnippets reviews={reviews} />}
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-16 px-4 pb-8 sm:px-6 lg:px-0" aria-labelledby="similares">
            <div className="flex items-end justify-between gap-4">
              <SectionTitle id="similares" eyebrow="Más opciones">
                {sold ? "Te pueden interesar" : "También te puede gustar"}
              </SectionTitle>
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
                <Link href={`/autos?tipo=${encodeURIComponent(car.body)}`} className="btn btn-outline flex-1 text-sm">
                  Ver los {sameType} {TYPE_PLURAL[car.body] ?? car.body}
                </Link>
              )}
              <Link href="/autos" className="btn btn-outline flex-1 text-sm">
                Todo el inventario
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
            <p className="font-display text-xl">{formatPrice(car.price)}</p>
          </div>
          <a
            href={site.phoneHref}
            tabIndex={-1}
            aria-label="Llamar"
            className="grid size-12 shrink-0 place-items-center rounded-md border border-line bg-card active:scale-95"
          >
            <Phone className="size-5" />
          </a>
          <a
            href={carWhatsApp(car)}
            target="_blank"
            rel="noopener"
            tabIndex={-1}
            className="btn btn-wa btn-shine min-h-12 px-5"
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
      <div className="relative overflow-hidden rounded-lg bg-card p-6 ring-1 ring-line sm:p-10">
        <div className="relative max-w-xl">
          <p className="font-tech flex items-center gap-3 text-[11px] text-dim">
            <span className="h-px w-8 rule-accent" />
            Ya no está disponible
          </p>
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
              className="btn btn-wa btn-shine"
            >
              <WhatsAppIcon className="size-5" /> Búscame uno parecido
            </a>
            <Link
              href={brand && sameBrand.length > 1 ? `/autos?marca=${encodeURIComponent(brand)}` : "/autos"}
              className="btn btn-dark"
            >
              {brand && sameBrand.length > 1 ? `Ver los ${sameBrand.length} ${brand}` : "Ver inventario"} <ArrowRight className="size-4" />
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
    <section className="mt-14" aria-labelledby="pasos">
      <SectionTitle id="pasos" eyebrow="Qué sigue">
        Así de fácil
      </SectionTitle>
      <ol className="mt-6 border-t border-line">
        {steps.map(({ Icon, title, text }, i) => (
          <li key={title} className="reveal group flex gap-5 border-b border-line py-5" style={vars({ "--i": i })}>
            <span className="font-display w-10 shrink-0 text-3xl leading-none text-soft-2 transition-colors duration-500 group-hover:text-fg">
              0{i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="flex items-center gap-2 font-semibold">
                <Icon className="size-4 text-brand" aria-hidden="true" />
                {title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-mute">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={carWhatsApp(car)} target="_blank" rel="noopener" className="btn btn-wa btn-shine">
          <WhatsAppIcon className="size-5" /> {ctaLabel(car)}
        </a>
        <a href={site.mapsUrl} target="_blank" rel="noopener" className="btn btn-outline">
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
    <section className="mt-14" aria-labelledby="opiniones">
      <div className="flex items-end justify-between gap-4">
        <SectionTitle id="opiniones" eyebrow="Clientes H3">
          Lo que dicen nuestros clientes
        </SectionTitle>
        <Link href="/#resenas" className="shrink-0 text-sm font-semibold underline underline-offset-4">
          Ver todas
        </Link>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {top.map((r) => (
          <figure key={r.id} className="rounded-lg bg-card p-5 ring-1 ring-line">
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
};

function SectionTitle({ id, eyebrow, children }: { id: string; eyebrow: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-tech flex items-center gap-3 text-[10px] text-dim">
        <span className="h-px w-6 rule-accent" />
        {eyebrow}
      </p>
      <h2 id={id} className="font-display mt-2.5 text-[1.85rem] sm:text-[2.1rem]">
        {children}
      </h2>
    </div>
  );
}

// Dato del resumen (kilometraje, transmisión, combustible). Solo se usa con datos confirmados.
function QuickSpec({ spec }: { spec: Spec }) {
  const { Icon, label, value } = spec;
  return (
    <li className="min-w-0 px-3 py-3.5 first:pl-0 last:pr-0">
      <span className="font-tech flex items-center gap-1.5 text-[9px] text-dim">
        <Icon className="hidden size-3.5 shrink-0 text-brand sm:block" aria-hidden="true" />
        <span className="truncate">{label}</span>
      </span>
      <span className="mt-1.5 block truncate text-[15px] font-semibold">{value}</span>
    </li>
  );
}

// Una fila de la ficha técnica (solo datos confirmados; nunca se inventa)
function SpecRow({ spec, i }: { spec: Spec; i: number }) {
  const { Icon, label, value } = spec;
  return (
    <div
      className="reveal group flex items-center gap-3 border-b border-line py-4 last:border-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-0"
      style={vars({ "--i": i })}
    >
      <Icon
        className="size-[1.1rem] shrink-0 text-dim transition-colors duration-300 group-hover:text-brand"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <dt className="text-sm text-mute">{label}</dt>
      <dd className="ml-auto text-right font-semibold">{value}</dd>
    </div>
  );
}

function CarSkeleton() {
  return (
    <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:px-6 lg:pt-32">
      <div className="skeleton aspect-square lg:aspect-[5/6] lg:rounded-lg" />
      <div className="space-y-4 px-4 pt-8 sm:px-6 lg:px-0 lg:pt-0">
        <div className="skeleton h-4 w-32 rounded-sm" />
        <div className="skeleton h-12 w-3/4 rounded-md" />
        <div className="skeleton h-10 w-1/2 rounded-md" />
        <div className="skeleton mt-8 h-14 w-full rounded-md" />
      </div>
    </div>
  );
}

