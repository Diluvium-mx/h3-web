"use client";

import Image from "next/image";
import { CalendarCheck, Car as CarIcon, MessageCircle } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { useScrollProgress } from "@/components/home/scroll-progress";

type Props = {
  title: string; // «Ford Mustang GT Premium 2022»
  price: string;
  image: string;
  host: string;
  message: string;
  href: string;
  brandName: string;
};

const STEPS = [
  { Icon: CarIcon, text: "Eliges el auto y tocas «Me interesa»", at: 0.06 },
  { Icon: MessageCircle, text: "El mensaje se escribe solo: modelo, precio y enlace", at: 0.3 },
  { Icon: CalendarCheck, text: "Te respondemos de inmediato y agendamos tu cita", at: 0.86 },
];

// Movimiento firma de la versión 1: al bajar, el WhatsApp se escribe frente al visitante con el auto, el
// precio y el enlace, igual que el que manda el sitio. La sección es alta y su contenido queda fijo.
export function MessageWrites({ title, price, image, host, message, href, brandName }: Props) {
  const { ref, progress: p, animate } = useScrollProgress<HTMLElement>();
  const typedFrom = 0.2;
  const typedTo = 0.78;
  const chars = Math.round(Math.min(1, Math.max(0, (p - typedFrom) / (typedTo - typedFrom))) * message.length);
  const shown = message.slice(0, chars);
  const sent = p >= 0.8;
  const replying = p >= 0.88;

  return (
    <section ref={ref} className={animate ? "relative h-[240vh]" : "relative"} aria-labelledby="mensaje">
      <div
        className={`${animate ? "sticky top-0 h-[100svh] pt-20 lg:pt-0" : "py-20"} flex items-start overflow-hidden lg:items-center`}
      >
        <div className="mx-auto grid w-full max-w-7xl items-center gap-5 px-4 sm:gap-8 sm:px-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 id="mensaje" className="font-display text-[1.75rem] sm:text-5xl">
              Un toque y el mensaje se escribe solo.
            </h2>
            <ol className="mt-5 space-y-2.5 sm:mt-8 sm:space-y-4 [@media(max-height:720px)]:hidden">
              {STEPS.map(({ Icon, text, at }) => {
                const on = p >= at;
                return (
                  <li
                    key={text}
                    className={`flex items-center gap-3 text-[15px] transition-[opacity,transform] duration-500 sm:text-base ${
                      on ? "opacity-100" : "translate-x-1 opacity-35"
                    }`}
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-md transition-colors duration-500 ${
                        on ? "bg-night text-white" : "bg-soft text-dim"
                      }`}
                    >
                      <Icon className="size-[1.1rem]" strokeWidth={1.75} />
                    </span>
                    {text}
                  </li>
                );
              })}
            </ol>
            <a
              href={href}
              target="_blank"
              rel="noopener"
              className={`btn btn-wa btn-shine mt-7 hidden transition-transform duration-500 lg:inline-flex ${replying ? "scale-105" : ""}`}
            >
              <WhatsAppIcon className="size-5" /> Escríbenos ahora
            </a>
          </div>

          {/* El chat */}
          <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-[#efeae2] shadow-[0_30px_70px_-30px_rgb(11_13_16/0.55)] ring-1 ring-line">
            <div className="flex items-center gap-3 bg-[#0b141a] px-4 py-3 text-white">
              <span className="grid size-9 place-items-center rounded-full bg-white">
                <Image src="/brand/mark-dark.png" alt="" width={344} height={186} className="w-6" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">{brandName}</p>
                <p className="text-[11px] text-white/70">{replying ? "escribiendo…" : "en línea"}</p>
              </div>
            </div>
            <div className="flex min-h-[15rem] flex-col justify-end gap-2 p-4 pb-5 sm:min-h-[21rem]">
              {/* Para lectores de pantalla, el mensaje completo */}
              <p className="sr-only">Ejemplo del mensaje: {message}</p>
              <div
                aria-hidden="true"
                className={`ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-[#d9fdd3] p-1.5 text-[13px] leading-snug text-[#111b21] shadow-sm transition-[opacity,transform] duration-500 ${
                  p >= 0.08 ? "opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                <div className="flex gap-2 rounded-lg bg-black/5 p-1.5">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-soft">
                    <Image src={image} alt="" fill sizes="56px" quality={70} className="object-cover" />
                  </span>
                  <span className="min-w-0 py-0.5">
                    <span className="line-clamp-2 font-semibold">
                      {title} | {brandName}
                    </span>
                    <span className="block truncate text-[11px] text-black/50">{host}</span>
                  </span>
                </div>
                <p className="min-h-[3.6em] px-1.5 pt-2 pb-1 whitespace-pre-line">
                  {shown}
                  {!sent && <span className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-pulse bg-[#111b21]" />}
                </p>
                <p className="px-1.5 text-right text-[10px] text-black/45">
                  {sent ? <span className="text-[#53bdeb]">✓✓</span> : "✓"} {sent ? price : ""}
                </p>
              </div>
              <div
                aria-hidden="true"
                className={`inline-flex w-fit items-center gap-1 rounded-xl rounded-tl-sm bg-white px-3.5 py-3 shadow-sm transition-opacity duration-500 ${
                  replying ? "opacity-100" : "opacity-0"
                }`}
              >
                {[0, 1, 2].map((i) => (
                  <span key={i} className="typing-dot size-1.5 rounded-full bg-black/40" style={{ "--i": i } as React.CSSProperties} />
                ))}
              </div>
            </div>
            {/* Barra de escribir */}
            <div className="flex items-center gap-2 border-t border-black/5 bg-[#f0f2f5] px-3 py-2.5" aria-hidden="true">
              <span className="flex-1 truncate rounded-lg bg-white px-3 py-2 text-[13px] text-black/40">
                {sent ? "Mensaje" : shown ? "Escribiendo…" : "Mensaje"}
              </span>
              <span className="grid size-9 place-items-center rounded-full bg-wa-deep text-white">
                <WhatsAppIcon className="size-4" />
              </span>
            </div>
          </div>

          <a href={href} target="_blank" rel="noopener" className="btn btn-wa btn-shine justify-self-start lg:hidden">
            <WhatsAppIcon className="size-5" /> Escríbenos ahora
          </a>
        </div>
      </div>
    </section>
  );
}
