import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons";

export const SOCIALS = [
  { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.socials.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.socials.tiktok, label: "TikTok", Icon: TikTokIcon },
];

export function Footer() {
  return (
    <footer className="glow-night relative overflow-hidden text-white">
      <div className="rule-accent h-0.5" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src="/brand/logo.png" alt={site.name} width={344} height={220} className="h-16 w-auto" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">{site.description}</p>
          <div className="mt-6 flex gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener"
                aria-label={label}
                className="grid size-11 place-items-center rounded-md border border-white/15 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5 hover:text-white"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-tech text-[11px] text-white/45">Explora</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/autos" className="text-white/80 transition-colors hover:text-white">Inventario completo</Link></li>
            <li><Link href="/autos?tipo=SUV" className="text-white/80 transition-colors hover:text-white">SUVs y camionetas</Link></li>
            <li><Link href="/autos?tipo=Deportivo" className="text-white/80 transition-colors hover:text-white">Deportivos</Link></li>
            <li><Link href="/autos?tipo=Blindado" className="text-white/80 transition-colors hover:text-white">Blindados</Link></li>
            <li><Link href="/vende-tu-auto" className="text-white/80 transition-colors hover:text-white">Vende tu auto</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-tech text-[11px] text-white/45">Visítanos</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>
              <a href={site.mapsUrl} target="_blank" rel="noopener" className="flex gap-2 transition-colors hover:text-white">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-glow" />
                <span>
                  {site.address.street}, {site.address.neighborhood}
                  <br />
                  {site.address.city}, {site.address.state}
                </span>
              </a>
            </li>
            <li>
              <a href={site.phoneHref} className="flex items-center gap-2 transition-colors hover:text-white">
                <Phone className="size-4 text-brand-glow" /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(`Hola ${site.name} 👋`)}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <WhatsAppIcon className="size-4 text-wa" /> WhatsApp
              </a>
            </li>
            {site.hours && <li className="text-white/55">{site.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/45 sm:flex-row sm:justify-between sm:px-6">
          <p>© {site.name} · Villahermosa, Tabasco, México</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            Precios en pesos mexicanos (MXN). Sujetos a cambio sin previo aviso.
            {/* Acceso discreto para el dueño */}
            <Link href="/admin/login" rel="nofollow" className="text-white/40 underline-offset-2 hover:text-white/80 hover:underline">
              Administración
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
