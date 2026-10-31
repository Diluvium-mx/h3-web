import type { Metadata } from "next";
import Image from "next/image";
import {
  Aperture,
  BadgeCheck,
  CalendarCheck,
  Camera,
  ClipboardList,
  FileText,
  Gauge,
  Handshake,
  SearchCheck,
  ShieldCheck,
  TrendingUp,
  UserX,
} from "lucide-react";
import { SellForm } from "@/components/sell/sell-form";
import { vars } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Vende tu auto en Villahermosa",
  description:
    "Vende tu auto en Villahermosa, Tabasco y sácale más valor: filtramos a los interesados, nos encargamos de las citas y te ayudamos con el papeleo y las placas.",
  alternates: { canonical: "/vende-tu-auto" },
};

// Lo que gana quien vende con H3 (dato del dueño, 30-oct)
const BENEFITS = [
  { Icon: TrendingUp, title: "Ganas más que en un lote", text: "Sácale más valor a tu vehículo." },
  { Icon: ShieldCheck, title: "Evita estafas", text: "Filtramos a los interesados antes de que te contacten." },
  { Icon: UserX, title: "Sin citas con desconocidos", text: "Nosotros nos encargamos de las citas." },
  { Icon: FileText, title: "Papeleo y placas", text: "Te ayudamos con el papeleo, el trámite y la baja de las placas." },
  { Icon: Gauge, title: "Evaluación correcta", text: "Valuamos tu auto como debe ser." },
];

// Pasos (31-oct, pedido del dueño: evaluación en sitio, fotos para publicar y valoración final)
const STEPS = [
  { Icon: ClipboardList, title: "Cuéntanos de tu auto", text: "Marca, modelo, año y kilometraje. Toma menos de un minuto." },
  { Icon: Camera, title: "Mándanos fotos por WhatsApp", text: "El mensaje se arma solo; tú agregas las fotos." },
  { Icon: SearchCheck, title: "Evaluamos tu auto en sitio", text: "Lo revisamos en persona para conocer su estado real." },
  { Icon: Aperture, title: "Tomamos las fotos para publicarlo", text: "Nosotros hacemos las fotos con las que se va a anunciar." },
  { Icon: BadgeCheck, title: "Valoración final", text: "Con la revisión hecha, te damos el precio correcto de tu auto." },
  {
    Icon: Handshake,
    title: "Nos encargamos de la venta",
    text: "Filtramos a los interesados, agendamos las citas y te ayudamos con el papeleo y las placas.",
  },
];

export default function SellPage() {
  return (
    <>
      {/* Encabezado oscuro con la promesa principal */}
      <section className="glow-night relative overflow-hidden text-white">
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-28 pb-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-36 lg:pb-20">
          <header className="stagger">
            <p className="font-tech flex items-center gap-3 text-[11px] text-silver">
              <span className="draw-line rule-accent h-px w-8" />
              Vende tu auto
            </p>
            <h1 className="font-display mt-5 text-[2.6rem] leading-[1.02] sm:text-6xl" style={vars({ "--i": 1 })}>
              Sácale más valor a tu vehículo.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75" style={vars({ "--i": 2 })}>
              Normalmente ganas más que vendiéndolo a un lote de autos. Tú nos cuentas de tu auto; nosotros nos
              encargamos de lo difícil.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-[13px]" style={vars({ "--i": 3 })}>
              {["Sin estafas", "Sin citas con desconocidos", "Papeleo y placas"].map((t) => (
                <li key={t} className="rounded-sm bg-white/[0.07] px-2.5 py-1.5 text-white/85 ring-1 ring-white/10">
                  {t}
                </li>
              ))}
            </ul>
          </header>
          <div className="reveal reveal-zoom relative hidden aspect-[16/10] overflow-hidden rounded-lg sm:block">
            <Image
              src="/img/vende-tu-auto.webp"
              alt="Llave de un auto junto a una carpeta de documentos y una pluma"
              fill
              preload
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-20">
        {/* En celular el formulario va primero */}
        <div className="animate-rise [animation-delay:200ms] lg:sticky lg:top-28 lg:order-2 lg:self-start">
          <SellForm />
        </div>

        <div className="lg:order-1">
          <h2 className="font-display reveal text-[1.9rem] sm:text-4xl">Por qué vender con H3</h2>
          <ul className="mt-7 space-y-5">
            {BENEFITS.map(({ Icon, title, text }, i) => (
              <li key={title} className="reveal group flex gap-4" style={vars({ "--i": i })}>
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-md transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 ${
                    i === 0 ? "bg-ok text-white" : "bg-night text-white"
                  }`}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span>
                  <b className="block font-semibold">{title}</b>
                  <span className="text-sm leading-relaxed text-mute">{text}</span>
                </span>
              </li>
            ))}
          </ul>

          <h2 id="como-funciona" className="font-display reveal mt-14 scroll-mt-28 text-[1.9rem] sm:text-4xl">
            Cómo funciona
          </h2>
          <ol className="relative mt-7 space-y-7">
            <span className="absolute top-5 bottom-5 left-5 w-px bg-line" aria-hidden="true" />
            {STEPS.map(({ Icon, title, text }, i) => (
              <li key={title} className="reveal relative flex gap-4" style={vars({ "--i": i })}>
                <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-card text-fg ring-1 ring-line">
                  <Icon className="size-[1.1rem]" strokeWidth={1.75} />
                </span>
                <div className="pt-0.5">
                  <p className="text-xs font-semibold text-dim">Paso {i + 1}</p>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-mute">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="reveal mt-10 flex items-start gap-3 rounded-lg bg-card p-4 text-sm text-mute ring-1 ring-line">
            <CalendarCheck className="mt-0.5 size-4 shrink-0 text-fg" aria-hidden="true" />
            Las citas con los interesados las agendamos nosotros. Tú no tienes que recibir a desconocidos.
          </p>
        </div>
      </div>
    </>
  );
}
