# Avance

Lo más reciente va arriba.

## 28 de octubre de 2026 (tarde) — nueva página de detalle de cada auto

- En celular, el botón de WhatsApp y los quita-miedos ya se ven sin bajar. Todas las fotos están en
  cuadrícula y se agregó «¿Lo decides con alguien más? Mándaselo por WhatsApp».
- Nuevo en el panel: **video opcional** de cada auto. Un enlace de un auto que ya no existe ahora ofrece
  autos de la misma marca.
- Se investigaron 11 repos de GitHub de sitios de autos (`INVESTIGACION-REPOS.md`). Se tomaron las ideas
  que no requieren inventar datos. Pasan las 38 pruebas.

Falta: grabar videos, responder si quieren mostrar rebajas y equipamiento con lista fija, y publicar.

## 28 de octubre de 2026 — nuevo inicio con el método de los videos

- Se transcribieron y analizaron los 2 videos de landing pages. El resumen, los puntos a seguir y cómo se
  aplicaron están en `ANALISIS-VIDEOS.md`.
- Se rehízo el inicio con ese orden: hero completo en la primera pantalla del celular, prueba social real,
  «lo de siempre» contra «en H3», beneficios, 3 pasos, preguntas frecuentes y cierre.
- Nuevo en el panel: **Reseñas**. Solo se muestran si el dueño agrega reseñas reales. También se arregló el
  filtro del catálogo al llegar desde otro enlace.
- Lighthouse en celular: 94–96 de rendimiento y 100 en lo demás. Pasan las 34 pruebas.

Falta: crear las cuentas, publicar, conseguir reseñas reales y responder las preguntas nuevas de
`CONTEXTO.md` (video, medición, garantía).

## 27 de octubre de 2026 (noche) — fotos en Cloudinary y adaptación a Netlify

- Las fotos ahora se guardan y se sirven desde **Cloudinary Free**. Ninguna foto pasa por el hosting.
- El sitio quedó adaptado a **Netlify Free**. La herramienta oficial de Netlify lo compila y lo sirve en
  local, y ahí pasan las pruebas.
- Sigue siendo **$0 al mes**: aguanta ≈ 7,600 visitas completas al mes en los planes gratuitos. Si se
  pasa, Netlify pausa el sitio; no cobra.
- 30 pruebas pasan, incluida la subida a Cloudinary simulada.

Falta: crear las cuentas gratuitas (Netlify, Upstash, Cloudinary), publicar, importar las fotos de
Shopify y seguir con el diseño del inicio y del detalle.

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
