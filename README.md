# H3 Seminuevos — sitio web + panel de administración

Sitio para **H3 Seminuevos** (Villahermosa, Tabasco) que reemplaza la tienda de Shopify.
Muestra el catálogo de autos, manda a los interesados a WhatsApp con el auto ya escrito en el
mensaje, recibe solicitudes de "Vende tu auto" y tiene un panel donde el dueño sube y edita
autos desde el celular.

## Qué incluye

**Sitio público** (pensado primero para celular)
- **Inicio**: landing hecha con el método de los 2 videos analizados (ver `ANALISIS-VIDEOS.md`):
  - Hero con prueba social real, título de beneficio, subtítulo de dolor a solución, un botón principal,
    quita-miedos y fotos del inventario.
  - Números reales del inventario y franja de marcas.
  - Autos destacados con tipos como «historias».
  - Reseñas, solo si el dueño las agrega.
  - «Lo de siempre» contra «en H3».
  - 3 beneficios con imagen y «Tu próximo auto en 3 pasos».
  - «Recién vendidos», «Vende tu auto», preguntas frecuentes y cierre con contacto y horario.
- **Catálogo** (`/autos`): búsqueda, filtros (tipo, marca, precio, año, transmisión) y orden. Los
  filtros viven en el URL (`/autos?tipo=SUV`), así que se pueden compartir.
- **Detalle de cada auto** (`/autos/bmw-m3-2018`):
  - En la primera pantalla del celular: foto, precio, resumen, botón de WhatsApp según el estado y
    quita-miedos.
  - Todas las fotos en cuadrícula y pantalla completa, con pestañas por sección (exterior, interior,
    motor y detalles).
  - Equipamiento agrupado con íconos (confort, tecnología, seguridad y exterior).
  - Video opcional (YouTube dentro de la página; TikTok, Instagram y Facebook como enlace).
  - Ficha técnica, «pregúntanos» para datos faltantes, descripción y «Así de fácil» en 3 pasos.
  - «Tus dudas, resueltas»: dueños, factura, servicios, papeles, blindaje y más. Lo que falta se pregunta
    por WhatsApp con un toque.
  - Reseñas, si hay, y autos similares.
  - «Mándaselo por WhatsApp» a otra persona y barra fija en celular.
  - Si el enlace es de un auto que ya no existe, ofrece autos de la misma marca.
- **Vende tu auto** (`/vende-tu-auto`): formulario de 3 pasos que arma el mensaje de WhatsApp con los
  datos del auto. Guarda el borrador en el teléfono.
- Microanimaciones: aparición al hacer scroll, destellos en botones, transición de la foto de la
  tarjeta al detalle, líneas de velocidad, etc. Se respetan las preferencias de "reducir movimiento".
- SEO local: títulos y descripciones por auto, datos estructurados (AutoDealer y Car), `sitemap.xml`,
  `robots.txt`, imagen para compartir en redes y metadatos en español de México.

**Panel** (`/admin`, protegido con contraseña)
- Lista del inventario con búsqueda y pestañas (Disponibles / Apartados / Vendidos).
- Cambiar estado y marcar como destacado con un toque.
- Alta y edición de autos: fotos (se comprimen solas en el teléfono antes de subir, ~300 KB c/u),
  reordenar y elegir portada, sección de cada foto, datos, equipamiento (lista fija), características,
  etiquetas, descripción y video opcional.
- **Importar de Shopify**: copia los autos y sus fotos del Shopify actual al sitio nuevo con un clic.
- **Reseñas** (`/admin/resenas`): agrega lo que dicen tus clientes (nombre, estrellas, texto, auto, origen y
  foto opcional). Aparecen en el inicio; si no hay ninguna, la sección no se muestra. Publica solo reseñas
  reales y con permiso.
- Al guardar, el sitio público se actualiza al instante.

Estados de un auto:
- **Disponible**: visible en el catálogo.
- **Apartado**: visible con etiqueta amarilla "Apartado".
- **Vendido**: sale del catálogo y aparece en "Recién vendidos" en el inicio (prueba social). Su página
  sigue existiendo y el botón cambia a "Búscame uno similar".

## Tecnología

- Next.js 16 (App Router, Cache Components) + React 19 + Tailwind CSS 4.
- **Netlify Free** para publicar el sitio.
- **Upstash Redis Free** para guardar el inventario.
- **Cloudinary Free** para guardar y servir las fotos. Las fotos salen directo de Cloudinary ya
  optimizadas (AVIF/WebP), así no gastan créditos de Netlify.

Las páginas públicas se generan estáticas y se sirven desde el CDN. Solo se regeneran cuando guardas
algo en el panel, sin volver a publicar el sitio.

## Publicar en Netlify (gratis, paso a paso)

No se sube ninguna contraseña ni llave al repositorio. Todo va en las variables de entorno de Netlify.

1. **Upstash** ([upstash.com](https://upstash.com)): crea una cuenta y luego una base de datos Redis en el
   plan Free. En la pestaña **REST API** copia `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`.
2. **Cloudinary** ([cloudinary.com](https://cloudinary.com)): crea una cuenta gratis. En el **Dashboard**
   copia la «API environment variable», que tiene esta forma: `CLOUDINARY_URL=cloudinary://…`.
3. **Netlify** ([netlify.com](https://www.netlify.com)): ve a **Add new project → Import an existing
   project → GitHub** y elige este repositorio. La configuración de compilación ya viene en
   `netlify.toml`.
4. En **Site configuration → Environment variables** agrega:
   - `ADMIN_PASSWORD`: la contraseña del panel (larga, por ejemplo 4 palabras al azar).
   - `AUTH_SECRET`: texto largo y aleatorio (`openssl rand -base64 32`).
   - `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`.
   - `CLOUDINARY_URL`.
   - `NEXT_PUBLIC_SITE_URL`: déjala vacía mientras no se conecte el dominio, porque el sitio usa sola la
     dirección `*.netlify.app`. Cuando se conecte, pon `https://www.h3seminuevos.com`.
5. **Deploy**. Después entra a `https://TU-SITIO.netlify.app/admin`, ve a **Importar de Shopify → Buscar
   → Importar seleccionados**. Las fotos se copian de Shopify a Cloudinary.
6. **Para no gastar créditos de más:**
   - Editar autos en el panel no requiere publicar de nuevo.
   - Prueba los cambios de código en vistas previas (Deploy Previews), que cuestan 0 créditos.
   - Publica a producción como máximo unas 4 veces al mes; cada vez cuesta 15 créditos.
   - Deja solo este sitio en la cuenta de Netlify.
7. Cuando todo funcione, **cancela Shopify**. Importa las fotos **antes**, porque después desaparecen.
   El dominio se conecta después (sin decidir).

## Costos

Meta: **$0 al mes** (decisión del dueño). Los cálculos completos están en `CONTEXTO.md`, sección 5.

| Concepto | Plan | Si se pasa del límite |
| --- | --- | --- |
| Netlify | Free: 300 créditos al mes | El sitio se pausa hasta el mes siguiente; no cobra |
| Cloudinary | Free: 25 créditos al mes, sin tarjeta | Avisa por correo y, si sigue, desactiva la cuenta |
| Upstash Redis | Free: 500 mil comandos y 250 MB | Avisa por correo |
| Dominio `.com` | El que ya tienen | Renovación anual, aparte |

## Editar datos del negocio

Todo está en [`lib/site.ts`](lib/site.ts): WhatsApp, teléfono, dirección, horario (`hours` y
`openingHours`) y redes sociales.

## Desarrollo local

```bash
npm install
npm run dev
```

- Sin variables de entorno, el sitio usa `data/seed.json` (el inventario actual).
- En local, el panel (`/admin`, contraseña `h3admin`) guarda en `data/cars.local.json` y
  `data/reviews.local.json`, y las fotos en `public/uploads/` (todo ignorado por git).
- Para usar los servicios reales en local, copia `.env.example` como `.env.local` y llénalo
  (no lo subas al repositorio).
- **Probar en tu celular:** `npm run movil` muestra un enlace y un código QR (celular en el mismo Wi-Fi).
  Con `npm run movil -- --tunel` da un enlace https temporal (requiere `cloudflared`). Guía completa y
  lista de revisión en [`PRUEBAS-EN-CELULAR.md`](PRUEBAS-EN-CELULAR.md).

## Estructura

```
app/(site)/          páginas públicas (inicio, catálogo, detalle, vende tu auto)
app/admin/           panel de administración
app/api/upload/      firma para subir fotos directo a Cloudinary
components/          interfaz (tarjetas, galería, filtros, formularios…)
lib/site.ts          datos del negocio
lib/cars.ts          tipos, formatos y mensajes de WhatsApp
lib/equipment.ts     lista fija de equipamiento y secciones de fotos
lib/data.ts          lecturas cacheadas para el sitio público
lib/storage.ts       inventario en Redis (o archivo local en demo)
lib/cloudinary.ts    subida, firma y borrado de fotos en Cloudinary
lib/image-loader.ts  pide a Cloudinary cada foto del tamaño justo
netlify.toml         configuración de Netlify
lib/actions.ts       acciones del panel (guardar, borrar, importar…)
proxy.ts             protege /admin
```
