# H3 Seminuevos — sitio web + panel de administración

Sitio para **H3 Seminuevos** (Villahermosa, Tabasco) que reemplaza la tienda de Shopify.
Muestra el catálogo de autos, manda a los interesados a WhatsApp con el auto ya escrito en el
mensaje, recibe solicitudes de "Vende tu auto" y tiene un panel donde el dueño sube y edita
autos desde el celular.

## Qué incluye

**Sitio público** (pensado primero para celular)
- **Inicio**: hero con fotos del inventario que van rotando, franja animada de marcas, autos destacados,
  exploración por tipo (SUV, Pickup, Deportivos, Blindados…) y por rango de precio, "¿Por qué H3?",
  "Vende tu auto", "Recién vendidos" y ubicación/contacto con horario.
- **Catálogo** (`/autos`): búsqueda, filtros (tipo, marca, precio, año, transmisión) y orden. Los
  filtros viven en el URL (`/autos?tipo=SUV`), así que se pueden compartir.
- **Detalle de cada auto** (`/autos/bmw-m3-2018`): galería que se desliza con el dedo, pantalla completa,
  ficha técnica, etiquetas, descripción, autos similares y botones de WhatsApp ("Me interesa",
  "Agendar visita"), llamada y compartir. En celular aparece una barra fija de WhatsApp al hacer scroll.
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
  reordenar y elegir portada, datos, características, etiquetas, descripción.
- **Importar de Shopify**: copia los autos y sus fotos del Shopify actual al sitio nuevo con un clic.
- Al guardar, el sitio público se actualiza al instante.

Estados de un auto:
- **Disponible**: visible en el catálogo.
- **Apartado**: visible con etiqueta amarilla "Apartado".
- **Vendido**: sale del catálogo y aparece en "Recién vendidos" en el inicio (prueba social). Su página
  sigue existiendo y el botón cambia a "Búscame uno similar".

## Tecnología

- Next.js 16 (App Router, Cache Components) + React 19 + Tailwind CSS 4.
- **Upstash Redis** (integración gratuita del Marketplace de Vercel) para guardar el inventario.
- **Vercel Blob** para las fotos.
- Sin base de datos ni servicios de pago adicionales.

Las páginas públicas se generan estáticas y se sirven desde el CDN; solo se regeneran cuando cambias
algo en el panel. Eso las hace muy rápidas y casi no consumen recursos del plan.

## Publicar en Vercel (referencia)

> **Decisión del dueño (27-oct-2026): hosting solo gratis; primera opción Netlify Free.** Ver números y
> plan en `CONTEXTO.md`. El código todavía guarda las fotos en Vercel Blob; falta cambiarlo (propuesta:
> Cloudinary Free) y adaptar el despliegue a Netlify. Los pasos de abajo son para Vercel y quedan solo
> como referencia.

1. **Sube el código a GitHub** (un repositorio privado está bien).
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el repositorio → **Deploy**.
   El primer despliegue funciona en "modo demo" con el inventario actual de ejemplo.
3. **Base de datos**: en el proyecto → pestaña **Storage** → **Create Database** →
   **Upstash for Redis** (plan Free) → conéctala al proyecto (deja el prefijo de variables por defecto,
   `KV`).
4. **Fotos**: en **Storage** → **Create** → **Blob** (acceso público) → conéctalo al proyecto.
5. **Variables de entorno**: en **Settings → Environment Variables** agrega:
   - `ADMIN_PASSWORD`: la contraseña del panel (larga, por ejemplo 4 palabras al azar).
   - `AUTH_SECRET`: texto largo y aleatorio (`openssl rand -base64 32`).
   - `NEXT_PUBLIC_SITE_URL`: `https://www.h3seminuevos.com`
6. **Redeploy** (Deployments → ⋯ → Redeploy) para que tome las variables.
7. Entra a `https://TU-PROYECTO.vercel.app/admin` → **Importar de Shopify** → **Buscar** →
   **Importar seleccionados**. Revisa los autos importados y ajusta lo que haga falta.
8. **Dominio**: en **Settings → Domains** agrega `h3seminuevos.com` y `www.h3seminuevos.com` y cambia
   los DNS donde esté registrado el dominio según lo que indique Vercel.
   - Si el dominio se compró **dentro de Shopify**, primero transfiérelo a otro registrador
     (o apunta sus DNS a Vercel) **antes** de cancelar Shopify.
9. Cuando todo funcione con el dominio, **cancela Shopify**. Importa los autos *antes* de cancelar:
   después las fotos de Shopify dejan de existir.

## Costos

Meta: **$0 al mes en hosting**. Comparación con números (Netlify Free vs Railway Free) en `CONTEXTO.md`,
sección 5.

| Concepto | Costo |
| --- | --- |
| Upstash Redis (Free) | $0 (sobra para cientos de autos) |
| Netlify Free | $0 con 300 créditos al mes; si se acaban, el sitio se pausa hasta el mes siguiente |
| Fotos (propuesta: Cloudinary Free) | $0 con 25 créditos al mes |
| Dominio `.com` | El que ya tienen (se verá después) |

## Editar datos del negocio

Todo está en [`lib/site.ts`](lib/site.ts): WhatsApp, teléfono, dirección, horario (`hours` y
`openingHours`), redes sociales y ciudades que atienden.

## Desarrollo local

```bash
npm install
npm run dev
```

- Sin variables de entorno, el sitio usa `data/seed.json` (el inventario actual).
- En local, el panel (`/admin`, contraseña `h3admin`) guarda en `data/cars.local.json` y las fotos en
  `public/uploads/` (ambos ignorados por git).
- Para usar los servicios reales en local: `vercel env pull .env.local`.

## Estructura

```
app/(site)/          páginas públicas (inicio, catálogo, detalle, vende tu auto)
app/admin/           panel de administración
app/api/upload/      tokens para subir fotos directo a Vercel Blob
components/          interfaz (tarjetas, galería, filtros, formularios…)
lib/site.ts          datos del negocio
lib/cars.ts          tipos, formatos y mensajes de WhatsApp
lib/data.ts          lecturas cacheadas para el sitio público
lib/storage.ts       inventario en Redis (o archivo local en demo)
lib/actions.ts       acciones del panel (guardar, borrar, importar…)
proxy.ts             protege /admin
```
