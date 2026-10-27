# Avance

Lo más reciente va arriba.

## 27 de octubre de 2026 (tarde) — decisiones del dueño

- Se pasó todo el sitio a **tema claro**. Se rediseñó el catálogo en celular con colores de marca:
  tipos como «historias», año en amarillo, precio en rojo y características resumidas con íconos.
- Datos faltantes: el sitio invita a preguntar por WhatsApp, sin inventar nada. Expedition = 74,649 km;
  M240i automático. «Vende tu auto» ya no dice que compran. Solo Villahermosa, Tabasco.
- Hosting medido con números: **Railway Free no alcanza** el mes; **Netlify Free sí**, hasta ≈ 2,500
  visitas completas al mes (≈ 8,600 con fotos en Cloudinary).
- Se optimizaron las fotos: una visita completa pasó de ≈ 6.6 MB a ≈ 3.0 MB. Las 24 pruebas pasan.

Falta: decidir dónde guardar las fotos (propuesta: Cloudinary Free), adaptar el despliegue a Netlify y
seguir con el diseño del inicio y del detalle.

## 27 de octubre de 2026

- Se construyó el sitio nuevo con los 13 autos reales de Shopify (inicio, catálogo con filtros, página
  de cada auto con WhatsApp prellenado, «Vende tu auto») y el panel `/admin` con importador de Shopify.
- Se optimizó la velocidad (Lighthouse en celular: 91–95) y se probó con 24 pruebas automáticas.
- Se verificó Netlify: es gratis con 300 créditos al mes, pero si se acaban el sitio se pausa. También
  se quitó la sección de personalización y se agregó el horario.
- Se subió todo al repositorio `Diluvium-mx/h3-web` con `CONTEXTO.md` y este archivo.

Falta: decidir hosting (Netlify o Vercel Pro), mejorar el catálogo y publicar.
