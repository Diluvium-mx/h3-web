import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HandCoins, Headset, MapPin, Navigation, Phone } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { SectionHeading } from "@/components/section-heading";
import { SOCIALS } from "@/components/site/footer";
import { WhatsAppIcon } from "@/components/icons";
import type { Car } from "@/lib/cars";
import { site, whatsappUrl } from "@/lib/site";
import { vars } from "@/lib/ui";

export function FeaturedCars({ cars }: { cars: Car[] }) {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="destacados">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="destacados"
          eyebrow="Inventario actual"
          title={
            <>
              Lo disponible <span className="text-brand">🔥</span>
            </>
          }
          action={{ href: "/autos", label: "Ver todo el catálogo" }}
        />
      </div>
      <div className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:scroll-px-6 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-4 lg:overflow-visible">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            className="w-[80vw] max-w-[340px] shrink-0 snap-start lg:w-auto lg:max-w-none"
            sizes="(min-width: 1024px) 24vw, 45vw"
          />
        ))}
      </div>
      <div className="mt-6 px-4 sm:hidden">
        <Link
          href="/autos"
          className="flex h-14 items-center justify-center gap-2 rounded-full border border-line bg-soft font-semibold active:scale-95"
        >
          Ver todo el catálogo <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

const PRICE_RANGES = [
  { label: "Hasta $300k", value: "0-300000" },
  { label: "$300k – $600k", value: "300000-600000" },
  { label: "$600k – $1M", value: "600000-1000000" },
  { label: "Más de $1M", value: "1000000-" },
];

export function Categories({ cars }: { cars: Car[] }) {
  const groups = new Map<string, Car[]>();
  for (const car of cars) {
    groups.set(car.body, [...(groups.get(car.body) ?? []), car]);
    if (car.armored) groups.set("Blindado", [...(groups.get("Blindado") ?? []), car]);
  }
  const tiles = [...groups.entries()]
    .map(([name, list]) => ({ name, list, cover: list.find((c) => c.images[0])?.images[0] }))
    .sort((a, b) => b.list.length - a.list.length);

  return (
    <section className="py-16 sm:py-20" aria-labelledby="categorias">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="categorias" eyebrow="Encuentra rápido" title="Explora por tipo" />
      </div>
      <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 sm:px-6 lg:mx-auto lg:max-w-7xl lg:flex-wrap lg:overflow-visible">
        {tiles.map((t, i) => (
          <Link
            key={t.name}
            href={`/autos?tipo=${encodeURIComponent(t.name)}`}
            className="reveal group relative aspect-[3/4] w-40 shrink-0 snap-start overflow-hidden rounded-2xl bg-soft ring-1 ring-line sm:w-48 lg:w-[calc((100%-5*0.75rem)/6)]"
            style={vars({ "--i": i })}
          >
            {t.cover && (
              <Image
                src={t.cover}
                alt=""
                fill
                sizes="200px"
                quality={70}
                className="object-cover object-[50%_60%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-display text-xl text-white">{t.name === "Deportivo" ? "Deportivos" : t.name === "Blindado" ? "Blindados" : t.name}</p>
              <p className="mt-1 text-xs text-white/85">
                {t.list.length} {t.list.length === 1 ? "auto" : "autos"}
              </p>
            </div>
            <span className="absolute top-3 right-3 h-1 w-6 skew-x-[-20deg] bg-brand transition-all duration-500 group-hover:w-10" />
          </Link>
        ))}
      </div>
      <div className="mx-auto mt-6 flex max-w-7xl flex-wrap gap-2 px-4 sm:px-6">
        {PRICE_RANGES.map((r) => (
          <Link
            key={r.value}
            href={`/autos?precio=${r.value}`}
            className="rounded-full border border-line bg-card px-4 py-2.5 text-sm font-medium text-fg/85 transition-all hover:-translate-y-0.5 hover:border-brand hover:text-fg active:scale-95"
          >
            {r.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

const REASONS = [
  {
    Icon: BadgeCheck,
    title: "Autos verificados",
    text: "Revisamos cada auto antes de ponerlo a la venta. Sin sorpresas.",
  },
  {
    Icon: HandCoins,
    title: "Precios justos",
    text: "Comparamos el valor real con el precio de mercado para que pagues lo correcto.",
  },
  {
    Icon: Headset,
    title: "Atención personalizada",
    text: "Te ayudamos a encontrar lo que buscas. Directo por WhatsApp o en persona.",
  },
];

export function WhyUs() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="por-que">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="por-que" eyebrow="¿Por qué H3?" title="Lo que nos hace diferentes" />
        <div className="grid gap-4 md:grid-cols-3">
          {REASONS.map(({ Icon, title, text }, i) => (
            <article
              key={title}
              className="reveal group relative overflow-hidden rounded-3xl border border-line bg-card p-6 transition-colors duration-500 hover:border-brand/40 sm:p-8"
            >
              <span className="font-display text-outline absolute -top-3 right-4 text-8xl opacity-40 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 group-hover:opacity-70">
                0{i + 1}
              </span>
              <span className="grid size-12 place-items-center rounded-2xl bg-brand/15 text-brand-hi transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-110">
                <Icon className="size-6" />
              </span>
              <h3 className="font-display mt-6 text-2xl">{title}</h3>
              <p className="mt-3 leading-relaxed text-mute">{text}</p>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-brand transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

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

export function SoldStrip({ cars }: { cars: Car[] }) {
  if (!cars.length) return null;
  return (
    <section className="py-12" aria-labelledby="vendidos">
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

export function Contact() {
  const waze = `https://waze.com/ul?q=${encodeURIComponent(`${site.address.street}, ${site.address.city}, ${site.address.state}`)}&navigate=yes`;
  return (
    <section id="contacto" className="scroll-mt-20 py-16 sm:py-24" aria-labelledby="contacto-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="contacto-title" eyebrow="Visítanos" title="Estamos en Villahermosa" />
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="reveal relative overflow-hidden rounded-3xl border border-line bg-card p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgb(20_20_23/.15)_1px,transparent_1px),linear-gradient(90deg,rgb(20_20_23/.15)_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="relative">
              <span className="relative grid size-14 place-items-center rounded-full bg-brand">
                <span className="absolute inset-0 rounded-full bg-brand animate-pulse-ring" />
                <MapPin className="relative size-7" />
              </span>
              <p className="font-display mt-6 text-3xl sm:text-4xl">{site.address.street}</p>
              <p className="mt-2 text-lg text-mute">
                {site.address.neighborhood}, {site.address.city}, {site.address.state}
              </p>
              {site.hours && <p className="mt-2 text-sm text-mute">{site.hours}</p>}
              <div className="mt-8 flex flex-wrap gap-3">
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
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <a
              href={whatsappUrl(`Hola ${site.name} 👋 Vengo de su página web.`)}
              target="_blank"
              rel="noopener"
              className="reveal group flex items-center gap-4 rounded-3xl bg-wa p-6 text-night transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-10 shrink-0 transition-transform duration-500 group-hover:-rotate-12" />
              <div className="min-w-0">
                <p className="font-display text-2xl">WhatsApp</p>
                <p className="text-sm font-medium opacity-80">La forma más rápida de cotizar</p>
              </div>
              <ArrowRight className="ml-auto size-6 shrink-0 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={site.phoneHref}
              className="reveal group flex items-center gap-4 rounded-3xl border border-line bg-card p-6 transition-colors hover:border-fg/30"
            >
              <Phone className="size-8 shrink-0 text-brand" />
              <div>
                <p className="font-display text-2xl">Llámanos</p>
                <p className="text-sm text-mute">{site.phoneDisplay}</p>
              </div>
            </a>
            <div className="reveal grid grid-cols-3 gap-4">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener"
                  className="group flex flex-col items-center gap-2 rounded-3xl border border-line bg-card py-5 text-sm transition-all hover:-translate-y-1 hover:border-brand/50"
                >
                  <Icon className="size-6 transition-transform duration-500 group-hover:scale-110" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
