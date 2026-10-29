import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, MessageCircle, Navigation, Phone, Plus, Search, ShieldCheck, X } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { CategoryTileContent, categoryTileClass } from "@/components/category-tile";
import { SectionHeading } from "@/components/section-heading";
import { SOCIALS } from "@/components/site/footer";
import { WhatsAppIcon } from "@/components/icons";
import { FUDS, GENERAL_MESSAGE, countTypes, type Rating } from "@/components/home/hero";
import { Stars } from "@/components/home/reviews";
import { carName, carTitle, formatKm, formatPrice, type Car } from "@/lib/cars";
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

// ---------- Inventario: categorías con ícono y autos destacados ----------

export function Inventory({ cars, featured }: { cars: Car[]; featured: Car[] }) {
  const tiles = countTypes(cars);

  return (
    <section className="pt-12 pb-16 sm:pt-20 sm:pb-24" aria-labelledby="destacados">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="destacados"
          eyebrow="Inventario"
          title="Autos listos para manejar"
          action={{ href: "/autos", label: "Ver todo el inventario" }}
        />
      </div>
      <nav
        aria-label="Explora por tipo"
        className="no-scrollbar mb-8 flex snap-x scroll-px-4 gap-2.5 overflow-x-auto px-4 pb-1 sm:scroll-px-6 sm:px-6 lg:mx-auto lg:max-w-7xl"
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
      <div className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:scroll-px-6 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-4 lg:overflow-visible">
        {featured.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            className="w-[80vw] max-w-[340px] shrink-0 snap-start lg:w-auto lg:max-w-none"
            sizes="(min-width: 1024px) 24vw, 80vw"
          />
        ))}
      </div>
      <div className="mt-8 flex justify-center px-4">
        <CtaLink href="/autos">Ver todo el inventario</CtaLink>
      </div>
    </section>
  );
}

// ---------- Vende tu auto: grande y arriba (pedido del dueño, 28-oct) ----------

const SELL_STEPS = [
  { title: "Cuéntanos de tu auto", text: "Marca, modelo, año y kilometraje. Toma menos de un minuto." },
  { title: "Envía fotos por WhatsApp", text: "El mensaje se arma solo; tú agregas las fotos." },
  { title: "Te atendemos por WhatsApp", text: "El encargado revisa tus datos y te responde por ahí." },
];

export function SellSection() {
  return (
    <section className="glow-night relative overflow-hidden py-20 text-white sm:py-28" aria-labelledby="vende">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="light-trails" aria-hidden="true">
        <span style={{ top: "18%", ...vars({ "--d": "6s", "--delay": "0.6s" }) }} />
        <span style={{ top: "64%", ...vars({ "--d": "7.5s", "--delay": "3s" }) }} />
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
        <div className="reveal">
          <p className="font-tech flex items-center gap-3 text-[11px] text-silver">
            <span className="h-px w-8 rule-accent" />
            Vende tu auto
          </p>
          <h2 id="vende" className="font-display mt-5 text-[2.6rem] leading-[1.02] sm:text-7xl">
            ¿Quieres vender <span className="text-gradient">tu auto</span>?
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">
            Cuéntanos de tu auto en menos de un minuto y te atendemos por WhatsApp. Sin vueltas y sin compromiso.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <CtaLink href="/vende-tu-auto" light>
              Vender mi auto
            </CtaLink>
          </div>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/10">
          {SELL_STEPS.map((s, i) => (
            <li
              key={s.title}
              className="reveal group flex gap-5 bg-graphite/90 p-5 backdrop-blur-sm transition-colors duration-500 hover:bg-steel/80 sm:p-6"
              style={vars({ "--i": i })}
            >
              <span className="font-display text-3xl leading-none text-white/30 transition-colors duration-500 group-hover:text-brand-glow">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/65">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ---------- Dolor → solución: «lo de siempre» contra «en H3» ----------

const OLD_VS_H3 = [
  { old: "Precio «por inbox»", h3: "Precio a la vista en cada auto" },
  { old: "Fotos de internet o de otro auto", h3: "Fotos reales del auto que vas a ver" },
  { old: "Mensajes en visto", h3: "Te respondemos de inmediato por WhatsApp" },
  { old: "Datos a medias", h3: "Ficha clara y, si falta algo, te lo decimos" },
  { old: "Vas a verlo y ya se vendió", h3: "Te confirmamos al momento si sigue disponible" },
];

export function Comparison() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="diferencia">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="reveal">
          <p className="font-tech flex items-center gap-3 text-[11px] text-dim">
            <span className="h-px w-8 rule-accent" />
            La diferencia H3
          </p>
          <h2 id="diferencia" className="font-display mt-4 text-[2rem] sm:text-5xl">
            Comprar un seminuevo no tiene que ser una apuesta.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-mute">
            Precios que solo te dan por mensaje, fotos que no son del auto, datos a medias y mensajes en visto. Así
            se pierde tiempo y confianza. En H3 lo hacemos diferente.
          </p>
          <div className="mt-8 hidden lg:block">
            <CtaLink href="/autos">Ver autos disponibles</CtaLink>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-card ring-1 ring-line">
          <div className="hidden grid-cols-2 border-b border-line px-6 py-3 sm:grid">
            <p className="font-tech text-[10px] text-dim">Lo de siempre</p>
            <p className="font-tech text-[10px] text-fg">En H3</p>
          </div>
          <ul className="divide-y divide-line">
            {OLD_VS_H3.map((row, i) => (
              <li
                key={row.h3}
                className="reveal grid gap-1.5 px-5 py-4 sm:grid-cols-2 sm:items-center sm:gap-4 sm:px-6"
                style={vars({ "--i": i })}
              >
                <p className="flex items-center gap-2.5 text-sm text-dim">
                  <X className="size-4 shrink-0" aria-hidden="true" />
                  <span className="line-through decoration-dim/60">{row.old}</span>
                </p>
                <p className="flex items-center gap-2.5 font-medium">
                  <Check className="size-4 shrink-0 text-brand" strokeWidth={2.5} aria-hidden="true" />
                  {row.h3}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:hidden">
          <CtaLink href="/autos">Ver autos disponibles</CtaLink>
        </div>
      </div>
    </section>
  );
}

// ---------- Beneficios (qué ganas tú), cada uno con su imagen y su botón ----------

function SpecPhoto({ car }: { car: Car }) {
  return (
    <Link href={`/autos/${car.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-soft">
      <Image
        src={car.images[0]}
        alt={carTitle(car)}
        fill
        sizes="(min-width: 1024px) 40vw, 92vw"
        quality={70}
        className="object-cover object-[50%_62%] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent" />
      <span className="font-tech absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-sm bg-white/90 px-2.5 py-1.5 text-[10px] text-fg backdrop-blur-md">
        <ShieldCheck className="size-3.5 text-brand" /> Auto verificado
      </span>
      <div className="absolute inset-x-5 bottom-5 text-white">
        <p className="font-tech text-[10px] text-white/70">
          {car.year} · {car.mileage != null ? formatKm(car.mileage) : "Km: pregúntanos"}
          {car.transmission && ` · ${car.transmission}`}
        </p>
        <div className="mt-1.5 flex items-end justify-between gap-4">
          <p className="font-display text-2xl">{carName(car)}</p>
          <p className="font-display shrink-0 text-xl">{formatPrice(car.price)}</p>
        </div>
      </div>
    </Link>
  );
}

// Así se ve el mensaje que se manda al tocar «Me interesa» (mismo texto que arma el sitio)
function ChatMock({ car }: { car: Car }) {
  const host = site.url.replace(/^https?:\/\//, "");
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-[#efeae2] shadow-[0_30px_70px_-30px_rgb(12_13_15/0.5)] ring-1 ring-line">
      <div className="flex items-center gap-3 bg-[#0b141a] px-4 py-3 text-white">
        <span className="grid size-9 place-items-center rounded-full bg-white">
          <Image src="/brand/mark-dark.png" alt="" width={344} height={186} className="w-6" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">{site.name}</p>
          <p className="text-[11px] text-white/70">en línea</p>
        </div>
      </div>
      <div className="space-y-2 p-4 pb-5">
        <div className="reveal ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-[#d9fdd3] p-1.5 text-[13px] leading-snug text-[#111b21] shadow-sm">
          <div className="flex gap-2 rounded-lg bg-black/5 p-1.5">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-soft">
              <Image src={car.images[0]} alt="" fill sizes="56px" quality={70} className="object-cover" />
            </span>
            <span className="min-w-0 py-0.5">
              <span className="line-clamp-2 font-semibold">
                {carTitle(car)} | {site.name}
              </span>
              <span className="block truncate text-[11px] text-black/50">{host}</span>
            </span>
          </div>
          <p className="px-1.5 pt-2 pb-1">
            Hola {site.name} 👋 Me interesa el <b>{carTitle(car)}</b> ({formatPrice(car.price)}) que vi en su página.
            ¿Sigue disponible?
          </p>
          <p className="px-1.5 text-right text-[10px] text-black/45">✓✓</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-xl rounded-tl-sm bg-white px-3.5 py-3 shadow-sm" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="typing-dot size-1.5 rounded-full bg-black/40" style={vars({ "--i": i })} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ValueRow({
  eyebrow,
  title,
  text,
  visual,
  cta,
  flip,
}: {
  eyebrow: string;
  title: ReactNode;
  text: ReactNode;
  visual: ReactNode;
  cta: ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-20">
      <div className={`reveal ${flip ? "lg:order-2" : ""}`}>{visual}</div>
      <div className="reveal">
        <p className="font-tech flex items-center gap-3 text-[11px] text-dim">
          <span className="h-px w-8 rule-accent" />
          {eyebrow}
        </p>
        <h3 className="font-display mt-4 text-[1.85rem] sm:text-[2.6rem]">{title}</h3>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-mute">{text}</p>
        <div className="mt-7">{cta}</div>
      </div>
    </div>
  );
}

export function ValueProps({ featured }: { featured: Car[] }) {
  const withPhoto = featured.filter((c) => c.images[0]);
  if (!withPhoto.length) return null;
  const specCar = withPhoto.find((c) => c.mileage != null && c.transmission) ?? withPhoto[0];
  const chatCar = withPhoto.find((c) => c.id !== specCar.id) ?? specCar;
  return (
    <section className="tint-warm py-20 sm:py-28" aria-labelledby="beneficios">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 id="beneficios" className="sr-only">
          Por qué comprar en H3
        </h2>
        <div className="space-y-20 sm:space-y-28">
          <ValueRow
            eyebrow="Autos verificados"
            title="Maneja tranquilo: autos verificados y con ficha clara."
            text="Cada auto se publica con fotos reales y su ficha: año, kilometraje, transmisión y más. ¿Te quedó una duda? Pregúntanos y te respondemos de inmediato."
            visual={<SpecPhoto car={specCar} />}
            cta={
              <Link href={`/autos/${specCar.slug}`} className="group inline-flex items-center gap-2 font-semibold">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-0.5">
                  Ver la ficha de este auto
                </span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
          <ValueRow
            flip
            eyebrow="Atención 1 a 1"
            title="Un toque y ya estás hablando con nosotros."
            text="Toca «Me interesa» en cualquier auto: el WhatsApp ya lleva el modelo, el precio y el enlace. Sin registros ni formularios, y te respondemos de inmediato."
            visual={<ChatMock car={chatCar} />}
            cta={<WhatsAppCta message={GENERAL_MESSAGE}>Escríbenos ahora</WhatsAppCta>}
          />
        </div>
      </div>
    </section>
  );
}

// ---------- Cómo funciona: que se vea fácil ----------

const STEPS = [
  { Icon: Search, title: "Elige el tuyo", text: "Filtra por tipo, marca, precio y año. Cada auto tiene fotos reales, precio y ficha." },
  { Icon: MessageCircle, title: "Escríbenos", text: "Toca «Me interesa»: el mensaje ya lleva el auto. Te respondemos de inmediato." },
  {
    Icon: Navigation,
    title: "Ven a conocerlo",
    text: `${site.address.street}, ${site.address.city}. Lunes a sábado de 9:00 a 17:00.`,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="como-funciona">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="como-funciona" eyebrow="Así de fácil" title="Tu próximo auto en 3 pasos." />
        <ol className="grid gap-px overflow-hidden rounded-lg bg-line ring-1 ring-line md:grid-cols-3">
          {STEPS.map(({ Icon, title, text }, i) => (
            <li key={title} className="reveal group relative bg-card p-6 sm:p-8" style={vars({ "--i": i })}>
              <div className="flex items-center justify-between">
                <span className="font-display text-5xl leading-none text-soft-2 transition-colors duration-500 group-hover:text-brand">
                  0{i + 1}
                </span>
                <Icon className="size-5 text-brand" strokeWidth={1.75} />
              </div>
              <h3 className="font-display mt-8 text-xl">{title}</h3>
              <p className="mt-2 leading-relaxed text-mute">{text}</p>
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 rule-accent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <CtaLink href="/autos">Empezar: ver autos</CtaLink>
        </div>
      </div>
    </section>
  );
}

// ---------- Más prueba social: autos que ya se vendieron ----------

export function SoldStrip({ cars }: { cars: Car[] }) {
  if (!cars.length) return null;
  return (
    <section className="pb-16" aria-labelledby="vendidos">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="vendidos" eyebrow="Ya tienen nuevo dueño" title="Recién vendidos" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cars.slice(0, 4).map((car) => (
            <CarCard key={car.id} car={car} sizes="(min-width: 640px) 25vw, 50vw" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Preguntas frecuentes: quitar dudas antes del último botón ----------

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
    q: "Le falta un dato al auto (por ejemplo, el kilometraje). ¿Qué hago?",
    a: (
      <>
        Preferimos no poner un dato que no tenemos confirmado. Mándanos un mensaje y te respondemos de
        inmediato.
      </>
    ),
  },
  {
    q: "¿Puedo ver el auto en persona?",
    a: (
      <>
        Sí. Estamos en {site.address.street}, {site.address.neighborhood}, {site.address.city}, de lunes a sábado de
        9:00 a 17:00. Escríbenos antes y te confirmamos que el auto esté disponible.
      </>
    ),
  },
  {
    q: "¿Tengo que registrarme o llenar un formulario?",
    a: <>No. Ves todo el inventario sin registrarte y nos escribes directo por WhatsApp.</>,
  },
  {
    q: "¿Dónde están exactamente?",
    a: (
      <>
        En {site.address.street}, {site.address.neighborhood}, {site.address.city}, {site.address.state}.{" "}
        <a href={site.mapsUrl} target="_blank" rel="noopener" className="font-semibold text-fg underline">
          Abrir en Google Maps
        </a>
        .
      </>
    ),
  },
  {
    q: "Quiero vender mi auto. ¿Me pueden ayudar?",
    a: (
      <>
        Sí. Cuéntanos de tu auto en menos de un minuto y te atendemos por WhatsApp.{" "}
        <Link href="/vende-tu-auto" className="font-semibold text-fg underline">
          Vender mi auto
        </Link>
        .
      </>
    ),
  },
];

export function Faq() {
  return (
    <section className="tint-warm py-20 sm:py-28" aria-labelledby="preguntas">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading id="preguntas" eyebrow="Sin dudas" title="Preguntas frecuentes" />
          <p className="reveal -mt-2 text-mute">
            ¿No ves tu pregunta?{" "}
            <a
              href={whatsappUrl(`Hola ${site.name} 👋 Tengo una pregunta:`)}
              target="_blank"
              rel="noopener"
              className="font-semibold text-wa-dark underline"
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
                  className="size-5 shrink-0 text-dim transition-transform duration-500 ease-[var(--ease-out-expo)] group-open:rotate-45 group-open:text-brand"
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

// ---------- Cierre: resumen, urgencia real y contacto ----------

export function Closer({ rating }: { rating: Rating }) {
  return (
    <section id="contacto" className="scroll-mt-20 px-4 pt-6 pb-16 sm:px-6 sm:pb-24" aria-labelledby="contacto-title">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="reveal glow-night relative overflow-hidden rounded-lg p-7 text-white sm:p-12">
          <div className="light-trails" aria-hidden="true">
            <span style={{ top: "30%", ...vars({ "--d": "6.5s", "--delay": "1.4s" }) }} />
          </div>
          {rating.count > 0 && (
            <div className="mb-6 flex items-center gap-2 text-sm text-white/80">
              <Stars value={rating.avg} className="size-4" />
              {rating.avg.toFixed(1)} · {rating.count} {rating.count === 1 ? "reseña" : "reseñas"}
            </div>
          )}
          <p className="font-tech flex items-center gap-3 text-[11px] text-silver">
            <span className="h-px w-8 rule-accent" />
            Cada auto es único
          </p>
          <h2 id="contacto-title" className="font-display mt-4 text-[2.2rem] leading-[1.04] sm:text-6xl">
            Cuando se vende, <span className="text-gradient">ya no vuelve</span>.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
            ¿Ya viste el tuyo? Escríbenos hoy y te confirmamos al momento si sigue disponible.
          </p>
          <ul className="mt-6 space-y-2.5">
            {FUDS.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-white/90">
                <Check className="size-4 text-brand-glow" strokeWidth={2.5} />
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

        <div className="reveal flex flex-col rounded-lg bg-card p-7 ring-1 ring-line sm:p-10">
          <p className="font-tech text-[11px] text-dim">Visítanos</p>
          <p className="font-display mt-4 text-[1.75rem]">{site.address.street}</p>
          <p className="mt-2 text-mute">
            {site.address.neighborhood}, {site.address.city}, {site.address.state}
          </p>
          <p className="mt-1 text-sm text-mute">{site.hours}</p>
          <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="btn btn-dark group">
              <Navigation className="size-4" /> Cómo llegar
            </a>
            <a href={site.phoneHref} className="btn btn-outline">
              <Phone className="size-4" /> {site.phoneDisplay}
            </a>
          </div>
          <div className="mt-auto flex items-center gap-2 border-t border-line pt-6">
            <p className="font-tech mr-auto text-[10px] text-dim">Síguenos</p>
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
      </div>
    </section>
  );
}
