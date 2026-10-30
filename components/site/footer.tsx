import Image from "next/image";
import Link from "next/link";
import { ArrowUp, MapPin, Phone } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import { vars } from "@/lib/ui";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons";

export const SOCIALS = [
  { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.socials.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.socials.tiktok, label: "TikTok", Icon: TikTokIcon },
];

const LINKS = [
  { href: "/autos", label: "Inventario" },
  { href: "/vende-tu-auto", label: "Vende tu auto" },
  { href: "/#preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/#contacto", label: "Contacto" },
];

// Pie de página (rediseño 31-oct): centrado y sencillo, con el logo real de H3 (su propia letra) como
// protagonista, los enlaces en una línea, 3 formas de contacto y las redes.
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night text-white">
      <div className="draw-line rule-accent mx-auto h-0.5 w-full" aria-hidden="true" />
      <div className="mx-auto max-w-4xl px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-20">
        <Link href="/" aria-label={`${site.name}, inicio`} className="reveal reveal-zoom inline-block">
          <Image src="/brand/logo.png" alt={site.name} width={344} height={220} className="mx-auto h-24 w-auto sm:h-28" />
        </Link>
        <p className="reveal mx-auto mt-6 max-w-md leading-relaxed text-white/65">
          Autos seminuevos premium en Villahermosa, Tabasco. Verificados, con papeles en regla y a precio justo.
        </p>

        <nav aria-label="Pie de página" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm">
            {LINKS.map((l, i) => (
              <li key={l.href} className="reveal" style={vars({ "--i": i })}>
                <Link
                  href={l.href}
                  className="text-white/80 hover:text-white bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size,color] duration-500 hover:bg-[length:100%_1px]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappUrl(`Hola ${site.name} 👋`)}
            target="_blank"
            rel="noopener"
            className="reveal btn btn-wa btn-shine"
            style={vars({ "--i": 0 })}
          >
            <WhatsAppIcon className="size-5" /> WhatsApp
          </a>
          <a
            href={site.phoneHref}
            className="reveal btn text-white ring-1 ring-white/20 hover:bg-white hover:text-night"
            style={vars({ "--i": 1 })}
          >
            <Phone className="size-4" /> {site.phoneDisplay}
          </a>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener"
            className="reveal btn text-white ring-1 ring-white/20 hover:bg-white hover:text-night"
            style={vars({ "--i": 2 })}
          >
            <MapPin className="size-4" /> Cómo llegar
          </a>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {SOCIALS.map(({ href, label, Icon }, i) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener"
              aria-label={label}
              className="reveal grid size-11 place-items-center rounded-md text-white/75 transition-all duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:bg-white/10 hover:text-white"
              style={vars({ "--i": i })}
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>

        <p className="mt-8 text-sm text-white/55">
          {site.address.street}, {site.address.neighborhood}, {site.address.city}, {site.address.state}
          <span className="block">
            {site.hours} · Los autos se ven con cita
          </span>
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-6 text-center text-xs text-white/45 sm:flex-row sm:justify-between sm:px-6 sm:text-left">
          <p>
            © {site.name} · Villahermosa, Tabasco, México · Precios en pesos mexicanos (MXN), sujetos a cambio sin
            previo aviso.
          </p>
          <p className="flex items-center gap-4">
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
