// Datos del negocio. Edita aquí teléfono, dirección y redes sociales.
export const site = {
  name: "H3 Seminuevos",
  tagline: "Ready to drive",
  description:
    "Autos seminuevos premium en Villahermosa, Tabasco. Autos verificados, con papeles en regla y precio justo. Te asesoramos por WhatsApp.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.h3seminuevos.com").replace(/\/$/, ""),
  // Número de WhatsApp en formato internacional, sin "+" ni espacios
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "529932467572",
  phoneDisplay: "(993) 246 7572",
  phoneHref: "tel:+529932467572",
  address: {
    street: "Av. Paseo Tabasco #315",
    neighborhood: "Col. Municipal",
    city: "Villahermosa",
    state: "Tabasco",
    country: "MX",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Av.+Paseo+Tabasco+315,+Col.+Municipal,+Villahermosa,+Tabasco",
  // Horario de atención (se muestra en el sitio y en Google como datos estructurados)
  hours: "Lun a Sáb 9:00–17:00 · Dom cerrado",
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "17:00",
  },
  socials: {
    instagram: "https://www.instagram.com/h3seminuevos",
    facebook: "https://www.facebook.com/H3Seminuevos",
    tiktok: "https://www.tiktok.com/@homeronatal",
  },
} as const;

export function whatsappUrl(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
