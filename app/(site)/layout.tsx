import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { LocalBusinessJsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/reveal";
import { ScrollProgress } from "@/components/scroll-progress";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-night focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <ScrollProgress />
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
      <WhatsAppFab />
      <Reveal />
      <LocalBusinessJsonLd />
    </>
  );
}
