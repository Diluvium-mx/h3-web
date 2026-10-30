import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  FileCheck,
  FileText,
  Gauge,
  Headset,
  Navigation,
  Phone,
  Plus,
  ShieldCheck,
  TrendingUp,
  UserX,
  X,
} from "lucide-react";
import { CarCard } from "@/components/car-card";
import { categoriesOf, CategoryTileContent, categoryTileClass } from "@/components/category-tile";
import { Accent } from "@/components/accent";
import { SectionHeading } from "@/components/section-heading";
import { SOCIALS } from "@/components/site/footer";
import { WhatsAppIcon } from "@/components/icons";
import { Coverflow, type CoverflowItem } from "@/components/home/coverflow";
import { FUDS, GENERAL_MESSAGE, type Rating } from "@/components/home/hero";
import { Stars } from "@/components/home/reviews";
import { formatPrice, type Car } from "@/lib/cars";
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

// Palomita verde en círculo
function OkMark({ className = "" }: { className?: string }) {
  return (
    <span className={`grid size-6 shrink-0 place-items-center rounded-full bg-ok text-white ${className}`} aria-hidden="true">
      <Check className="size-3.5" strokeWidth={3} />
    </span>
  );
}

// ---------- 1. Inventario: categorías con foto y 8 autos en 2 columnas ----------

export function Inventory({ cars, featured }: { cars: Car[]; featured: Car[] }) {
  const { types } = categoriesOf(cars);

  return (
    <section className="pt-16 pb-16 sm:pt-24 sm:pb-24" aria-labelledby="destacados">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="destacados"
          eyebrow="Inventario"
          title={
            <>
              Autos listos para <Accent underline>manejar</Accent>
            </>
          }
          action={{ href: "/autos", label: "Ver todos" }}
        />
      </div>
      <nav
        aria-label="Explora por tipo"
        className="no-scrollbar mb-8 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:mx-auto lg:max-w-7xl"
      >
        {types.map((c, i) => (
          <Link
            key={c.type}
            href={`/autos?tipo=${encodeURIComponent(c.type)}`}
            className={`reveal ${categoryTileClass()}`}
            style={vars({ "--i": i })}
          >
            <CategoryTileContent category={c} />
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

// ---------- 2. Beneficios: una imagen para comprar y otra para vender, con sus puntos (sin botones) ----------

const BUY_BENEFITS = [
  { Icon: Headset, title: "Asesoramiento", text: "Te orientamos para elegir el auto que de verdad te conviene." },
  { Icon: ShieldCheck, title: "Autos confiables", text: "Ya verificados, validados y probados antes de publicarse." },
  { Icon: FileCheck, title: "Papeles en regla", text: "Papeles originales, documentación en regla y te ayudamos con el papeleo." },
  { Icon: CircleDollarSign, title: "Precio justo", text: "No tenemos lote: nuestros costos son menores que los de un lote de autos." },
];

const SELL_BENEFITS = [
  { Icon: TrendingUp, title: "Sácale más valor", text: "Normalmente ganas más que vendiéndolo a un lote de autos." },
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
              dark ? "bg-white/[0.08] text-brand-glow ring-1 ring-white/10" : "bg-brand-soft text-brand"
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
    <section className="pb-20 sm:pb-28" aria-labelledby="beneficios">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="beneficios"
          title={
            <>
              Lo que hacemos <Accent underline>por ti</Accent>
            </>
          }
        />
        <div className="space-y-5 lg:space-y-8">
          {/* Al comprar */}
          <article
            className="grid overflow-hidden rounded-xl bg-card ring-1 ring-line lg:grid-cols-2"
            aria-labelledby="al-comprar"
          >
            <div className="reveal reveal-wipe relative aspect-[16/10] bg-soft lg:aspect-auto lg:min-h-[30rem]">
              <Image
                src="/img/comprar-tu-auto.webp"
                alt="Entrega de la llave de un auto: comprar tu auto con H3"
                fill
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-10 lg:self-center lg:p-14">
              <h3 id="al-comprar" className="font-display text-[1.9rem] sm:text-4xl">
                Al comprar un auto
              </h3>
              <BenefitList items={BUY_BENEFITS} />
            </div>
          </article>

          {/* Al vender: la imagen de la llave y la carpeta, con «Ganas más que en un lote» */}
          <article
            className="grid overflow-hidden rounded-xl bg-night text-white lg:grid-cols-2"
            aria-labelledby="al-vender"
          >
            <div className="reveal reveal-wipe relative aspect-[16/10] bg-graphite lg:order-2 lg:aspect-auto lg:min-h-[30rem]">
              <Image
                src="/img/vende-tu-auto.webp"
                alt="Llave de un auto junto a una carpeta de documentos y una pluma: vender tu auto con el papeleo en orden"
                fill
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-md bg-white px-4 py-3 text-night shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)] sm:bottom-6 sm:left-6">
                <TrendingUp className="size-5 text-ok" />
                <p className="text-sm leading-tight">
                  <b className="block font-semibold">Ganas más que en un lote</b>
                  <span className="text-mute">Sácale más valor a tu vehículo</span>
                </p>
              </div>
            </div>
            <div className="p-6 sm:p-10 lg:self-center lg:p-14">
              <h3 id="al-vender" className="font-display text-[1.9rem] sm:text-4xl">
                Al vender tu auto
              </h3>
              <BenefitList items={SELL_BENEFITS} dark />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

// ---------- 3. Autos verificados: carrusel de tarjetas grandes ----------

export function BuySection({ cars }: { cars: Car[] }) {
  const withPhoto = cars.filter((c) => c.images[0]).slice(0, 8);
  if (!withPhoto.length) return null;
  return (
    <section className="overflow-hidden bg-card py-20 sm:py-28" aria-labelledby="compra">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="reveal flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 id="compra" className="font-display max-w-xl text-[2.1rem] sm:text-5xl">
            Autos <Accent>verificados,</Accent> con sus papeles <Accent underline>en regla.</Accent>
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-mute">
            Toca el que te guste y te agendamos una cita para que lo veas en persona.
          </p>
        </div>
      </div>
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
      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6">
        <Link href="/autos" className="group inline-flex items-center gap-2 text-sm font-semibold text-fg/80 hover:text-fg">
          Ver todo el inventario
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

// ---------- 4. Comparativa: tabla simple «lo de siempre» contra «en H3» ----------

const COMPARE = [
  { what: "Precio", old: "Solo «por inbox»", h3: "A la vista en cada auto" },
  { what: "Fotos", old: "De internet o de otro auto", h3: "Reales, del auto que vas a ver" },
  { what: "Papeles", old: "Dudosos", h3: "Originales y en regla" },
  { what: "Costos", old: "Incluyen el lote", h3: "Sin lote: precio justo" },
  { what: "Atención", old: "Mensajes en visto", h3: "Respuesta inmediata" },
];

export function Comparison() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="diferencia">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 id="diferencia" className="reveal font-display text-[2.1rem] sm:text-5xl">
          Compra con certeza, <Accent underline>no a ciegas.</Accent>
        </h2>
        <div className="reveal mt-8 overflow-hidden rounded-xl bg-card ring-1 ring-line">
          <table className="w-full table-fixed text-left text-[13px] sm:text-base">
            <caption className="sr-only">Comparación entre comprar como siempre y comprar en H3</caption>
            <colgroup>
              <col className="w-[24%] sm:w-[22%]" />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr className="border-b border-line">
                <td className="p-3 sm:p-5" />
                <th scope="col" className="p-3 font-semibold text-dim sm:p-5">
                  Lo de siempre
                </th>
                <th scope="col" className="bg-ok-soft p-3 font-semibold text-wa-dark sm:p-5">
                  En H3
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row, i) => (
                <tr key={row.what} className="reveal border-b border-line last:border-0" style={vars({ "--i": i })}>
                  <th scope="row" className="p-3 align-top font-semibold sm:p-5">
                    {row.what}
                  </th>
                  <td className="p-3 align-top text-mute sm:p-5">
                    <span className="flex gap-2">
                      <X className="mt-0.5 size-4 shrink-0 text-dim" aria-label="No" />
                      {row.old}
                    </span>
                  </td>
                  <td className="bg-ok-soft/60 p-3 align-top font-medium sm:p-5">
                    <span className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-ok" strokeWidth={3} aria-label="Sí" />
                      {row.h3}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ---------- 5. Preguntas frecuentes ----------

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "¿Cómo sé si un auto sigue disponible?",
    a: (
      <>
        Si está en el inventario, está a la venta; si dice «Apartado», alguien ya lo apartó. Escríbenos y te
        confirmamos al momento por WhatsApp.
      </>
    ),
  },
  {
    q: "¿Puedo ver el auto en persona?",
    a: <>Sí, con cita. No tenemos lote: escríbenos por WhatsApp y te agendamos una cita para que veas el auto.</>,
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
    <section id="preguntas-frecuentes" className="scroll-mt-20 bg-card py-20 sm:py-28" aria-labelledby="preguntas">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="preguntas"
            title={
              <>
                Preguntas <Accent>frecuentes</Accent>
              </>
            }
          />
        </div>
        <div>
          <div className="border-t border-line">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="faq reveal group border-b border-line">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold [&::-webkit-details-marker]:hidden">
                  {q}
                  <Plus
                    className="size-5 shrink-0 text-dim transition-transform duration-500 ease-[var(--ease-out-expo)] group-open:rotate-45 group-open:text-brand"
                    aria-hidden="true"
                  />
                </summary>
                <p className="pb-6 leading-relaxed text-mute">{a}</p>
              </details>
            ))}
          </div>
          {/* Hasta abajo de las preguntas (pedido del dueño, 31-oct) */}
          <p className="reveal mt-8 text-mute">
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
      </div>
    </section>
  );
}

// ---------- 6. Cierre: cada auto es único, con carrusel de autos ----------

export function Closer({ rating, cars }: { rating: Rating; cars: Car[] }) {
  const items: CoverflowItem[] = cars
    .filter((c) => c.images[0] && c.status !== "vendido")
    .slice(0, 7)
    .map((c) => ({
      slug: c.slug,
      image: c.images[0],
      model: c.model,
      eyebrow: `${c.year} · ${c.brand}`,
      price: formatPrice(c.price),
    }));
  return (
    <section id="contacto" className="scroll-mt-20" aria-labelledby="contacto-title">
      <div className="glow-night relative overflow-hidden pt-20 pb-16 text-white sm:pt-28 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="reveal max-w-3xl">
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
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5">
              {FUDS.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-white/90">
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
        </div>
        {/* Carrusel: la tarjeta del centro, más grande; las de los lados se alcanzan a ver */}
        {items.length > 0 && (
          <div className="mt-14">
            <Coverflow items={items} />
          </div>
        )}
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
