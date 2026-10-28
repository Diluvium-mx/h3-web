import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { reviewSummary, type Review } from "@/lib/reviews";
import { vars } from "@/lib/ui";

export function Stars({ value, className = "size-4" }: { value: number; className?: string }) {
  return (
    <span className="flex text-fg" role="img" aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${className} ${i < Math.round(value) ? "fill-current" : "text-soft-2"}`} />
      ))}
    </span>
  );
}

// Muro de reseñas reales (las agrega el dueño en el panel). Todas a la vista, sin carrusel.
export function ReviewsWall({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;
  const { count, avg } = reviewSummary(reviews);
  // Las que traen foto van primero: son la prueba más fuerte
  const ordered = [...reviews].sort((a, b) => Number(Boolean(b.photo)) - Number(Boolean(a.photo)));
  return (
    <section className="py-16 sm:py-24" aria-labelledby="resenas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="resenas"
          eyebrow="Clientes H3"
          title={
            <>
              Lo que dicen quienes ya compraron
            </>
          }
        />
        <div className="reveal -mt-2 mb-8 flex items-center gap-3">
          <Stars value={avg} className="size-5" />
          <p className="text-sm text-mute">
            <b className="text-fg">{avg.toFixed(1)} de 5</b> en {count} {count === 1 ? "reseña" : "reseñas"}
          </p>
        </div>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {ordered.slice(0, 9).map((r, i) => (
            <figure
              key={r.id}
              className="reveal mb-4 break-inside-avoid overflow-hidden rounded-lg bg-card ring-1 ring-line transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1"
              style={vars({ "--i": i })}
            >
              {r.photo && (
                <div className="relative aspect-[4/3] bg-soft">
                  <Image
                    src={r.photo}
                    alt={r.car ? `${r.name} con su ${r.car}` : `Foto de ${r.name}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                    quality={70}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="relative p-5 sm:p-6">
                <Quote className="absolute top-5 right-5 size-8 text-soft-2" aria-hidden="true" />
                <Stars value={r.stars} />
                {r.highlight && <p className="font-display mt-3 text-xl leading-tight">«{r.highlight}»</p>}
                <blockquote className="mt-3 leading-relaxed text-fg/80">{r.text}</blockquote>
                <figcaption className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <b>{r.name}</b>
                  {r.car && <span className="text-mute">· {r.car}</span>}
                  {r.source && (
                    <span className="font-tech ml-auto border-l border-line pl-2 text-[10px] text-dim">
                      {r.source === "En persona" ? "En persona" : `Reseña de ${r.source}`}
                    </span>
                  )}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
