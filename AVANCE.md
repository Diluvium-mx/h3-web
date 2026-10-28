# Avance

Lo más reciente va arriba.

## 28 de octubre de 2026 (noche 2) — estilo premium y panel con contraseña cambiable

- Se aplicaron las correcciones del dueño: colores premium (tinta, grafito y plata con rojo de acento),
  título claro, sin «óvalos» ni amarillo, categorías con íconos propios, tarjetas y ficha técnica más
  premium, y «¿Quieres vender tu auto?» más grande y arriba. Se quitaron «13 autos disponibles hoy», el
  presupuesto y el botón de Waze.
- Números de confianza de ejemplo (solo se ven en desarrollo) y microanimaciones.
- Panel: contraseña `12345` que se cambia en **Ajustes**, enlace discreto en el pie de página y formulario
  de auto en 4 pasos. Pasan 26 pruebas del sitio, 23 del panel y 3 de Cloudinary.

Falta: que el dueño revise en su celular, cambie `12345` y ponga los números reales cuando el panel
guarde en Upstash.

## 28 de octubre de 2026 (noche) — pasos para publicar en Netlify

- Se escribieron los pasos actuales de Netlify en el README. Las cuentas nuevas crean proyectos privados
  y hay que hacerlos públicos.
- Para cuidar los créditos, el trabajo diario ahora va a la rama `desarrollo`. `main` solo se actualiza
  cuando el dueño dice «publica».

Falta: que el dueño complete la etapa 1 en Netlify y pase el enlace, para probar desde el celular.

## 28 de octubre de 2026 (cierre) — dudas por auto y pruebas en celular

- Cada ficha tiene «Tus dudas, resueltas»: dueños, factura, servicios, papeles, blindaje y más. Lo que
  falta se pregunta por WhatsApp con un toque. Estos datos se editan en el panel.
- Para probar en un celular real: `npm run movil` muestra un QR, y hay una guía en `PRUEBAS-EN-CELULAR.md`.
  Esa prueba encontró y corrigió un error al agregar fotos fuera de https.
- Se documentaron las respuestas del dueño: qué se ofrece, para quién es y de dónde llega. Pasan las 43
  pruebas.

Falta: probar en iPhone y Android reales, decidir el recorrido (en vivo, 360° o 3D) y crear las cuentas.

## 28 de octubre de 2026 (noche) — fotos por sección y equipamiento

- Cada foto se marca en el panel como exterior, interior, motor o detalles. En la ficha hay pestañas, y la
  galería dice en qué sección va. Se clasificaron las 189 fotos actuales.
- Equipamiento con lista fija de 25 opciones e íconos, en 4 grupos. Los autos actuales solo tienen marcado
  lo que dice su descripción publicada.
- Se reescribió en limpio el método de los videos (`ANALISIS-VIDEOS.md`, sección 2). Pasan las 41 pruebas.

Falta: que el dueño revise secciones y equipamiento en el panel, crear las cuentas y publicar.

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
