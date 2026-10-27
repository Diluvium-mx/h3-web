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
    <div className="relative overflow-hidden">
      <div className="speed-lines pointer-events-none absolute inset-x-0 top-0 h-[32rem] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="pointer-events-none absolute -top-32 -left-32 size-[30rem] rounded-full bg-brand/20 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pt-28 pb-24 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:pt-36">
        <div>
          <header className="stagger">
            <p className="font-tech flex items-center gap-2 text-xs text-brand-hi">
              <span className="h-0.5 w-6 skew-x-[-20deg] bg-brand" />
              Vende tu auto
            </p>
            <h1 className="font-display mt-4 text-5xl sm:text-7xl" style={vars({ "--i": 1 })}>
              Tu auto vale.
              <br />
              <span className="text-brand">Véndelo fácil.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-mute" style={vars({ "--i": 2 })}>
              Llena tus datos en menos de un minuto y te atendemos por WhatsApp.
            </p>
          </header>
          <ol className="mt-10 space-y-3">
            {STEPS.map(({ Icon, title, text }, i) => (
              <li
                key={title}
                className="group flex gap-4 rounded-3xl border border-line bg-card/60 p-5 backdrop-blur-sm transition-colors hover:border-brand/40 animate-rise"
                style={{ animationDelay: `${300 + i * 100}ms` }}
              >
                <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-brand/15 text-brand-hi transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-6">
                  <Icon className="size-6" />
                  <span className="font-tech absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-brand text-[10px] text-white">
                    {i + 1}
                  </span>
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="mt-1 text-sm text-mute">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="animate-rise [animation-delay:200ms] lg:sticky lg:top-28 lg:self-start">
          <SellForm />
        </div>
      </div>
    </div>
  );
}
