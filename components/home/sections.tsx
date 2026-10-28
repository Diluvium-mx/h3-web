import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Cog,
  Gauge,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { CarCard } from "@/components/car-card";
import { SectionHeading } from "@/components/section-heading";
import { SOCIALS } from "@/components/site/footer";
import { WhatsAppIcon } from "@/components/icons";
import { FUDS, GENERAL_MESSAGE, ProofPill, type Rating } from "@/components/home/hero";
import { carName, carTitle, formatKm, formatPrice, type Car } from "@/lib/cars";
import { site, whatsappUrl } from "@/lib/site";
import { vars } from "@/lib/ui";

const TYPE_LABEL: Record<string, string> = { Deportivo: "Deportivos", Blindado: "Blindados" };

function CtaLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="btn-shine group inline-flex h-14 items-center gap-3 rounded-full bg-brand pr-2 pl-6 font-semibold text-white shadow-[0_12px_40px_-12px_rgb(227_20_31/0.8)] transition-transform active:scale-95"
    >
      {children}
      <span className="grid size-10 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-1">
        <ArrowRight className="size-5" />
      </span>
    </Link>
  );
}

function WhatsAppCta({ message, children }: { message: string; children: ReactNode }) {
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener"
      className="btn-shine group inline-flex h-14 items-center gap-2.5 rounded-full bg-wa px-6 font-semibold text-night shadow-[0_12px_32px_-12px_rgb(37_211_102/0.9)] transition-transform active:scale-95"
    >
      <WhatsAppIcon className="size-5 transition-transform duration-500 group-hover:-rotate-12" />
      {children}
    </a>
  );
}

// ---------- Inventario: el producto, justo después de la prueba social ----------

export function Inventory({ cars, featured }: { cars: Car[]; featured: Car[] }) {
  const types = new Map<string, { count: number; cover?: string }>();
  for (const car of cars) {
    for (const t of car.armored ? [car.body, "Blindado"] : [car.body]) {
      const prev = types.get(t);
      types.set(t, { count: (prev?.count ?? 0) + 1, cover: prev?.cover ?? car.images[0] });
    }
  }
  const tiles = [...types.entries()].sort((a, b) => b[1].count - a[1].count);

  return (
    <section className="pt-14 pb-16 sm:pt-20 sm:pb-24" aria-labelledby="destacados">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="destacados"
          eyebrow="Inventario de hoy"
          title={
            <>
              {cars.length} autos <span className="text-brand">listos para manejar</span>
            </>
          }
          action={{ href: "/autos", label: "Ver todo el catálogo" }}
        />
      </div>
      {/* Tipos como «historias»: un toque y ya filtra el catálogo */}
      <nav aria-label="Explora por tipo" className="no-scrollbar -mt-1 mb-6 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:px-6 lg:mx-auto lg:max-w-7xl">
        {tiles.map(([t, { count, cover }]) => (
          <Link
            key={t}
            href={`/autos?tipo=${encodeURIComponent(t)}`}
            className="group flex w-[4.75rem] shrink-0 snap-start flex-col items-center gap-1.5"
          >
            <span className="relative grid size-[4.5rem] place-items-center transition-transform duration-300 ease-[var(--ease-spring)] group-active:scale-90">
              <span className="absolute inset-0 rounded-full bg-[conic-gradient(var(--color-brand),var(--color-volt),var(--color-brand))] group-hover:animate-[spin_4s_linear_infinite]" />
              <span className="relative size-[calc(100%-6px)] overflow-hidden rounded-full border-[3px] border-paper bg-brand">
                {cover && (
                  <Image
                    src={cover}
                    alt=""
                    fill
                    sizes="72px"
                    quality={70}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </span>
              <span className="font-display absolute -right-1 -bottom-1 grid h-6 min-w-6 -skew-x-6 place-items-center rounded-md bg-volt px-1 text-sm text-night shadow">
                {count}
              </span>
            </span>
            <span className="max-w-full truncate text-xs font-semibold">{TYPE_LABEL[t] ?? t}</span>
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
      <div className="mt-6 flex justify-center px-4">
        <CtaLink href="/autos">Ver los {cars.length} autos</CtaLink>
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
    <section className="relative overflow-hidden bg-night py-16 text-white sm:py-24" aria-labelledby="diferencia">
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(100deg,transparent_0_46px,rgb(255_255_255/0.035)_46px_48px,transparent_48px_120px)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="reveal">
          <p className="font-tech flex items-center gap-2 text-xs text-volt">
            <span className="h-0.5 w-6 skew-x-[-20deg] bg-volt" />
            La diferencia H3
          </p>
          <h2 id="diferencia" className="font-display mt-3 text-4xl sm:text-5xl">
            Comprar un seminuevo <span className="text-volt">no tiene que ser una apuesta.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
            Precios que solo te dan por mensaje, fotos que no son del auto, datos a medias y mensajes en visto. Así
            se pierde tiempo y confianza. En H3 lo hacemos diferente.
          </p>
          <div className="mt-8 hidden lg:block">
            <CtaLink href="/autos">Ver autos disponibles</CtaLink>
          </div>
        </div>
        <div>
          <div className="mb-3 hidden grid-cols-2 gap-3 px-5 sm:grid">
            <p className="font-tech text-[11px] text-white/50">Lo de siempre</p>
            <p className="font-tech text-[11px] text-volt">En H3</p>
          </div>
          <ul className="space-y-3">
            {OLD_VS_H3.map((row, i) => (
              <li
                key={row.h3}
                className="reveal grid gap-2 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10 sm:grid-cols-2 sm:items-center sm:gap-3 sm:px-5"
                style={vars({ "--i": i })}
              >
                <p className="flex items-center gap-2.5 text-sm text-white/55">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10">
                    <X className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="line-through decoration-brand decoration-2">{row.old}</span>
                </p>
                <p className="flex items-center gap-2.5 font-semibold">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-volt text-night">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {row.h3}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-8 lg:hidden">
            <CtaLink href="/autos">Ver autos disponibles</CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Beneficios (qué ganas tú), cada uno con su imagen y su botón ----------

const PRICE_RANGES = [
  { label: "Hasta $300k", value: "0-300000", min: 0, max: 300_000 },
  { label: "$300k – $600k", value: "300000-600000", min: 300_000, max: 600_000 },
  { label: "$600k – $1M", value: "600000-1000000", min: 600_000, max: 1_000_000 },
  { label: "Más de $1M", value: "1000000-", min: 1_000_000, max: Infinity },
];

function SpecPhoto({ car }: { car: Car }) {
  return (
    <Link href={`/autos/${car.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-soft ring-1 ring-line">
      <Image
        src={car.images[0]}
        alt={`${carTitle(car)}`}
        fill
        sizes="(min-width: 1024px) 40vw, 92vw"
        quality={70}
        className="object-cover object-[50%_62%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
      <span className="font-tech absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-[11px] text-fg shadow backdrop-blur-md">
        <ShieldCheck className="size-4 text-wa-dark" /> Auto verificado
      </span>
      <div className="absolute inset-x-4 bottom-4">
        <p className="font-display text-2xl text-white">{carName(car)}</p>
        <ul className="mt-2 flex flex-wrap gap-1.5 text-xs font-medium">
          <li className="rounded-full bg-volt px-2.5 py-1 text-night">{car.year}</li>
          <li className="inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-fg">
            <Gauge className="size-3.5 text-brand" /> {car.mileage != null ? formatKm(car.mileage) : "Km: pregúntanos"}
          </li>
          {car.transmission && (
            <li className="inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-fg">
              <Cog className="size-3.5 text-brand" /> {car.transmission}
            </li>
          )}
          <li className="rounded-full bg-brand px-2.5 py-1 font-bold text-white">{formatPrice(car.price)}</li>
        </ul>
      </div>
    </Link>
  );
}

function BudgetPicker({ cars }: { cars: Car[] }) {
  return (
    <div className="rounded-[1.75rem] bg-card p-5 shadow-[0_24px_60px_-30px_rgb(20_20_23/0.35)] ring-1 ring-line sm:p-7">
      <p className="font-display text-2xl">¿Cuál es tu presupuesto?</p>
      <p className="mt-1 text-sm text-mute">Toca uno y ve solo los autos en ese rango.</p>
      <ul className="mt-5 grid gap-2.5">
        {PRICE_RANGES.map((r, i) => {
          const n = cars.filter((c) => c.price >= r.min && c.price < r.max).length;
          if (!n) return null;
          return (
            <li key={r.value}>
              <Link
                href={`/autos?precio=${r.value}`}
                className="group flex h-14 items-center justify-between rounded-2xl border border-line bg-paper px-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand active:scale-[0.98]"
              >
                <span className="flex items-center gap-3 font-semibold">
                  <span
                    className="h-6 w-1.5 -skew-x-12 rounded-sm bg-gradient-to-b from-volt to-brand"
                    style={{ opacity: 0.4 + i * 0.2 }}
                  />
                  {r.label}
                </span>
                <span className="flex items-center gap-2 text-sm text-mute">
                  {n} {n === 1 ? "auto" : "autos"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Así se ve el mensaje que se manda al tocar «Me interesa» (mismo texto que arma el sitio)
function ChatMock({ car }: { car: Car }) {
  const host = site.url.replace(/^https?:\/\//, "");
  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] bg-[#efeae2] shadow-[0_30px_70px_-30px_rgb(20_20_23/0.5)] ring-1 ring-line">
      <div className="flex items-center gap-3 bg-wa-dark px-4 py-3 text-white">
        <span className="grid size-9 place-items-center rounded-full bg-white">
          <Image src="/brand/mark-dark.png" alt="" width={344} height={186} className="w-6" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">{site.name}</p>
          <p className="text-[11px] text-white/80">en línea</p>
        </div>
      </div>
      <div className="space-y-2 p-4 pb-5">
        <div className="reveal ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] p-1.5 text-[13px] leading-snug text-[#111b21] shadow-sm">
          <div className="flex gap-2 rounded-xl bg-black/5 p-1.5">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-soft">
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
        <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-3.5 py-3 shadow-sm" aria-hidden="true">
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
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div className={`reveal ${flip ? "lg:order-2" : ""}`}>{visual}</div>
      <div className="reveal">
        <p className="font-tech flex items-center gap-2 text-xs text-brand-hi">
          <span className="h-0.5 w-6 skew-x-[-20deg] bg-brand" />
          {eyebrow}
        </p>
        <h3 className="font-display mt-3 text-3xl sm:text-[2.6rem]">{title}</h3>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-mute">{text}</p>
        <div className="mt-6">{cta}</div>
      </div>
    </div>
  );
}

export function ValueProps({ cars, featured }: { cars: Car[]; featured: Car[] }) {
  const withPhoto = featured.filter((c) => c.images[0]);
  if (!withPhoto.length) return null;
  const specCar = withPhoto.find((c) => c.mileage != null && c.transmission) ?? withPhoto[0];
  const chatCar = withPhoto.find((c) => c.id !== specCar.id) ?? specCar;
  return (
    <section className="py-16 sm:py-24" aria-labelledby="beneficios">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 id="beneficios" className="sr-only">
          Por qué comprar en H3
        </h2>
        <div className="space-y-20 sm:space-y-28">
          <ValueRow
            eyebrow="Autos verificados"
            title={
              <>
                Maneja tranquilo: <span className="text-brand">autos verificados</span> y con ficha clara
              </>
            }
            text="Cada auto se publica con fotos reales y su ficha: año, kilometraje, transmisión y más. ¿Te quedó una duda? Pregúntanos y te respondemos de inmediato."
            visual={<SpecPhoto car={specCar} />}
            cta={
              <Link href={`/autos/${specCar.slug}`} className="group inline-flex items-center gap-2 font-semibold text-brand-hi">
                Ver la ficha de este auto
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
          <ValueRow
            flip
            eyebrow="Precio justo y a la vista"
            title={
              <>
                Sabes cuánto cuesta <span className="text-brand">antes de escribir</span>
              </>
            }
            text="Todos los autos muestran su precio. Nada de «precio por inbox»: filtra por presupuesto, compara con calma y escríbenos solo por el que te late."
            visual={<BudgetPicker cars={cars} />}
            cta={
              <Link href="/autos?orden=precio-asc" className="group inline-flex items-center gap-2 font-semibold text-brand-hi">
                Ver del más barato al más caro
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
          <ValueRow
            eyebrow="Atención 1 a 1"
            title={
              <>
                Un toque y ya estás <span className="text-brand">hablando con nosotros</span>
              </>
            }
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
  {
    Icon: Search,
    title: "Elige el tuyo",
    text: "Filtra por tipo, marca, precio y año. Cada auto tiene fotos reales, precio y ficha.",
  },
  {
    Icon: MessageCircle,
    title: "Escríbenos",
    text: "Toca «Me interesa»: el mensaje ya lleva el auto. Te respondemos de inmediato.",
  },
  {
    Icon: MapPin,
    title: "Ven a conocerlo",
    text: `${site.address.street}, ${site.address.city}. Lunes a sábado de 9:00 a 17:00.`,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-card py-16 sm:py-24" aria-labelledby="como-funciona">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="como-funciona"
          eyebrow="Así de fácil"
          title={
            <>
              Tu próximo auto <span className="text-brand">en 3 pasos</span>
            </>
          }
        />
        <ol className="relative grid gap-4 md:grid-cols-3">
          <span
            className="absolute top-10 bottom-10 left-[2.15rem] w-0.5 bg-gradient-to-b from-brand to-volt md:top-[2.15rem] md:right-[16%] md:bottom-auto md:left-[16%] md:h-0.5 md:w-auto md:bg-gradient-to-r"
            aria-hidden="true"
          />
          {STEPS.map(({ Icon, title, text }, i) => (
            <li
              key={title}
              className="reveal relative flex gap-4 rounded-3xl border border-line bg-paper p-5 md:flex-col md:p-7"
              style={vars({ "--i": i })}
            >
              <span className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-brand text-white shadow-[0_10px_24px_-10px_rgb(227_20_31/0.9)]">
                <Icon className="size-5" />
                <span className="font-display absolute -top-2 -right-2 grid size-6 -skew-x-6 place-items-center rounded-md bg-volt text-xs text-night">
                  {i + 1}
                </span>
              </span>
              <div>
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="mt-2 leading-relaxed text-mute">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-4">
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
    <section className="py-16" aria-labelledby="vendidos">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="vendidos"
          eyebrow="Ya tienen nuevo dueño"
          title={
            <>
              Recién <span className="text-brand">vendidos</span>
            </>
          }
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cars.slice(0, 4).map((car) => (
            <CarCard key={car.id} car={car} sizes="(min-width: 640px) 25vw, 50vw" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Oferta secundaria: vender tu auto ----------

export function SellBanner() {
  return (
    <section className="px-4 py-10 sm:px-6" aria-labelledby="vende">
      <div className="reveal relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-[#b80f18] to-[#5c0509] px-6 py-12 sm:px-12 sm:py-16">
        <div className="speed-lines pointer-events-none absolute inset-0 opacity-80" />
        <p className="font-display pointer-events-none absolute -right-6 -bottom-8 text-[9rem] leading-none text-white/10 sm:text-[14rem]">
          $$$
        </p>
        <div className="relative max-w-xl">
          <p className="font-tech text-xs text-white/80">Vende tu auto</p>
          <h2 id="vende" className="font-display mt-3 text-5xl text-white sm:text-6xl">
            ¿Quieres vender tu auto?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/85">
            Cuéntanos de tu auto en menos de un minuto y te atendemos por WhatsApp.
          </p>
          <Link
            href="/vende-tu-auto"
            className="btn-shine group mt-8 inline-flex h-14 items-center gap-3 rounded-full bg-white pr-2 pl-6 font-semibold text-night transition-transform active:scale-95"
          >
            Vender mi auto
            <span className="grid size-10 place-items-center rounded-full bg-night text-white transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-1">
              <ArrowRight className="size-5" />
            </span>
          </Link>
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
        Si está en el catálogo, está a la venta; si dice «Apartado», alguien ya lo apartó. Toca «Me interesa» y te
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
        <a href={site.mapsUrl} target="_blank" rel="noopener" className="font-semibold text-brand-hi underline">
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
        <Link href="/vende-tu-auto" className="font-semibold text-brand-hi underline">
          Vender mi auto
        </Link>
        .
      </>
    ),
  },
];

export function Faq() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="preguntas">
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
        <div className="space-y-3">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="faq reveal group rounded-2xl border border-line bg-card open:border-brand/40">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                {q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-soft transition-transform duration-300 group-open:rotate-180 group-open:bg-brand group-open:text-white">
                  <ChevronDown className="size-4" />
                </span>
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-mute">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Cierre: resumen, urgencia real y contacto ----------

export function Closer({ available, rating }: { available: number; rating: Rating }) {
  const waze = `https://waze.com/ul?q=${encodeURIComponent(`${site.address.street}, ${site.address.city}, ${site.address.state}`)}&navigate=yes`;
  return (
    <section id="contacto" className="scroll-mt-20 px-4 pt-6 pb-16 sm:px-6 sm:pb-24" aria-labelledby="contacto-title">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="reveal relative overflow-hidden rounded-[2rem] bg-volt p-6 text-night sm:p-10">
          <span className="font-display pointer-events-none absolute -right-4 -bottom-10 text-[10rem] leading-none text-night/[0.06] sm:text-[13rem]">
            H3
          </span>
          <div className="relative">
            <ProofPill available={available} rating={rating} />
            <p className="font-tech mt-6 text-xs text-night/70">Cada auto es único</p>
            <h2 id="contacto-title" className="font-display mt-2 text-4xl sm:text-6xl">
              Cuando se vende, <span className="text-brand">ya no vuelve.</span>
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-night/80">
              ¿Ya viste el tuyo? Escríbenos hoy y te confirmamos al momento si sigue disponible.
            </p>
            <ul className="mt-5 space-y-2">
              {FUDS.map((f) => (
                <li key={f} className="flex items-center gap-2.5 font-semibold">
                  <span className="grid size-6 place-items-center rounded-full bg-night text-volt">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppCta message={GENERAL_MESSAGE}>Escríbenos por WhatsApp</WhatsAppCta>
              <Link
                href="/autos"
                className="inline-flex h-14 items-center gap-2 rounded-full bg-night px-6 font-semibold text-white transition-transform active:scale-95"
              >
                Ver catálogo <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="reveal flex flex-col rounded-[2rem] border border-line bg-card p-6 sm:p-8">
          <span className="relative grid size-14 place-items-center rounded-full bg-brand text-white">
            <span className="absolute inset-0 rounded-full bg-brand animate-pulse-ring" />
            <MapPin className="relative size-7" />
          </span>
          <p className="font-tech mt-6 text-xs text-brand-hi">Visítanos</p>
          <p className="font-display mt-2 text-3xl">{site.address.street}</p>
          <p className="mt-2 text-mute">
            {site.address.neighborhood}, {site.address.city}, {site.address.state}
          </p>
          <p className="mt-1 text-sm text-mute">{site.hours}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-night px-5 font-semibold text-white transition-transform active:scale-95"
            >
              <Navigation className="size-4" /> Google Maps
            </a>
            <a
              href={waze}
              target="_blank"
              rel="noopener"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-5 font-semibold transition-colors hover:border-fg/40 active:scale-95"
            >
              Waze
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-line px-5 font-semibold transition-colors hover:border-fg/40 active:scale-95"
            >
              <Phone className="size-4 text-brand" /> {site.phoneDisplay}
            </a>
          </div>
          <div className="mt-auto flex items-center gap-2 border-t border-line pt-5">
            <p className="mr-auto text-sm text-mute">Síguenos</p>
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full border border-line transition-all hover:-translate-y-0.5 hover:border-brand"
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
