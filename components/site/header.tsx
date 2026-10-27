"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";
import { vars } from "@/lib/ui";

const NAV = [
  { href: "/autos", label: "Catálogo" },
  { href: "/vende-tu-auto", label: "Vende tu auto" },
  { href: "/#contacto", label: "Contacto" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHidden(y > 160 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out-expo)] ${
          hidden && !open ? "-translate-y-full" : ""
        } ${
          scrolled || open
            ? "border-b border-line bg-paper/85 shadow-sm backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-paper/85 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label={`${site.name}, inicio`}
            onClick={() => setOpen(false)}
          >
            <Image
              src="/brand/mark-dark.png"
              alt=""
              width={344}
              height={186}
              className="h-7 w-auto transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-skew-x-6 group-hover:scale-105"
              preload
            />
            <span className="font-tech hidden text-[11px] leading-tight text-mute sm:block">
              Seminuevos
              <br />
              <span className="text-fg">Ready to drive</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative px-4 py-2 text-sm font-medium text-fg/80 transition-colors hover:text-fg"
              >
                {item.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 skew-x-[-20deg] bg-brand transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl(`Hola ${site.name} 👋 Vengo de su página web.`)}
              target="_blank"
              rel="noopener"
              className="btn-shine inline-flex h-10 items-center gap-2 rounded-full bg-wa px-3 text-sm font-semibold text-night transition-transform active:scale-95 sm:px-4"
            >
              <WhatsAppIcon className="size-5" />
              <span className="hidden sm:inline">Escríbenos</span>
              <span className="sr-only sm:hidden">WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative grid size-10 place-items-center rounded-full border border-line bg-card/80 shadow-sm md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
            >
              <span
                className={`absolute h-0.5 w-5 bg-fg transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`}
              />
              <span
                className={`absolute h-0.5 w-5 bg-fg transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute h-0.5 w-5 bg-fg transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`}
              />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col bg-paper/95 px-6 pt-24 pb-10 backdrop-blur-xl md:hidden animate-fade"
        >
          <div className="speed-lines pointer-events-none absolute inset-0 opacity-60" />
          <nav className="stagger relative flex flex-col gap-2" aria-label="Menú móvil">
            {[{ href: "/", label: "Inicio" }, ...NAV].map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={vars({ "--i": i })}
                className="font-display flex items-baseline gap-3 py-2 text-4xl active:text-brand"
              >
                <span className="font-tech text-xs text-brand-hi not-italic">0{i + 1}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="relative mt-auto space-y-3 text-sm text-mute">
            <a href={site.phoneHref} className="flex items-center gap-2">
              <Phone className="size-4 text-brand" /> {site.phoneDisplay}
            </a>
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="flex items-center gap-2">
              <MapPin className="size-4 text-brand" /> {site.address.street}, {site.address.city}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
