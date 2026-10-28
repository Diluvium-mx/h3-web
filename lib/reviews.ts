// Reseñas de clientes. Las agrega el dueño desde el panel (/admin/resenas) y se guardan en Redis,
// nunca en el repositorio. El inicio solo muestra la sección si hay al menos una reseña real.

export const REVIEW_SOURCES = ["Google", "Facebook", "Instagram", "TikTok", "WhatsApp", "En persona"] as const;
export type ReviewSource = (typeof REVIEW_SOURCES)[number];

export type Review = {
  id: string;
  name: string;
  text: string;
  /** Frase corta que resume la reseña (mucha gente solo lee eso) */
  highlight?: string;
  /** Auto que compró, p. ej. «BMW M3 2018» */
  car?: string;
  /** 1 a 5 */
  stars: number;
  source?: ReviewSource;
  photo?: string;
  createdAt: string;
};

export function reviewSummary(reviews: Review[]) {
  const count = reviews.length;
  const avg = count ? reviews.reduce((s, r) => s + r.stars, 0) / count : 0;
  return { count, avg: Math.round(avg * 10) / 10 };
}

export function sortReviews(a: Review, b: Review) {
  return b.createdAt.localeCompare(a.createdAt);
}
