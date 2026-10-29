import type { Metadata } from "next";
import { Camera, ClipboardList, MessageCircle } from "lucide-react";
import { SellForm } from "@/components/sell/sell-form";
import { vars } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Vende tu auto en Villahermosa",
  description:
    "¿Quieres vender tu auto en Villahermosa, Tabasco? Cuéntanos de él en un minuto y te atendemos por WhatsApp.",
  alternates: { canonical: "/vende-tu-auto" },
};

const STEPS = [
  { Icon: ClipboardList, title: "Cuéntanos de tu auto", text: "Marca, modelo, año y kilometraje. Toma menos de un minuto." },
  { Icon: Camera, title: "Envía fotos por WhatsApp", text: "El mensaje se arma solo; tú agregas las fotos." },
  { Icon: MessageCircle, title: "Te atendemos por WhatsApp", text: "El encargado revisa tus datos y te responde por ahí." },
];

export default function SellPage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Franja oscura arriba, como la sección del inicio */}
      <div className="glow-night absolute inset-x-0 top-0 -z-10 h-[34rem] overflow-hidden lg:h-[38rem]">
        <div className="light-trails" aria-hidden="true">
          <span style={{ top: "70%", ...vars({ "--d": "6.5s", "--delay": "1s" }) }} />
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-28 pb-24 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:pt-36">
        <div>
          <header className="stagger text-white">
            <p className="font-tech flex items-center gap-3 text-[11px] text-silver">
              <span className="draw-line h-px w-8 rule-accent" />
              Vende tu auto
            </p>
            <h1 className="font-display mt-5 text-[2.8rem] leading-[1.02] sm:text-7xl" style={vars({ "--i": 1 })}>
              ¿Quieres vender <span className="text-gradient">tu auto</span>?
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75" style={vars({ "--i": 2 })}>
              Llena tus datos en menos de un minuto y te atendemos por WhatsApp.
            </p>
          </header>
          <ol className="mt-12 hidden border-t border-line lg:mt-40 lg:block">
            {STEPS.map(({ Icon, title, text }, i) => (
              <li
                key={title}
                className="group flex gap-5 border-b border-line py-5 animate-rise"
                style={{ animationDelay: `${300 + i * 100}ms` }}
              >
                <span className="font-display w-10 shrink-0 text-3xl leading-none text-soft-2 transition-colors duration-500 group-hover:text-fg">
                  0{i + 1}
                </span>
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    <Icon className="size-4 text-brand" aria-hidden="true" />
                    {title}
                  </p>
                  <p className="mt-1 text-sm text-mute">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="animate-rise [animation-delay:200ms] lg:sticky lg:top-28 lg:self-start">
          <SellForm />
          {/* En celular los pasos van debajo del formulario */}
          <ol className="mt-10 border-t border-line lg:hidden">
            {STEPS.map(({ Icon, title, text }, i) => (
              <li key={title} className="flex gap-5 border-b border-line py-5">
                <span className="font-display w-10 shrink-0 text-3xl leading-none text-soft-2">0{i + 1}</span>
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    <Icon className="size-4 text-brand" aria-hidden="true" />
                    {title}
                  </p>
                  <p className="mt-1 text-sm text-mute">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
