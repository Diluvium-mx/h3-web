import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NotFoundContent() {
  return (
    <div className="relative grid min-h-[80svh] place-items-center overflow-hidden px-4 pt-24 pb-16 text-center">
      <div className="relative">
        <p className="font-display text-outline text-[34vw] leading-none sm:text-[14rem]">404</p>
        <h1 className="font-display -mt-4 text-4xl sm:text-5xl">Te saliste de la pista</h1>
        <p className="mx-auto mt-4 max-w-sm text-mute">
          Este auto ya no está o la página no existe. Pero tenemos más esperándote.
        </p>
        <Link href="/autos" className="btn btn-dark btn-shine group mt-8">
          Ver inventario
          <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
