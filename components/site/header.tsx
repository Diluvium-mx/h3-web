"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";
import { vars } from "@/lib/ui";

const NAV = [
  { href: "/autos", label: "Inventario" },
  { href: "/vende-tu-auto", label: "Vende tu auto" },
  { href: "/#contacto", label: "Contacto" },
];

const DARK_TOP = new Set(["/", "/autos", "/vende-tu-auto"]);

// La ruta solo se conoce al pedir la página (autos que no estaban generados de antemano): mientras llega,
// se muestra el encabezado claro. Sin <Suspense>, Netlify no puede armar esas páginas.
export function Header() {
  return (
    <Suspense fallback={<HeaderView pathname={null} />}>
      <HeaderWithPath />
    </Suspense>
  );
}

function HeaderWithPath() {
  return <HeaderView pathname={usePathname()} />;
}

function HeaderView({ pathname }: { pathname: string | null }) {
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

  // Avisa a otras barras fijas (p. ej. el buscador del inventario) si el encabezado está oculto
  useEffect(() => {
    document.documentElement.dataset.header = hidden && !open ? "oculto" : "visible";
  }, [hidden, open]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Arriba de todo, en las páginas que empiezan con una franja oscura, el encabezado va en blanco
  const dark = (pathname !== null && DARK_TOP.has(pathname) && !scrolled) || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-origin-border transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out-expo)] ${
          hidden && !open ? "-translate-y-full" : ""
        } ${
          dark
            ? "border-b border-transparent bg-gradient-to-b from-night/75 to-transparent"
            : scrolled
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
            <span className="relative block h-7 w-[3.25rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105">
              <Image
                src="/brand/mark-dark.png"
                alt=""
                width={344}
                height={186}
                className={`absolute inset-0 h-7 w-auto transition-opacity duration-500 ${dark ? "opacity-0" : ""}`}
                preload
              />
              <Image
                src="/brand/mark.png"
                alt=""
                width={344}
                height={186}
                className={`absolute inset-0 h-7 w-auto transition-opacity duration-500 ${dark ? "" : "opacity-0"}`}
                preload
              />
            </span>
            <span
              className={`font-tech hidden text-[11px] leading-tight transition-colors sm:block ${dark ? "text-white/60" : "text-mute"}`}
            >
              Seminuevos
              <br />
              <span className={dark ? "text-white" : "text-fg"}>Ready to drive</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative px-4 py-2 text-sm font-medium transition-colors ${
                  dark ? "text-white/80 hover:text-white" : "text-fg/80 hover:text-fg"
                }`}
              >
                {item.label}
                <span className="rule-accent absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl(`Hola ${site.name} 👋 Vengo de su página web.`)}
              target="_blank"
              rel="noopener"
              className="btn btn-wa btn-shine min-h-10 gap-2 px-3 text-sm sm:px-4"
              style={vars({ "--shine-delay": "2.6s" })}
            >
              <WhatsAppIcon className="size-5" />
              <span className="hidden sm:inline">Escríbenos</span>
              <span className="sr-only sm:hidden">WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={`relative grid size-10 place-items-center rounded-md border transition-colors md:hidden ${
                dark ? "border-white/25 bg-white/10 backdrop-blur-md" : "border-line bg-card/80"
              }`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
            >
              {[open ? "rotate-45" : "-translate-y-1.5", open ? "opacity-0" : "", open ? "-rotate-45" : "translate-y-1.5"].map(
                (pos, i) => (
                  <span
                    key={i}
                    className={`absolute h-0.5 w-5 transition-[transform,opacity] duration-300 ${dark ? "bg-white" : "bg-fg"} ${pos}`}
                  />
                ),
              )}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          className="glow-night fixed inset-0 z-[45] flex flex-col px-6 pt-24 pb-10 text-white md:hidden animate-fade"
        >
          <nav className="stagger relative flex flex-col gap-1" aria-label="Menú móvil">
            {[{ href: "/", label: "Inicio" }, ...NAV].map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={vars({ "--i": i })}
                className="group font-display flex items-center gap-4 border-b border-white/10 py-4 text-[2rem] active:text-brand-glow"
              >
                <span className="font-tech text-[10px] text-brand-glow">0{i + 1}</span>
                {item.label}
                <ArrowRight className="ml-auto size-5 text-white/40 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            ))}
          </nav>
          <div className="relative mt-auto space-y-5">
            <a
              href={whatsappUrl(`Hola ${site.name} 👋 Vengo de su página web.`)}
              target="_blank"
              rel="noopener"
              className="btn btn-wa btn-shine w-full text-base"
            >
              <WhatsAppIcon className="size-5" /> Escríbenos por WhatsApp
            </a>
            <div className="space-y-3 text-sm text-white/70">
              <a href={site.phoneHref} className="flex items-center gap-2">
                <Phone className="size-4 text-brand-glow" /> {site.phoneDisplay}
              </a>
              <a href={site.mapsUrl} target="_blank" rel="noopener" className="flex items-center gap-2">
                <MapPin className="size-4 text-brand-glow" /> {site.address.street}, {site.address.city}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
