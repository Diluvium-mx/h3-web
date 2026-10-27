import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NotFoundContent() {
  return (
    <div className="relative grid min-h-[80svh] place-items-center overflow-hidden px-4 pt-24 pb-16 text-center">
      <div className="speed-lines pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative">
        <p className="font-display text-outline text-[34vw] leading-none sm:text-[14rem]">404</p>
        <h1 className="font-display -mt-4 text-4xl sm:text-5xl">Te saliste de la pista</h1>
        <p className="mx-auto mt-4 max-w-sm text-mute">
          Este auto ya no está o la página no existe. Pero tenemos más esperándote.
        </p>
        <Link
          href="/autos"
          className="btn-shine mt-8 inline-flex h-14 items-center gap-2 rounded-full bg-brand px-7 font-semibold text-white"
        >
          Ver catálogo <ArrowRight className="size-5" />
        </Link>
      </div>
    </div>
  );
}
