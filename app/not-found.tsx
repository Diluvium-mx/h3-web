import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { NotFoundContent } from "@/components/site/not-found-content";

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
