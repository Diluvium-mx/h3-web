import { site, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl(`Hola ${site.name} 👋 Vengo de su página web.`)}
      target="_blank"
      rel="noopener"
      aria-label="Escríbenos por WhatsApp"
      className="wa-fab btn-shine shine-auto group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid size-14 place-items-center rounded-full bg-[linear-gradient(135deg,#13a052,var(--color-wa-deep)_45%,var(--color-wa-deeper))] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_14px_32px_-10px_rgb(37_211_102/0.75)] transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-110 active:scale-95 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="relative size-7 transition-transform duration-500 group-hover:rotate-[-12deg]" />
    </a>
  );
}
