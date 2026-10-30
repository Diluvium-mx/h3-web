import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUp, ArrowUpRight, MapPin, Phone } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import { vars } from "@/lib/ui";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons";

export const SOCIALS = [
  { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.socials.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.socials.tiktok, label: "TikTok", Icon: TikTokIcon },
];

const LINKS = [
  { title: "Compra", items: [
    { href: "/autos", label: "Inventario completo" },
    { href: "/autos?tipo=SUV", label: "SUVs y camionetas" },
    { href: "/autos?tipo=Deportivo", label: "Deportivos" },
    { href: "/autos?tipo=Blindado", label: "Blindados" },
  ] },
  { title: "Vende", items: [
    { href: "/vende-tu-auto", label: "Vende tu auto" },
    { href: "/vende-tu-auto#como-funciona", label: "Cómo funciona" },
  ] },
];

// Enlace con subrayado que se dibuja al pasar el cursor
function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1.5 text-white/75 transition-colors hover:text-white">
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_1px]">
        {children}
      </span>
    </Link>
  );
}

// Tres formas de contactar, grandes y a la mano
function ContactCard({
  href,
  external,
  Icon,
  label,
  value,
  i,
  accent,
}: {
  href: string;
  external?: boolean;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  i: number;
  accent?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={`reveal group flex items-center gap-4 rounded-lg p-4 ring-1 transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 sm:p-5 ${
        accent ? "bg-wa-deep ring-wa-deep hover:bg-wa-deeper" : "bg-white/[0.04] ring-white/10 hover:bg-white/[0.08]"
      }`}
      style={vars({ "--i": i })}
    >
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-md transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-6 ${
          accent ? "bg-white/15" : "bg-white/[0.07]"
        }`}
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-xs ${accent ? "text-white/80" : "text-white/55"}`}>{label}</span>
        <span className="block truncate font-semibold">{value}</span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 opacity-60 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-night text-white">
      <div className="rule-accent h-0.5" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-20">
        {/* Logo y lema */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="reveal reveal-left">
            <Image src="/brand/logo.png" alt={site.name} width={344} height={220} className="h-20 w-auto sm:h-24" />
            <p className="font-display mt-6 max-w-md text-[1.6rem] leading-tight sm:text-3xl">
              Autos verificados, papeles en regla y precio justo.
            </p>
          </div>
          <div className="flex gap-2">
            {SOCIALS.map(({ href, label, Icon }, i) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener"
                aria-label={label}
                className="reveal grid size-12 place-items-center rounded-md bg-white/[0.04] text-white/80 ring-1 ring-white/10 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:bg-white hover:text-night"
                style={vars({ "--i": i })}
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Contacto directo */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          <ContactCard
            href={whatsappUrl(`Hola ${site.name} 👋`)}
            external
            Icon={WhatsAppIcon}
            label="Escríbenos"
            value="WhatsApp"
            i={0}
            accent
          />
          <ContactCard href={site.phoneHref} Icon={Phone} label="Llámanos" value={site.phoneDisplay} i={1} />
          <ContactCard href={site.mapsUrl} external Icon={MapPin} label="Oficina" value={site.address.street} i={2} />
        </div>

        {/* Enlaces y datos */}
        <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 sm:grid-cols-4">
          {LINKS.map(({ title, items }, i) => (
            <div key={title} className="reveal" style={vars({ "--i": i })}>
              <h2 className="font-tech text-[11px] text-white/45">{title}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {items.map((l) => (
                  <li key={l.href}>
                    <FooterLink href={l.href}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="reveal col-span-2" style={vars({ "--i": 2 })}>
            <h2 className="font-tech text-[11px] text-white/45">Visítanos</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              {site.address.street}, {site.address.neighborhood}
              <br />
              {site.address.city}, {site.address.state}
            </p>
            {site.hours && <p className="mt-2 text-sm text-white/50">{site.hours}</p>}
            <p className="mt-2 text-sm text-white/50">Los autos se ven con cita: escríbenos y te la agendamos.</p>
          </div>
        </div>
      </div>

      {/* Nombre gigante que sube al aparecer */}
      <div className="relative mt-12 select-none" aria-hidden="true">
        <p className="reveal font-display px-3 text-center text-[13.5vw] leading-[0.8] font-bold tracking-[-0.06em] whitespace-nowrap text-white/[0.07]">
          H3 Seminuevos
        </p>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {site.name} · Villahermosa, Tabasco, México</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            Precios en pesos mexicanos (MXN). Sujetos a cambio sin previo aviso.
            {/* Acceso discreto para el dueño */}
            <Link href="/admin/login" rel="nofollow" className="text-white/40 underline-offset-2 hover:text-white/80 hover:underline">
              Administración
            </Link>
            <a href="#" className="group inline-flex items-center gap-1.5 text-white/60 hover:text-white">
              Volver arriba
              <ArrowUp className="size-3.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
