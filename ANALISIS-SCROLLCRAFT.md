# Análisis de Scrollcraft y qué nos sirve para H3

Fecha: 30 de octubre de 2026.

## 1. Qué es

- **Scrollcraft** es un «skill» (instrucciones + herramientas) para que un agente de código como Claude Code
  haga sitios con animaciones al hacer scroll que **no se vean hechos con IA**. Es de Nate Herk (AI
  Automation Society).
- La página que mandó el dueño pide un correo para mandarlo, pero el skill completo está **publicado y es
  gratis** en GitHub, con licencia MIT: <https://github.com/nateherkai/scroll-craft>. Se leyó de ahí; no
  hizo falta dejar ningún correo.
- Trae: un método de diseño, guías (tipografía, espacios, color, profundidad, movimiento), un motor propio
  de animaciones (HTML + JavaScript), scripts para generar imágenes y videos con IA (kie.ai, de pago) y un
  verificador que recorre la página con un navegador y mide problemas.
- **No se usa tal cual en H3:** su motor está hecho para páginas sueltas en HTML, y H3 está en Next.js
  con catálogo, fichas y panel. Lo que sí sirve son sus **principios** y algunas técnicas, hechas dentro
  del sitio actual.

## 2. Su método, resumido

1. **Entrevista de 8 preguntas:** ambiente en 3 a 5 palabras, recorrido por secciones, dónde va calmado y
   dónde intenso, qué debe sentir el visitante y el **único momento que debe recordar**, algo que ningún
   otro sitio haga, qué tan lejos del «minimalismo premium», un mundo continuo o escenas separadas, y qué
   fotos o videos hay.
2. **Trayecto:** de 4 a 7 pasos de lo que el visitante sabe o siente (reconocimiento, tensión, giro,
   sustancia, opciones, decisión). Una sección que no sirve a un paso se quita.
3. **Curva de sensaciones y un solo «pico»:** una emoción por sección, nunca dos iguales seguidas, y un
   momento cumbre que recibe el mejor material y el mayor espacio.
4. **Variedad de «dispositivos» de scroll** (al menos 4 distintos, nunca el mismo dos veces seguidas):
   video que avanza con el scroll, sección fija mientras cambia el contenido, recorrido lateral, cortinilla,
   texto que se arma, capas a distinta velocidad, números, fondo que cambia de color y respuesta al puntero.
5. **Un «movimiento firma»:** una interacción que solo existe en ese sitio.
6. **Hero con capas reales** (su requisito base para algo premium): fondo, sujeto recortado y primer
   plano que se mueven a velocidades distintas; el título puede pasar **detrás** del sujeto; el sujeto queda
   anclado al piso (en un auto: las llantas sobre el piso).
7. **Verificar con capturas** en celular, escritorio y con animaciones reducidas: scroll que no cambia nada,
   textos que nunca se ven completos, y contraste del texto **sobre la foto real** en cada posición.

## 3. Lo que H3 ya hace igual

- Fotos reales en lugar de imágenes genéricas; texto real (no metido en imágenes).
- Una sola acción principal (WhatsApp), con el mismo nombre en toda la página.
- Sin cifras inventadas (se quitaron los números de confianza).
- Dos tipografías (Saira y Geist), negro que no es negro puro, animaciones solo con `transform` y
  `opacity`, y respeto a «reducir movimiento».
- Entrevista previa (las 3 preguntas de los videos) y revisión con capturas en celular.

## 4. Lo que, según su lista, todavía «delata» IA en H3

Revisión del sitio actual (rama `desarrollo`) contra su lista de rechazo:

| Lo que dice la guía | En H3 hoy |
| --- | --- |
| Nada de **texto con degradado** | 5 lugares: «premium», «tu auto» (2) y «ya no vuelve» |
| **Etiqueta pequeña sobre cada título** como máximo 1 de cada 3 secciones | 11 títulos con etiqueta («INVENTARIO», «LA DIFERENCIA H3»…) |
| Nada de **números de sección** (01, 02, 03) salvo que el orden importe | 7 lugares; en los pasos sí importa, en el menú del celular no |
| Nada de **tres tarjetas iguales** en fila | «Tu próximo auto en 3 pasos» |
| Nada de **etiquetas encima de las fotos** | «Único dueño», «Bajo km», «Auto verificado» y el nombre del auto en el hero |
| **Vidrio y desenfoque** solo con un propósito | Accesos rápidos y etiqueta del hero |
| Evitar la **paleta crema con dorado** | Fondo cálido + champaña, muy cerca de esa trampa |
| **Un solo color de acento** | Carmesí + champaña + azul (en resplandores) + verde de WhatsApp |
| Hero: título de **máximo 2 líneas**, **máximo 4 textos** | En celular el título ocupa 4 líneas y hay 5 o 6 elementos de texto |
| **Grano** de 4 a 5 % en fondos oscuros | No hay; los fondos oscuros pueden verse planos |

Nota: el dueño aprobó el título y la franja de marcas. La franja **no** es un adorno: son las marcas reales
que se venden, así que se queda.

## 5. Propuestas para H3, en orden

**A. Limpieza «que no parezca IA»** (rápida, sin costo):
- Quitar el texto con degradado; el énfasis va con peso o un solo color sólido.
- Dejar etiqueta solo en 1 de cada 3 títulos y quitar los números del menú.
- Cambiar los 3 pasos de tarjetas iguales a una línea de tiempo.
- Pasar las etiquetas de las fotos debajo de la foto.
- Paleta: un solo acento (carmesí) con plata fría y cromo en lugar de champaña. Es la opción que la guía
  sugiere para lo automotriz y va con BMW, Mercedes y Porsche.
- Grano muy ligero en los fondos oscuros.

**B. Hero con capas reales** (el «wow» que pidió el dueño):
- Con **una foto real** (por ejemplo, la G63): recortar el auto, reconstruir el fondo detrás de él y
  separarlos en planos.
- Al bajar, el fondo se aleja más lento, el auto se queda anclado al piso y el título pasa **detrás** del
  auto. En celular se compone aparte.
- El ambiente que la guía recomienda para autos es **«Nocturno»**: noche, luces reales, reflejos en piso
  mojado.
- Costo: unos pocos créditos de Arcads para recortar y rellenar. Es honesto porque el auto es el real.
- Necesita que el dueño elija el auto (**sin decidir**).

**C. Movimiento firma de H3: «el mensaje se escribe solo»:**
- Al bajar, el WhatsApp se arma frente al visitante: foto del auto, precio y enlace.
- Convierte en experiencia lo que distingue a H3 (el mensaje ya lleva el auto) y lleva directo a la acción.
- Se puede construir sobre la animación de WhatsApp que el dueño ya aprobó.

**D. Recorrido de un auto con el scroll:**
- Una sección fija donde pasan exterior → interior → motor de un auto, con sus datos.
- Usa las fotos ya clasificadas por sección.

**E. Verificación nueva:**
- Agregar a las pruebas el contraste del texto sobre las fotos del hero en varias posiciones del scroll.
- Agregar capturas con «reducir movimiento».

**Lo que no conviene copiar:**
- Videos generados que avanzan con el scroll: cuestan, pesan mucho en celular y gastan ancho de banda de
  Netlify.
- Un «mundo continuo» de punta a punta.
- El registro de «huellas» entre sitios: sirve a quien hace muchos sitios, no a uno.

## 6. Riesgos

- Rendimiento en celulares de gama media: todo debe animarse con `transform`/`opacity` y probarse en un
  teléfono real (la guía insiste en que el navegador de prueba no reproduce un iPhone).
- Las animaciones de scroll solo con CSS no funcionan en todos los navegadores; hace falta un respaldo que se
  vea completo sin animación.
- No tocar lo que el dueño ya aprobó: título, franja de marcas, animación de WhatsApp y tarjetas con la
  animación al abrir.
