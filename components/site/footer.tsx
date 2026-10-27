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
    <footer className="relative overflow-hidden border-t border-line bg-card">
      <div className="h-1.5 bg-gradient-to-r from-brand from-60% to-volt" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-6 left-0 right-0 select-none overflow-hidden">
        <p className="font-display text-outline whitespace-nowrap text-[22vw] leading-none opacity-[0.07] md:text-[16vw]">
          Ready to drive
        </p>
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image src="/brand/logo-dark.png" alt={site.name} width={344} height={220} className="h-16 w-auto" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-mute">{site.description}</p>
          <div className="mt-6 flex gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full border border-line text-fg/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:text-fg"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-tech text-xs text-dim">Explora</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/autos" className="hover:text-brand-hi">Catálogo completo</Link></li>
            <li><Link href="/autos?tipo=SUV" className="hover:text-brand-hi">SUVs y camionetas</Link></li>
            <li><Link href="/autos?tipo=Deportivo" className="hover:text-brand-hi">Deportivos</Link></li>
            <li><Link href="/autos?tipo=Blindado" className="hover:text-brand-hi">Blindados</Link></li>
            <li><Link href="/vende-tu-auto" className="hover:text-brand-hi">Vende tu auto</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-tech text-xs text-dim">Visítanos</h2>
          <ul className="mt-4 space-y-3 text-sm text-fg/90">
            <li>
              <a href={site.mapsUrl} target="_blank" rel="noopener" className="flex gap-2 hover:text-brand-hi">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>
                  {site.address.street}, {site.address.neighborhood}
                  <br />
                  {site.address.city}, {site.address.state}
                </span>
              </a>
            </li>
            <li>
              <a href={site.phoneHref} className="flex items-center gap-2 hover:text-brand-hi">
                <Phone className="size-4 text-brand" /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(`Hola ${site.name} 👋`)}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2 hover:text-wa-dark"
              >
                <WhatsAppIcon className="size-4 text-wa-dark" /> WhatsApp
              </a>
            </li>
            {site.hours && <li className="text-mute">{site.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-dim sm:flex-row sm:justify-between sm:px-6">
          <p>© {site.name} · Villahermosa, Tabasco, México</p>
          <p>Precios en pesos mexicanos (MXN). Sujetos a cambio sin previo aviso.</p>
        </div>
      </div>
    </footer>
  );
}
