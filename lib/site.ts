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
  // Dirección de la oficina (dato del dueño, 31-oct)
  address: {
    street: "C. Pedro C. Colorado 216",
    neighborhood: "Col. Municipal",
    postalCode: "86090",
    city: "Villahermosa",
    state: "Tabasco",
    country: "MX",
  },
  // Enlace de Google Maps que dio el dueño (31-oct): lo usan «Cómo llegar» y los demás botones del mapa
  mapsUrl: "https://maps.app.goo.gl/dqzfUgVbiPhQqCmJ9",
  // Mapa incrustado en «Visítanos» (Google Maps, sin llave), en el punto exacto del enlace del dueño
  mapsEmbed: "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s17.9849894,-92.9234282!6i17",
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
