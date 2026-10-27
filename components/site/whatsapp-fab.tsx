import { site, whatsappUrl } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl(`Hola ${site.name} 👋 Vengo de su página web.`)}
      target="_blank"
      rel="noopener"
      aria-label="Escríbenos por WhatsApp"
      className="wa-fab group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 grid size-14 place-items-center rounded-full bg-wa text-night shadow-[0_10px_30px_-5px_rgb(37_211_102/0.55)] transition-transform duration-300 ease-[var(--ease-spring)] hover:scale-110 active:scale-95 sm:right-6 sm:bottom-6"
    >
      <span className="absolute inset-0 rounded-full bg-wa animate-pulse-ring" />
      <WhatsAppIcon className="relative size-7 transition-transform duration-500 group-hover:rotate-[-12deg]" />
    </a>
  );
}
