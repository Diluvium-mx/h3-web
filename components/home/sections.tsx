import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  CircleDollarSign,
  FileCheck,
  FileText,
  Gauge,
  Headset,
  MessageCircle,
  Navigation,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  UserX,
  X,
} from "lucide-react";
import { CarCard } from "@/components/car-card";
import { CategoryTileContent, categoryTileClass } from "@/components/category-tile";
import { SectionHeading } from "@/components/section-heading";
import { SOCIALS } from "@/components/site/footer";
import { WhatsAppIcon } from "@/components/icons";
import { FUDS, GENERAL_MESSAGE, countTypes, type Rating } from "@/components/home/hero";
import { Stars } from "@/components/home/reviews";
import { CarTour, type TourFrame } from "@/components/home/car-tour";
import { MessageWrites } from "@/components/home/message-writes";
import { carTitle, carWhatsApp, formatKm, formatPrice, type Car } from "@/lib/cars";
import { site, whatsappUrl } from "@/lib/site";
import { vars } from "@/lib/ui";

function CtaLink({ href, children, light }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <Link href={href} className={`btn btn-shine group ${light ? "btn-light" : "btn-dark"}`}>
      {children}
      <ArrowRight className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
    </Link>
  );
}

function WhatsAppCta({ message, children }: { message: string; children: ReactNode }) {
  return (
    <a href={whatsappUrl(message)} target="_blank" rel="noopener" className="btn btn-wa btn-shine group">
      <WhatsAppIcon className="size-5 transition-transform duration-500 group-hover:-rotate-12" />
      {children}
    </a>
  );
}

// Palomita verde en círculo (pedido del dueño: verde en lugar de rojo)
function OkMark({ className = "" }: { className?: string }) {
  return (
    <span className={`grid size-6 shrink-0 place-items-center rounded-full bg-ok text-white ${className}`} aria-hidden="true">
      <Check className="size-3.5" strokeWidth={3} />
    </span>
  );
}

const VISIT_MESSAGE = `Hola ${site.name} 👋 Me gustaría agendar una cita para ver un auto. ¿Qué días tienen disponibles?`;
const SELL_MESSAGE = `Hola ${site.name} 👋 Quiero vender mi auto. ¿Cómo funciona?`;

// ---------- Beneficios divididos en 2: al comprar y al vender (dato del dueño, 30-oct) ----------

const BUY_BENEFITS = [
  { Icon: Headset, title: "Asesoramiento", text: "Te orientamos para elegir el auto que de verdad te conviene." },
  { Icon: ShieldCheck, title: "Autos confiables", text: "Ya verificados, validados y probados antes de publicarse." },
  {
    Icon: FileCheck,
    title: "Papeles en regla",
    text: "Papeles originales, documentación en regla y te ayudamos con el papeleo.",
  },
  {
    Icon: CircleDollarSign,
    title: "Precio justo",
    text: "No tenemos lote: nuestros costos son menores que los de un lote de autos.",
  },
];

const SELL_BENEFITS = [
  { Icon: TrendingUp, title: "Ganas más que en un lote", text: "Sácale más valor a tu vehículo." },
  { Icon: ShieldCheck, title: "Evita estafas", text: "Filtramos a los interesados por ti." },
  { Icon: UserX, title: "Sin citas con desconocidos", text: "Nosotros nos encargamos de las citas." },
  { Icon: FileText, title: "Papeleo y placas", text: "Te ayudamos con el papeleo, el trámite y la baja de las placas." },
  { Icon: Gauge, title: "Precio correcto", text: "Una evaluación correcta de tu auto." },
];

function BenefitList({ items, dark }: { items: typeof BUY_BENEFITS; dark?: boolean }) {
  return (
    <ul className="mt-7 space-y-5">
      {items.map(({ Icon, title, text }, i) => (
        <li key={title} className="reveal group flex gap-4" style={vars({ "--i": i })}>
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-md transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 ${
              dark ? (i === 0 ? "bg-ok text-white" : "bg-white/[0.08] text-white ring-1 ring-white/10") : "bg-night text-white"
            }`}
          >
            <Icon className="size-5" strokeWidth={1.75} />
          </span>
          <div>
            <h4 className="font-semibold">{title}</h4>
            <p className={`mt-0.5 text-sm leading-relaxed ${dark ? "text-white/65" : "text-mute"}`}>{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Benefits() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="beneficios">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="beneficios" title="Lo que hacemos por ti" />
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <article className="reveal flex flex-col rounded-lg bg-card p-6 ring-1 ring-line sm:p-9" aria-labelledby="al-comprar">
            <h3 id="al-comprar" className="font-display text-[1.9rem] sm:text-4xl">
              Al comprar un auto
            </h3>
            <BenefitList items={BUY_BENEFITS} />
            <div className="mt-auto pt-9">
              <CtaLink href="/autos">Ver autos disponibles</CtaLink>
            </div>
          </article>
          <article
            className="reveal glow-night relative flex flex-col overflow-hidden rounded-lg p-6 text-white sm:p-9"
            style={vars({ "--i": 1 })}
            aria-labelledby="al-vender"
          >
            <h3 id="al-vender" className="font-display relative text-[1.9rem] sm:text-4xl">
              Al vender tu auto
            </h3>
            <div className="relative">
              <BenefitList items={SELL_BENEFITS} dark />
            </div>
            <div className="relative mt-auto flex flex-wrap gap-3 pt-9">
              <CtaLink href="/vende-tu-auto" light>
                Vender mi auto
              </CtaLink>
              <WhatsAppCta message={SELL_MESSAGE}>Preguntar</WhatsAppCta>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

// ---------- Inventario: categorías con ícono y 8 autos en 2 columnas ----------

export function Inventory({ cars, featured }: { cars: Car[]; featured: Car[] }) {
  const tiles = countTypes(cars);

  return (
    <section className="pt-16 pb-16 sm:pt-24 sm:pb-24" aria-labelledby="destacados">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="destacados"
          eyebrow="Inventario"
          title="Autos listos para manejar"
          action={{ href: "/autos", label: "Ver todos" }}
        />
      </div>
      <nav
        aria-label="Explora por tipo"
        className="no-scrollbar mb-8 flex snap-x scroll-px-4 gap-3.5 overflow-x-auto px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:mx-auto lg:max-w-7xl"
      >
        {tiles.map(([t, count], i) => (
          <Link
            key={t}
            href={`/autos?tipo=${encodeURIComponent(t)}`}
            className={`reveal ${categoryTileClass()}`}
            style={vars({ "--i": i })}
          >
            <CategoryTileContent type={t} count={count} />
          </Link>
        ))}
      </nav>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:gap-4 sm:px-6 lg:grid-cols-4">
        {featured.slice(0, 8).map((car, i) => (
          <div key={car.id} className="reveal" style={vars({ "--i": i % 4 })}>
            <CarCard car={car} sizes="(min-width: 1024px) 24vw, 50vw" className="h-full" />
          </div>
        ))}
      </div>
      <div className="mt-8 px-4 text-center sm:px-6">
        <Link href="/autos" className="btn btn-dark btn-shine group w-full sm:w-auto">
          Ver todos
          <ArrowRight className="size-4 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

// ---------- Compra tu auto: carrusel de autos verificados ----------

export function BuySection({ cars }: { cars: Car[] }) {
  const withPhoto = cars.filter((c) => c.images[0]).slice(0, 8);
  if (!withPhoto.length) return null;
  return (
    <section className="overflow-hidden bg-card py-20 sm:py-28" aria-labelledby="compra">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <h2 id="compra" className="font-display max-w-xl text-[2.1rem] sm:text-5xl">
              Verificados, probados y con sus papeles en regla.
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-mute">
            Toca el que te guste y te agendamos una cita para que lo veas en persona.
            <span className="mt-1 block text-sm text-dim lg:hidden">Desliza para ver más →</span>
          </p>
        </div>
      </div>
      {/* Carrusel de tarjetas grandes: se desliza hacia la derecha */}
      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:scroll-px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
        {withPhoto.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            variant="foto"
            className="reveal reveal-zoom w-[80vw] max-w-[360px] shrink-0 snap-start"
            sizes="(min-width: 640px) 360px, 80vw"
          />
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
        <CtaLink href="/autos">Ver todo el inventario</CtaLink>
      </div>
    </section>
  );
}

// ---------- Vende tu auto: imagen, cómo funciona y botones ----------

const SELL_STEPS = [
  { title: "Cuéntanos de tu auto", text: "Marca, modelo, año y fotos. Toma un minuto." },
  { title: "Te damos una evaluación correcta", text: "Te decimos cuánto vale tu auto." },
  { title: "Nos encargamos de la venta", text: "Filtramos a los interesados, agendamos las citas y te ayudamos con el papeleo." },
];

export function SellSection() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="vende">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="reveal reveal-zoom relative">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-soft shadow-[0_30px_60px_-34px_rgb(20_20_20/0.55)]">
            <Image
              src="/img/vende-tu-auto.webp"
              alt="Llave de un auto junto a una carpeta de documentos y una pluma: vender tu auto con el papeleo en orden"
              fill
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="object-cover"
            />
          </div>
          {/* Lo más importante para quien vende, encima de la foto */}
          <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-md bg-night px-4 py-3 text-white shadow-[0_18px_40px_-18px_rgb(20_20_20/0.7)] sm:left-6">
            <TrendingUp className="size-5 text-wa" />
            <p className="text-sm leading-tight">
              <b className="block font-semibold">Ganas más que en un lote</b>
              <span className="text-white/70">Nosotros nos encargamos de lo difícil</span>
            </p>
          </div>
        </div>
        <div className="reveal pt-6 lg:pt-0">
          <p className="font-tech flex items-center gap-3 text-[11px] text-dim">
            <span className="rule-accent h-px w-8" />
            Vende tu auto
          </p>
          <h2 id="vende" className="font-display mt-4 text-[2.1rem] sm:text-5xl">
            Sácale más valor a tu vehículo.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-mute">
            Vendiéndolo con nosotros normalmente ganas más que vendiéndolo a un lote de autos, sin exponerte a
            estafas ni a citas con desconocidos.
          </p>
          <ol className="mt-8 space-y-4">
            {SELL_STEPS.map(({ title, text }, i) => (
              <li key={title} className="reveal flex gap-4" style={vars({ "--i": i })}>
                <span className="font-display grid size-9 shrink-0 place-items-center rounded-full bg-night text-sm text-white">
                  {i + 1}
                </span>
                <span>
                  <b className="block font-semibold">{title}</b>
                  <span className="text-sm leading-relaxed text-mute">{text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-9 flex flex-wrap gap-3">
            <CtaLink href="/vende-tu-auto">Vender mi auto</CtaLink>
            <WhatsAppCta message={SELL_MESSAGE}>Preguntar</WhatsAppCta>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Dolor → solución: «lo de siempre» contra «en H3» ----------

const OLD_VS_H3 = [
  { old: "Precio «por inbox»", h3: "Precio a la vista en cada auto" },
  { old: "Fotos de internet o de otro auto", h3: "Fotos reales del auto que vas a ver" },
  { old: "Papeles dudosos", h3: "Papeles originales y documentación en regla" },
  { old: "Costos de lote en el precio", h3: "Sin lote: costos menores y precio justo" },
  { old: "Mensajes en visto", h3: "Te respondemos de inmediato por WhatsApp" },
];

export function Comparison() {
  return (
    <section className="bg-card py-20 sm:py-28" aria-labelledby="diferencia">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="reveal">
          <h2 id="diferencia" className="font-display text-[2.1rem] sm:text-5xl">
            Compra con certeza, no a ciegas.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-mute">
            Precios que solo te dan por mensaje, fotos que no son del auto y papeles dudosos hacen perder tiempo y
            confianza. En H3 lo hacemos diferente.
          </p>
          <div className="mt-8 hidden lg:block">
            <CtaLink href="/autos">Ver autos disponibles</CtaLink>
          </div>
        </div>
        <ul className="space-y-3">
          {OLD_VS_H3.map((row, i) => (
            <li
              key={row.h3}
              className="reveal flex items-center gap-4 rounded-lg bg-paper p-4 ring-1 ring-line transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 sm:p-5"
              style={vars({ "--i": i })}
            >
              <OkMark className="size-8" />
              <span className="min-w-0">
                <span className="block font-semibold leading-snug sm:text-lg">{row.h3}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-dim">
                  <X className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="line-through decoration-dim/60">{row.old}</span>
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div className="lg:hidden">
          <CtaLink href="/autos">Ver autos disponibles</CtaLink>
        </div>
      </div>
    </section>
  );
}

// ---------- Recorrido de un auto con el scroll (versión 1) ----------

// Se usa el auto del hero (BMW M3) mientras esté publicado; si no, el primer destacado con fotos de
// exterior e interior.
const TOUR_SLUG = "bmw-m3-2018";
// Fotos de interior elegidas para el M3 (asientos y detalle del asiento M); si cambian, se usan las primeras
const TOUR_INTERIOR = [7, 9];

export function Tour({ cars }: { cars: Car[] }) {
  const split = (c: Car) => {
    const interior = c.images.filter((u) => c.photoSections?.[u] === "interior");
    const exterior = c.images.filter((u) => c.photoSections?.[u] !== "interior");
    return { exterior, interior };
  };
  const ok = (c: Car) => c.status !== "vendido" && split(c).exterior.length >= 2 && split(c).interior.length >= 2;
  const car = cars.find((c) => c.slug === TOUR_SLUG && ok(c)) ?? cars.find(ok);
  if (!car) return null;
  const { exterior, interior } = split(car);
  const pick = (i: number, fallback: number) =>
    interior[car.slug === TOUR_SLUG && interior[i] ? i : Math.min(fallback, interior.length - 1)];
  const facts = [car.year, car.mileage != null && formatKm(car.mileage), car.transmission].filter(Boolean).join(" · ");
  const frames: TourFrame[] = [
    { src: exterior[0], label: "Exterior", title: `${car.brand} ${car.model}`, text: facts },
    {
      src: exterior[Math.min(4, exterior.length - 1)],
      label: "Exterior",
      title: "Fotos reales, de este auto.",
      text: "Así se ve hoy. Nada de fotos de catálogo.",
    },
    {
      src: pick(TOUR_INTERIOR[0], 0),
      label: "Interior",
      title: "Por dentro.",
      text: "Verificado y probado, con papeles originales y documentación en regla.",
    },
    {
      src: pick(TOUR_INTERIOR[1], 1),
      label: "Interior",
      title: formatPrice(car.price),
      text: "Escríbenos y te agendamos una cita para que lo veas en persona.",
    },
  ];
  return (
    <CarTour frames={frames} alt={carTitle(car)} slug={car.slug} price={formatPrice(car.price)} waHref={carWhatsApp(car)} />
  );
}

// ---------- Movimiento firma (versión 1): el mensaje se escribe solo ----------

export function Signature({ featured }: { featured: Car[] }) {
  const car = featured.find((c) => c.images[0] && c.status === "disponible");
  if (!car) return null;
  return (
    <MessageWrites
      title={carTitle(car)}
      price={formatPrice(car.price)}
      image={car.images[0]}
      host={site.url.replace(/^https?:\/\//, "")}
      message={`Hola ${site.name} 👋 Me interesa el ${carTitle(car)} (${formatPrice(car.price)}) que vi en su página. ¿Sigue disponible?`}
      href={carWhatsApp(car)}
      brandName={site.name}
    />
  );
}

// ---------- Cómo funciona: los autos se ven con cita ----------

const STEPS = [
  { Icon: Search, title: "Elige el tuyo", text: "Filtra por tipo, marca, precio y año. Cada auto tiene fotos reales, precio y ficha." },
  { Icon: MessageCircle, title: "Escríbenos", text: "Toca «Me interesa»: el mensaje ya lleva el auto. Te respondemos de inmediato." },
  {
    Icon: CalendarCheck,
    title: "Agenda tu cita",
    text: "No tenemos lote: te agendamos una cita para que veas el auto en persona.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-card py-20 sm:py-28" aria-labelledby="como-funciona">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="como-funciona" title="Tu próximo auto en 3 pasos." />
        <ol className="relative grid gap-8 md:grid-cols-3 md:gap-10">
          {/* Línea que une los pasos (vertical en celular, horizontal en computadora) */}
          <span className="absolute top-6 bottom-6 left-6 w-px bg-line md:hidden" aria-hidden="true" />
          <span className="absolute top-6 right-[16%] left-[16%] hidden h-px bg-line md:block" aria-hidden="true" />
          {STEPS.map(({ Icon, title, text }, i) => (
            <li key={title} className="reveal group relative flex gap-5 md:block" style={vars({ "--i": i })}>
              <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-night text-white ring-8 ring-card transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 md:mx-auto">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <div className="md:mt-5 md:text-center">
                <p className="text-xs font-semibold text-dim">Paso {i + 1}</p>
                <h3 className="font-display mt-1 text-xl">{title}</h3>
                <p className="mt-2 leading-relaxed text-mute">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <CtaLink href="/autos">Ver autos</CtaLink>
          <WhatsAppCta message={VISIT_MESSAGE}>Agendar cita</WhatsAppCta>
        </div>
      </div>
    </section>
  );
}

// ---------- Más prueba social: autos que ya se vendieron ----------

export function SoldStrip({ cars }: { cars: Car[] }) {
  if (!cars.length) return null;
  return (
    <section className="py-16" aria-labelledby="vendidos">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="vendidos" title="Recién vendidos" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cars.slice(0, 4).map((car) => (
            <CarCard key={car.id} car={car} sizes="(min-width: 640px) 25vw, 50vw" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Preguntas frecuentes ----------

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "¿Cómo sé si un auto sigue disponible?",
    a: (
      <>
        Si está en el inventario, está a la venta; si dice «Apartado», alguien ya lo apartó. Toca «Me interesa» y te
        confirmamos al momento por WhatsApp.
      </>
    ),
  },
  {
    q: "¿Puedo ver el auto en persona?",
    a: (
      <>
        Sí, con cita. No tenemos lote: escríbenos por WhatsApp y te agendamos una cita para que veas el auto.
      </>
    ),
  },
  {
    q: "¿Por qué sus precios son justos?",
    a: <>Porque no tenemos lote. Nuestros costos son menores que los de un lote de autos y eso se refleja en el precio.</>,
  },
  {
    q: "¿Los autos tienen sus papeles en regla?",
    a: (
      <>
        Sí. Cada auto se verifica, se valida y se prueba antes de publicarse: papeles originales y documentación en
        regla. Además te ayudamos con el papeleo.
      </>
    ),
  },
  {
    q: "Le falta un dato al auto (por ejemplo, el kilometraje). ¿Qué hago?",
    a: <>Preferimos no poner un dato que no tenemos confirmado. Mándanos un mensaje y te respondemos de inmediato.</>,
  },
  {
    q: "Quiero vender mi auto. ¿Cómo funciona?",
    a: (
      <>
        Nos cuentas de tu auto y lo evaluamos. Filtramos a los interesados, nos encargamos de las citas y te ayudamos
        con el papeleo y las placas. Normalmente ganas más que vendiéndolo a un lote.{" "}
        <Link href="/vende-tu-auto" className="font-semibold text-fg underline underline-offset-4">
          Vender mi auto
        </Link>
        .
      </>
    ),
  },
  {
    q: "¿Dónde están?",
    a: (
      <>
        Nuestra oficina está en {site.address.street}, {site.address.neighborhood}, {site.address.city},{" "}
        {site.address.state}.{" "}
        <a href={site.mapsUrl} target="_blank" rel="noopener" className="font-semibold text-fg underline underline-offset-4">
          Abrir en Google Maps
        </a>
        .
      </>
    ),
  },
];

export function Faq() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="preguntas">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading id="preguntas" title="Preguntas frecuentes" />
          <p className="reveal -mt-2 text-mute">
            ¿No ves tu pregunta?{" "}
            <a
              href={whatsappUrl(`Hola ${site.name} 👋 Tengo una pregunta:`)}
              target="_blank"
              rel="noopener"
              className="font-semibold text-wa-dark underline underline-offset-4"
            >
              Pregúntanos por WhatsApp
            </a>
            .
          </p>
        </div>
        <div className="border-t border-line">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="faq reveal group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold [&::-webkit-details-marker]:hidden">
                {q}
                <Plus
                  className="size-5 shrink-0 text-dim transition-transform duration-500 ease-[var(--ease-out-expo)] group-open:rotate-45 group-open:text-fg"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-6 leading-relaxed text-mute">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Cierre: cada auto es único (rediseño 30-oct) ----------

export function Closer({ rating, cars }: { rating: Rating; cars: Car[] }) {
  const strip = cars.filter((c) => c.images[0]).slice(0, 3);
  return (
    <section id="contacto" className="scroll-mt-20" aria-labelledby="contacto-title">
      <div className="glow-night relative overflow-hidden py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="reveal">
            {rating.count > 0 && (
              <div className="mb-6 flex items-center gap-2 text-sm text-white/80">
                <Stars value={rating.avg} className="size-4" />
                {rating.avg.toFixed(1)} · {rating.count} {rating.count === 1 ? "reseña" : "reseñas"}
              </div>
            )}
            <h2 id="contacto-title" className="font-display text-[2.6rem] leading-[1] sm:text-7xl">
              Cada auto es único.
              <span className="mt-2 block text-white/45">Cuando se vende, ya no vuelve.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/72">
              ¿Ya viste el tuyo? Escríbenos hoy y te confirmamos al momento si sigue disponible.
            </p>
            <ul className="mt-6 space-y-2.5">
              {FUDS.map((f) => (
                <li key={f} className="flex items-center gap-3 text-white/90">
                  <OkMark />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <WhatsAppCta message={GENERAL_MESSAGE}>Escríbenos por WhatsApp</WhatsAppCta>
              <CtaLink href="/autos" light>
                Ver inventario
              </CtaLink>
            </div>
          </div>
          {/* Tres autos reales del inventario, escalonados */}
          {strip.length > 0 && (
            <div className="grid grid-cols-3 items-end gap-3" aria-label="Algunos autos disponibles">
              {strip.map((car, i) => (
                <Link
                  key={car.id}
                  href={`/autos/${car.slug}`}
                  className={`reveal group relative block overflow-hidden rounded-lg bg-graphite ${
                    i === 1 ? "aspect-[3/5]" : "aspect-[3/4]"
                  }`}
                  style={vars({ "--i": i })}
                >
                  <Image
                    src={car.images[0]}
                    alt={carTitle(car)}
                    fill
                    sizes="(min-width: 1024px) 14vw, 31vw"
                    quality={70}
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/90 to-transparent p-2.5 pt-8 text-[11px] leading-tight font-semibold sm:p-3 sm:text-xs">
                    {car.model}
                    <span className="block font-normal text-white/70">{formatPrice(car.price)}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Visítanos: la oficina existe y se puede visitar (para confirmar que es un negocio real) */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="reveal grid gap-8 rounded-lg bg-card p-6 ring-1 ring-line sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-tech text-[11px] text-dim">Visítanos</p>
            <p className="font-display mt-3 text-[1.9rem] sm:text-4xl">{site.address.street}</p>
            <p className="mt-2 text-mute">
              {site.address.neighborhood}, {site.address.city}, {site.address.state} · {site.hours}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-md ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:ring-fg/40"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="btn btn-dark">
              <Navigation className="size-4" /> Cómo llegar
            </a>
            <a href={site.phoneHref} className="btn btn-outline">
              <Phone className="size-4" /> {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
