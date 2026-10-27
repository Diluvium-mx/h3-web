# Contexto del proyecto: página web de H3 Seminuevos

Última actualización: 27 de octubre de 2026.
Regla: aquí no se inventa nada. Lo que no está decidido dice **«sin decidir»**.

---

## 1. Qué es H3

- **Nombre:** H3 Seminuevos. Lema del logo: «Ready to drive».
- **Ciudad:** Villahermosa, Tabasco, México. Dirección: Av. Paseo Tabasco #315, Col. Municipal.
- **Contacto:** WhatsApp y teléfono (993) 246 7572.
- **Redes:** Instagram [@h3seminuevos](https://www.instagram.com/h3seminuevos),
  Facebook [H3Seminuevos](https://www.facebook.com/H3Seminuevos),
  TikTok [@homeronatal](https://www.tiktok.com/@homeronatal).
- **Horario:** lunes a sábado de 9:00 a 17:00. Domingo cerrado.
- **Qué vende:** autos seminuevos, la mayoría de gama alta. Al 27-oct-2026 hay 13 autos publicados,
  de $209,000 a $2,850,000 MXN. Algunos ejemplos son una Mercedes-AMG G63, un BMW M3, un Mustang GT,
  una Cheyenne High Country y dos camionetas blindadas.
- **Otros servicios:**
  - La gente también los busca para **vender su auto**. Cómo lo hacen (compra directa, consignación
    u otra forma): **sin decidir / sin especificar**.
  - El dueño **hace modificaciones y personalización** a autos, en su mayoría de gama alta. Sí lo
    ofrecen, pero **por ahora no va en la página** (decisión del 27-oct-2026).
- **A quién:** personas de Villahermosa y de ciudades cercanas. Qué ciudades exactamente: **sin decidir**.
  La lista que hoy usa el sitio es una propuesta: Nacajuca, Cárdenas, Comalcalco, Cunduacán, Paraíso,
  Jalpa de Méndez, Macuspana, Teapa, Huimanguillo, Ciudad del Carmen, Coatzacoalcos y Palenque.
- **Lo que los distingue** (textos del sitio actual en Shopify): autos verificados, precios justos y
  atención personalizada.
- **Página actual:** https://www.h3seminuevos.com (Shopify, $19 USD al mes).

## 2. Qué debe lograr la página

1. Mostrar el catálogo de autos con una interfaz muy amigable y profesional, sobre todo en celular:
   fotos, características y precio.
2. Que el interesado **mande WhatsApp con el auto que le gustó ya escrito en el mensaje**.
3. Que quien quiera **vender su auto** mande sus datos por WhatsApp.
4. Que el dueño **suba y edite autos desde un panel**, sin depender de un programador.
5. **Dejar de pagar Shopify** y que salga más barato.
6. Verse moderna, juvenil y deportiva, con muchas microanimaciones.

No se busca vender en línea: no hay carrito ni pagos.

## 3. Secciones de la página (en orden)

**Inicio (`/`)**
1. **Encabezado fijo:** logo, Catálogo, Vende tu auto, Contacto y botón de WhatsApp. En celular lleva un
   menú de pantalla completa.
2. **Hero:**
   - Fotos de los autos destacados que van rotando, con una etiqueta del auto y su precio.
   - Título «Tu próximo auto está aquí.».
   - Botones «Ver catálogo» y «Vender mi auto».
   - Tres datos: cuántos autos hay disponibles, la ubicación y «Atención 1 a 1».
3. **Franja animada** con las marcas del inventario.
4. **«Lo disponible 🔥»:** autos destacados. En celular se deslizan de lado.
5. **«Explora por tipo»:** SUV, Deportivos, Blindados, Pickup, etc., con el número de autos de cada uno.
   Debajo van botones por rango de precio.
6. **«¿Por qué H3?»:** autos verificados, precios justos y atención personalizada.
7. **Banner «¿Vendes tu auto?»**, que lleva a la página de venta.
8. **«Recién vendidos»:** solo aparece si hay autos marcados como vendidos.
9. **Contacto («Estamos en Villahermosa»):**
   - Dirección, horario y botones de Google Maps y Waze.
   - WhatsApp, llamada y redes.
10. **Pie de página** y **botón flotante de WhatsApp**.

**Catálogo (`/autos`)**
- Buscador, filtros (tipo, marca, precio, año y transmisión) y orden.
- Los filtros quedan en el enlace, por ejemplo `/autos?tipo=SUV`.
- En celular, los filtros se abren en una hoja desde abajo.
- Si no hay resultados, se ofrece «Búscame uno» por WhatsApp.

**Detalle de cada auto (`/autos/<nombre-del-auto>`)**
- Galería deslizable con pantalla completa.
- Precio, ficha técnica y «Lo que destaca».
- Descripción del dueño y autos similares.
- Botones: «Me interesa este auto» (WhatsApp con el auto, precio y enlace), «Agendar visita», llamar y
  compartir.
- En celular aparece una barra fija de WhatsApp al bajar.

**Vende tu auto (`/vende-tu-auto`)**
- Formulario de 3 pasos: datos del auto, detalles y contacto.
- Arma el mensaje de WhatsApp. No guarda datos en ningún servidor; el borrador se queda solo en el
  teléfono del visitante.

**Panel (`/admin`, con contraseña)**
- Inventario con búsqueda y pestañas: Disponibles, Apartados y Vendidos.
- Cambiar el estado o marcar como destacado con un toque.
- Alta y edición de autos. Las fotos se comprimen en el teléfono antes de subir; se pueden ordenar y
  elegir la portada.
- **Importar de Shopify:** copia los autos y sus fotos.

**Estados de un auto**
- **Disponible:** se ve en el catálogo.
- **Apartado:** se ve con una etiqueta amarilla.
- **Vendido:** sale del catálogo y aparece en «Recién vendidos».

## 4. Textos, logo, colores, tipografías y fotos

| Qué | Estado | Dónde |
| --- | --- | --- |
| Logo completo (blanco, con «READY TO DRIVE») | Existe; se tomó del Shopify | `public/brand/logo.png` |
| Marca «H3» sola | Recortada del logo | `public/brand/mark.png` |
| Íconos (pestaña, celular) | Generados con el logo | `app/icon.png`, `app/apple-icon.png`, `public/brand/icon-*.png` |
| Imagen para compartir en redes | Generada con foto de la G63 | `app/opengraph-image.jpg` |
| Colores | Negro, rojo y amarillo del tema de Shopify | `app/globals.css` (`@theme`) |
| Tipografía de títulos y etiquetas | Saira expandida (itálica 800 y normal 600), en archivos propios | `app/fonts/` |
| Tipografía de texto | Geist | `app/layout.tsx` |
| Datos del negocio | Teléfono, dirección, horario y redes | `lib/site.ts` |
| Inventario inicial | 13 autos copiados de Shopify, con datos revisados a mano | `data/seed.json` |
| Fotos de los autos | 189 fotos en el CDN de Shopify | Enlaces dentro de `data/seed.json` |

Colores en uso:

| Uso | Color |
| --- | --- |
| Fondo | `#0a0a0b` |
| Rojo de marca | `#e3141f` |
| Rojo para texto pequeño | `#ff3a44` |
| Amarillo («Apartado») | `#fad116` |
| Verde de WhatsApp | `#25d366` |

Notas:
- **Las fotos desaparecerán al cancelar Shopify.** Hay que importarlas al nuevo almacenamiento
  (Panel → Importar de Shopify) **antes** de cancelar.
- Casi todas las fotos se tomaron con celular y son verticales; el diseño está hecho para eso.
- Los textos de las descripciones son los que el dueño escribió en Shopify.

## 5. Con qué se hace, dónde se publica y con qué dominio

**Código**
- Next.js 16.4 (App Router con Cache Components), React 19.3, TypeScript y Tailwind CSS 4.
- **Inventario:** Upstash Redis, gratis. Sin Redis, el sitio corre en «modo demo» con `data/seed.json`.
- **Fotos:** Vercel Blob. Ese almacenamiento solo sirve si el sitio queda en Vercel.
- Las páginas públicas son estáticas. Se regeneran solas cuando el dueño guarda algo en el panel,
  sin necesidad de volver a desplegar.

**Hosting: sin decidir.** Opciones evaluadas:

| Opción | Costo | Comentario |
| --- | --- | --- |
| Vercel Hobby | $0 | **No apta:** sus reglas solo permiten uso personal, no comercial ([fuente](https://vercel.com/docs/limits/fair-use-guidelines)) |
| Vercel Pro | $20 USD/mes | Funciona tal cual, pero cuesta más que Shopify |
| Netlify Free | $0 | Ver verificación abajo |
| Netlify Personal | $9 USD/mes | 1,000 créditos al mes |

**Verificación de Netlify** (27-oct-2026, documentación oficial):
- Permite proyectos comerciales en el plan gratuito
  ([blog oficial](https://www.netlify.com/blog/introducing-netlify-free-plan)).
- Soporta Next.js con App Router, ISR, Server Actions, Middleware y **Cache Components**
  ([docs](https://docs.netlify.com/frameworks/next-js/overview/)). **No se ha hecho un despliegue de prueba.**
- El plan gratuito da **300 créditos al mes con límite duro**: si se acaban, **todos los sitios de la
  cuenta se pausan** hasta el mes siguiente y se muestra «Site not available»
  ([docs](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)).
- Costo en créditos ([precios](https://www.netlify.com/pricing/)):

  | Uso | Créditos |
  | --- | --- |
  | Despliegue a producción | 15 |
  | Vistas previas | 0 |
  | 1 GB de tráfico | 20 |
  | 10,000 peticiones | 2 |
  | 1 GB-hora de cómputo | 10 |

- **Qué significa para H3:**
  - Editar autos desde el panel **no** gasta despliegues.
  - Cada cambio de código publicado sí gasta 15 créditos.
  - Sin despliegues, 300 créditos alcanzan para unos 15 GB de tráfico.
  - El tráfico mensual real de H3 es **desconocido**. Un pico (por ejemplo, un video viral) podría
    agotar los créditos y pausar el sitio.
- Netlify no publica cuánto cuesta guardar fotos en Netlify Blobs. Qué se usaría para las fotos en
  Netlify: **sin decidir**.

**Dominio:** h3seminuevos.com (ya existe). Dónde está registrado y cuándo se conecta: **sin decidir**.
El usuario indicó que el dominio va aparte y se verá después.

**Repositorio:** `Diluvium-mx/h3-web`. Es público y temporal, para dar seguimiento; se borrará después.

## 6. Lo que ya está hecho

- Sitio completo: inicio, catálogo, detalle de auto, vende tu auto, 404, panel e importador de Shopify.
- Los 13 autos reales del Shopify con datos estructurados (marca, modelo, año, precio, km, etc.).
- Mensajes de WhatsApp prellenados, con el auto, el precio y el enlace.
- **SEO local:**
  - Títulos y descripciones por auto.
  - Datos estructurados: AutoDealer con horario y Car con oferta.
  - `sitemap.xml`, `robots.txt` e imagen para redes.
- **Seguridad del panel:**
  - Contraseña desde variable de entorno.
  - Sesión firmada.
  - Límite de 8 intentos de login cada 15 minutos (cuando hay Redis).
  - Cada acción verifica la sesión en el servidor.
- **Velocidad**, medida con Lighthouse en celular:

  | Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
  | --- | --- | --- | --- | --- |
  | Inicio | 91 | 100 | 100 | 100 |
  | Catálogo | 91 | 96 | 100 | 100 |
  | Detalle | 95 | 100 | 100 | 100 |

  Después se corrigió el contraste que marcaba el catálogo, pero no se volvió a medir.
- **Pruebas:** 24 pruebas automáticas pasan; los scripts están en `scripts/`.
- 27-oct: se quitó la sección de personalización y se agregó el horario.

## 7. Lo que falta (en orden)

1. **Decidir hosting:** Vercel Pro o Netlify (Free o Personal). **Sin decidir.**
2. Si se elige Netlify:
   - Cambiar el almacenamiento de fotos (hoy Vercel Blob) por otro. Cuál: **sin decidir**.
   - Hacer un despliegue de prueba.
3. **Mejorar el catálogo:** es la prioridad que pidió el usuario. Qué mejoras concretas: **sin decidir**.
4. Crear los servicios (Redis y almacenamiento de fotos), poner las variables de entorno y publicar.
5. Importar el inventario desde Shopify **antes** de cancelarlo.
6. Revisar los datos dudosos del inventario (ver preguntas abiertas).
7. Conectar el dominio: **sin decidir** cuándo.
8. Cancelar Shopify.

## 8. Decisiones tomadas y cosas descartadas

**Tomadas**
- Página informativa con catálogo; **sin carrito ni pagos**. El contacto es por WhatsApp con el
  mensaje prellenado.
- Panel propio para que el dueño suba y edite autos desde el celular.
- Diseño oscuro, deportivo y juvenil, con microanimaciones. Primero para celular. Se conservan el
  logo y los colores actuales.
- «Vende tu auto» funciona con un formulario que manda los datos por WhatsApp.
- La sección de personalización (H3 Custom) **no se incluye por ahora**, aunque sí ofrecen el servicio.
- Horario: lunes a sábado de 9:00 a 17:00; domingo cerrado.
- Prioridad actual: **mejorar primero el catálogo de carros**.
- El dominio se verá después.
- Seguimiento en un repo público temporal, con `CONTEXTO.md` y `AVANCE.md`.

**Descartadas**
- Seguir en Shopify: cuesta $19 USD al mes y su carrito no sirve para vender autos.
- Vercel Hobby (gratis): sus reglas no permiten uso comercial.
- Sección «H3 Custom» en la página (por ahora).

## 9. Preguntas abiertas

1. ¿Hosting en Vercel Pro ($20/mes), Netlify Free ($0, con riesgo de pausa) o Netlify Personal ($9/mes)?
2. Si es Netlify, ¿dónde se guardan las fotos?
3. ¿Cuántas visitas al mes recibe hoy la página? Sirve para calcular si alcanzan los créditos gratis.
4. ¿Qué mejoras quieres primero en el catálogo?
5. «Vende tu auto»: ¿compran el auto directo, a consignación o ambos? Hoy el texto es neutral.
6. ¿Ofrecen financiamiento o reciben autos a cuenta? Hoy no se menciona.
7. ¿Qué ciudades cercanas se deben mencionar?
8. Datos del inventario:
   - La Ford Expedition dice 82,135 km y también 74,649 km. ¿Cuál es?
   - ¿Cuántos km tienen el Mustang GT y la Mazda CX-5?
   - ¿El BMW M240i es automático o estándar?
9. Dominio: ¿dónde está registrado y cuándo se conecta?
10. ¿Quién va a administrar el panel? La contraseña **no** se sube a este repositorio.
