"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

// YouTube «ligero»: muestra la foto del auto y solo carga el reproductor al tocar play
// (así la página no descarga nada de YouTube si nadie ve el video).
export function YouTubeVideo({ id, title, cover, vertical }: { id: string; title: string; cover?: string; vertical?: boolean }) {
  const [play, setPlay] = useState(false);
  return (
    <div
      className={`relative mx-auto overflow-hidden rounded-lg bg-night ring-1 ring-line ${
        vertical ? "aspect-[9/16] max-w-sm" : "aspect-video"
      }`}
    >
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={`Video: ${title}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          className="group absolute inset-0 grid place-items-center"
          aria-label={`Reproducir video: ${title}`}
        >
          {cover && (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 92vw"
              quality={70}
              className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
          <span className="relative grid size-20 place-items-center rounded-full bg-white/95 text-night shadow-[0_14px_40px_-10px_rgb(0_0_0/0.6)] ring-8 ring-white/20 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:scale-110">
            <Play className="ml-1 size-9 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}
