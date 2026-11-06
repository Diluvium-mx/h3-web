# Entrega: publicar el sitio de H3 Seminuevos en la web oficial

Para la cuenta de Claude Code que va a publicar el sitio. Escrito el **31 de octubre de 2026**, el día en que
el dueño dio por terminada la versión («Listo, ya quedó finalmente») y pidió que otra cuenta lo suba a la
web oficial.

> **Actualización 5-nov-2026:** el sitio pasa a una cuenta de Netlify **del dueño**:
> `luminous-rolypoly-293a41.netlify.app` (vista previa: `deploy-preview-1--luminous-rolypoly-293a41.netlify.app`).
> El proyecto `h3-seminuevos` de abajo es la cuenta anterior y se va a borrar. El dominio está en **GoDaddy**.

**Lee este documento completo antes de tocar nada.** Después lee `CLAUDE.md`, `AGENTS.md`, `CONTEXTO.md`
y `AVANCE.md`, en ese orden. Si algo de `README.md` o `CONTEXTO.md` contradice este documento, **manda este
documento** (algunas partes de esos archivos son de antes del 31-oct).

---

## 1. Resumen en 30 segundos

- **Qué es:** el sitio nuevo de **H3 Seminuevos** (autos seminuevos en Villahermosa, Tabasco). Tiene catálogo
  de autos, ficha de cada auto con WhatsApp, «Vende tu auto» y un panel para que el dueño suba autos.
  Reemplaza la tienda de **Shopify** que hoy está en el dominio oficial.
- **La versión final está en la rama `desarrollo`** y se ve en la vista previa
  https://deploy-preview-1--h3-seminuevos.netlify.app.
- **Publicar = fusionar la solicitud de cambios [Diluvium-mx/h3-web#1](https://github.com/Diluvium-mx/h3-web/pull/1)**
  (`desarrollo` → `main`). Netlify publica `main` solo, en 3 a 5 minutos.
- **La web oficial `h3seminuevos.com` hoy sigue apuntando a Shopify.** Para que el sitio nuevo salga ahí hay
  que conectar el dominio en Netlify y cambiar los registros DNS (sección 7, paso 8).
- **Todo es gratis** (decisión del dueño): Netlify Free + Netlify Blobs + Cloudinary Free. Nada de planes de pago.

---

## 2. Dónde está todo (datos exactos)

| Qué | Dato |
| --- | --- |
| Repositorio | **https://github.com/Diluvium-mx/h3-web** (GitHub; organización `Diluvium-mx`, repositorio `h3-web`). Es **público**. Rama por defecto: `main`. Según `CONTEXTO.md` es temporal y se borrará después. |
| Rama con la versión final | **`desarrollo`**. Aquí se trabaja y se sube todo. |
| Rama de producción | **`main`**. Netlify la publica en cada cambio. Hoy tiene una versión vieja (commit `402700f`, del 30-oct, con el título «Seminuevos premium en Villahermosa»). `desarrollo` va más de 20 cambios adelante. |
| Rama congelada | `version-scrollcraft` (versión 1 del diseño). El dueño la descartó el 31-oct. No se le sube nada. |
| Solicitud de cambios para publicar | **[Diluvium-mx/h3-web#1](https://github.com/Diluvium-mx/h3-web/pull/1)**: `desarrollo` → `main`, abierta. Su título dice «no fusionar hasta que el dueño diga «publica»». |
| Solicitud que **no** se fusiona | [Diluvium-mx/h3-web#2](https://github.com/Diluvium-mx/h3-web/pull/2): `version-scrollcraft` → `main`, abierta. Se cierra **sin fusionar** (paso 10). |
| Servidor (hosting / deploy) | **Netlify**, plan **Free**. Proyecto (sitio) **`h3-seminuevos`**, visibilidad pública. Publica la rama `main` automáticamente. |
| Dirección de producción hoy | **https://h3-seminuevos.netlify.app** |
| Vista previa de la versión final | **https://deploy-preview-1--h3-seminuevos.netlify.app** (sale de #1; no gasta créditos) |
| Vista previa congelada | https://deploy-preview-2--h3-seminuevos.netlify.app (sale de #2) |
| Configuración de Netlify | `netlify.toml`: comando `npm run build`, carpeta `.next`, Node 22, telemetría de Next.js apagada. Netlify detecta Next.js y usa su adaptador oficial (OpenNext). No hay que configurar nada más de compilación. |
| Cuenta de Netlify | La creó quien lleva el proyecto. **El correo de esa cuenta no está en el repositorio: pregúntalo al dueño.** Para fusionar #1 no hace falta entrar a Netlify; para las variables de entorno y el dominio, sí. |
| Créditos de Netlify | 300 al mes. **Cada publicación de `main` cuesta 15.** Las vistas previas cuestan 0. 1 GB de tráfico = 20; 10,000 peticiones = 2. Si se acaban, Netlify pausa el sitio hasta el mes siguiente (no cobra). |
| Datos del panel (inventario, reseñas, contraseña) | **Netlify Blobs**, almacén **`h3`** (`lib/storage.ts`). Incluido en Netlify Free, sin cuenta extra. **Es el mismo almacén para producción y para las vistas previas**: lo que el dueño ya editó en la vista previa sale igual en producción. |
| Fotos de los autos | Hoy: **CDN de Shopify** (189 fotos; los enlaces están en `data/seed.json` y en Netlify Blobs). Destino: **Cloudinary Free**. **La cuenta de Cloudinary todavía no existe.** |
| Dominio oficial | **`h3seminuevos.com`** y **`www.h3seminuevos.com`**. Revisado el 31-oct: **apuntan a Shopify** (`h3seminuevos.com` → `23.227.38.32`; `www` → `shops.myshopify.com`; la página responde `powered-by: Shopify`). **Dónde está registrado el dominio y quién maneja su DNS: sin decidir (preguntar al dueño).** |
| Tecnología | Next.js **16.4.3** (App Router, Cache Components), React **19.3.0**, TypeScript, Tailwind CSS 4, `@netlify/blobs` 11. **Ojo:** esta versión de Next.js cambia cosas; lee `AGENTS.md` y las guías en `node_modules/next/dist/docs/` antes de cambiar código. |
| Seguimiento para el dueño | Página «Página web H3» en el Notion del dueño (base «Carlos»). Si tienes acceso a Notion, actualízala en 2–3 líneas sencillas al publicar. |

---

## 3. Reglas que no se rompen (resumen de `CLAUDE.md`)

1. **El repositorio es público.** Nunca subas llaves, contraseñas, tokens, `.env` ni datos de clientes. Las
   llaves van **solo** en las variables de entorno de Netlify.
2. **No inventes datos del negocio.** Si algo no está decidido, escribe «sin decidir» y pregúntalo.
3. **Todo el texto visible va en español de México.**
4. **Trabaja y sube en la rama `desarrollo`.** Solo se pasa a `main` cuando el dueño dice **«publica»**.
   Cada cambio que llega a `main` gasta 15 créditos, **aunque sea solo documentación**.
5. Cada avance: entrada nueva **arriba** en `AVANCE.md` (fecha, 2 a 4 líneas, «Falta: …»). Si cambia una
   decisión, actualiza `CONTEXTO.md`.
6. Antes de subir, corre las verificaciones de la sección 6.
7. Solo planes gratuitos. Las fotos siempre desde Cloudinary, nunca desde el hosting.

---

## 4. Qué tiene el sitio (versión final del 31-oct)

El detalle completo, sección por sección, está en `CONTEXTO.md` (sección 3). Resumen:

**Inicio (`/`)**, en este orden:
1. Encabezado fijo con el logo, Inventario, Vende tu auto, Contacto y WhatsApp.
2. **Hero:** «Autos seminuevos *seleccionados* en Villahermosa.» y los botones «Ver inventario» y WhatsApp.
   - En celular: carrusel de fotos reales que cambia solo; la foto se queda fija y la hoja clara sube por encima.
   - En computadora: **una sola imagen fija hecha con Arcads** (la G63 real del inventario en una sala de
     exhibición) y la tarjeta de la G63 con su precio. Si la G63 se vende, la tarjeta se oculta sola.
3. Franja de marcas con logos, recta, pegada debajo del hero.
4. Inventario: categorías con íconos y 8 autos en 2 columnas. Las tarjetas no llevan WhatsApp; abren la ficha.
5. «Lo que hacemos por ti»: «Al comprar un auto» y «Al vender tu auto», cada uno con su imagen e íconos verdes.
6. «Autos verificados, con sus papeles en regla.»: carrusel de tarjetas grandes.
7. Reseñas: solo aparecen si el dueño agrega reseñas reales en el panel (hoy no hay).
8. «Compra con certeza, no a ciegas.»: tabla «Lo de siempre» contra «En H3».
9. Preguntas frecuentes.
10. Cierre: «Cada auto es *único*. Cuando se vende, *ya no vuelve*.», con carrusel, y **«Visítanos»** con
    la dirección, horario, «Los autos se ven con cita», botones y **mapa de Google** con el punto exacto.
11. Pie de página con el logo, enlaces, WhatsApp, teléfono, cómo llegar, redes, dirección, horario y el
    enlace discreto «Administración» (entrada al panel).

**Inventario (`/autos`):** buscador, categorías, filtros (marca, precio, año y transmisión) y orden. Los
filtros quedan en la dirección (`/autos?tipo=SUV`) para poder compartirlos.

**Ficha de cada auto (`/autos/<nombre>`, p. ej. `/autos/bmw-m3-2018`):** galería deslizable con pantalla
completa, precio, resumen, WhatsApp con el auto ya escrito en el mensaje, fotos por sección (Exterior e
Interior), equipamiento, video opcional, ficha técnica (solo filas con dato), «También te puede gustar» y
una barra fija de WhatsApp en celular. Si el enlace es de un auto que ya no existe, ofrece autos parecidos.

**Vende tu auto (`/vende-tu-auto`):** formulario de 3 partes que arma el mensaje de WhatsApp y «Cómo
funciona» en 6 pasos (cuéntanos, fotos por WhatsApp, evaluación en sitio, fotos para publicar, valoración
final, nos encargamos de la venta). **No dice que H3 compra autos** (decisión del dueño).

**Panel (`/admin`):** contraseña del panel (ver paso 6). Inventario con pestañas, alta y edición de autos
con vista previa de la tarjeta, «Dónde va a aparecer», barra «Falta: …» y confirmación con «Ver en la
página», «Compartir por WhatsApp» y «Publicar otro». También tiene reseñas (`/admin/resenas`), ajustes
(contraseña) e importador de Shopify. Al guardar, el sitio se actualiza solo, **sin volver a publicar**.

**SEO:** títulos y descripciones por auto, datos estructurados (AutoDealer y Car), `sitemap.xml`,
`robots.txt` e imagen para compartir. En las vistas previas Google no indexa nada (`noindex`); en
producción sí.

**Datos del negocio** (todos en `lib/site.ts`, son públicos):
- WhatsApp y teléfono: `529932467572` / (993) 246 7572.
- Dirección: C. Pedro C. Colorado 216, Col. Municipal, 86090 Villahermosa, Tabasco.
- Google Maps: https://maps.app.goo.gl/dqzfUgVbiPhQqCmJ9
- Horario: lunes a sábado de 9:00 a 17:00; domingo cerrado.
- Redes: instagram.com/h3seminuevos, facebook.com/H3Seminuevos y tiktok.com/@homeronatal.

---

## 5. Imágenes y recursos (todo lo que usa el sitio)

Todas estas imágenes **ya están en el repositorio**, en la rama `desarrollo`. No hay que subir nada aparte.

| Archivo | Qué es | De dónde salió | Dónde se usa |
| --- | --- | --- | --- |
| `public/img/hero-escritorio-1440.webp` (28 KB) y `public/img/hero-escritorio-2048.webp` (48 KB) | G63 gris mate en una sala de exhibición al atardecer, sin placa | **Arcads** (modelo Nano Banana 2.1), a partir de la foto real de la G63 del inventario | Hero del inicio, **solo en computadora** (el celular no la descarga) |
| `public/img/comprar-tu-auto.webp` (43 KB) | Entrega de la llave dentro de un auto, sin caras ni marcas | Arcads | «Al comprar un auto» |
| `public/img/vende-tu-auto.webp` (61 KB) | Llave, carpeta y pluma, sin autos | Arcads | «Al vender tu auto» y «Vende tu auto» en pantallas grandes |
| `public/brand/logo.png` | Logo completo blanco con «READY TO DRIVE» | Tomado del Shopify actual | Pie de página |
| `public/brand/logo-dark.png` | Logo completo en negro | Generado del logo original | Datos estructurados para Google (`components/site/json-ld.tsx`) |
| `public/brand/mark.png`, `public/brand/mark-dark.png` | Marca «H3» sola (blanca y negra) | Recortada del logo | Encabezado del sitio; la negra también en el panel |
| `public/brand/icon-192.png`, `icon-512.png`, `icon-maskable.png` | Íconos de la app | Generados con el logo | `app/manifest.ts` |
| `app/icon.png`, `app/apple-icon.png` | Ícono de la pestaña y de iPhone | Generados con el logo | Next.js los toma solos |
| `app/opengraph-image.jpg` | Imagen al compartir el enlace en redes | Hecha con la foto de la G63, todavía en el estilo oscuro anterior | Vista previa en WhatsApp y redes (cambiarla al estilo claro es opcional) |
| `app/fonts/saira-tech-600.woff2` | Letra que ya no se usa | Diseño anterior | Ninguno (se puede borrar) |

**Fotos de los autos:** 13 autos y 189 fotos, todas reales, en el CDN de Shopify. Los enlaces están en
`data/seed.json` y en Netlify Blobs. Se muestran con el cargador `lib/image-loader.ts`, que pide a cada CDN
el tamaño justo. **Desaparecerán cuando se cancele Shopify**: antes hay que pasarlas a Cloudinary (paso 7).

**Letras:** Instrument Sans e Instrument Serif, de Google Fonts por medio de `next/font` (se descargan al
compilar y se sirven desde el propio sitio).

**Íconos:** `lucide-react`, Phosphor Icons (`@phosphor-icons/react`, licencia MIT; la pickup se dibujó con el
mismo estilo) y logos de marcas de Simple Icons (licencia CC0) en `components/brand-logos.tsx`.

**Originales en Arcads:** en la biblioteca de Arcads, marca «Arcads Studio · 8a208acc», con estos nombres:
`h3_hero_g63_estudio_v2_ancho` (la del hero; id `691be7fa-e280-4651-96c9-de1d321a678a`),
`h3_comprar_auto_llaves_v1` y `h3_vende_tu_auto_llave_v1`. Solo hacen falta si se quieren rehacer en otro tamaño.

---

## 6. Verificaciones (correrlas antes de publicar y después)

En una copia del repositorio, en la rama `desarrollo`:

```bash
git clone https://github.com/Diluvium-mx/h3-web.git && cd h3-web
git checkout desarrollo
npm ci

npx next typegen   # tipos de rutas (PageProps, LayoutProps)
npx tsc --noEmit
npx eslint .
npx next build
```

Pruebas de punta a punta (necesitan Playwright con Chromium):

```bash
npm run dev                                         # en otra terminal
node scripts/e2e-public.mjs http://localhost:3000   # sitio: 32 pasos
node scripts/e2e-admin.mjs http://localhost:3000    # panel: crea, edita y borra autos de prueba
```

Contra la vista previa o contra producción:

```bash
node scripts/e2e-public.mjs https://deploy-preview-1--h3-seminuevos.netlify.app
node scripts/e2e-panel-netlify.mjs https://deploy-preview-1--h3-seminuevos.netlify.app
```

Resultado del 31-oct (última versión, commit `ad3d198`): **todo pasó**. Typegen, tsc, eslint y build sin
errores; sitio 32 de 32 en local y en la vista previa; panel completo en local; panel en Netlify (cambia un
precio, revisa la ficha y lo regresa) en la vista previa. El único «error de consola» que imprime
`e2e-public` es el 404 que la prueba provoca a propósito.

Cuidados:
- **`e2e-admin.mjs` es solo para `localhost`.** Crea y borra autos de prueba; no lo corras contra la vista
  previa ni contra producción.
- **`e2e-panel-netlify.mjs` sí toca los datos reales** (Netlify Blobs es el mismo para la vista previa y
  producción): cambia el precio de la BMW M240i de 395,000 a 396,000 y lo regresa. Córrelo pocas veces.
- Las pruebas del panel necesitan la nueva en la variable
  `ADMIN_PASSWORD` **solo en tu terminal** (`ADMIN_PASSWORD=… node scripts/…`). Nunca la escribas en un archivo.

---

## 7. Pasos para publicar (en orden)

### Paso 1. Confirmar con el dueño
El dueño aprobó la versión final el 31-oct y encargó la publicación a esta cuenta. Aun así, la regla del
proyecto es fusionar #1 **solo cuando el dueño diga «publica»**. Confírmalo y pregúntale también:
- el correo de la cuenta de Netlify, o que él mismo haga los pasos 3 y 8 en el panel de Netlify;
- dónde está registrado `h3seminuevos.com` y quién puede cambiar su DNS (necesario para el paso 8);
- si quiere crear Cloudinary ahora (paso 3) o después.

### Paso 2. Verificar
Corre todo lo de la sección 6 sobre la punta de `desarrollo` y contra la vista previa. Si algo falla, no
publiques: corrige en `desarrollo` y vuelve a probar.

### Paso 3. Variables de entorno en Netlify (antes de fusionar, para no gastar otra publicación)
En Netlify: **proyecto `h3-seminuevos` → Project configuration → Environment variables → Add a variable**.
Los valores reales nunca se escriben en el repositorio ni en el chat.

| Variable | ¿Hace falta? | Para qué |
| --- | --- | --- |
| `CLOUDINARY_URL` | **Sí, para subir fotos nuevas** desde el panel y pasar las de Shopify. Formato `cloudinary://API_KEY:API_SECRET@CLOUD_NAME` (Cloudinary → Dashboard → «API environment variable»). | Sin ella el sitio funciona, pero el panel no puede subir fotos. |
| `AUTH_SECRET` | Opcional. Texto largo al azar (`openssl rand -base64 32`). | Firma la sesión del panel. Sin ella, el panel crea una llave al azar y la guarda en Netlify Blobs. |
| `ADMIN_PASSWORD` | Opcional. | Reemplaza la contraseña del panel. Es más simple cambiarla en Panel → Ajustes (paso 6). Si se usa, que **no** sean palabras que aparezcan en el sitio (Netlify revisa que no se filtren y podría detener la publicación). |
| `NEXT_PUBLIC_SITE_URL` | Solo cuando el dominio ya esté conectado (paso 8): `https://www.h3seminuevos.com`. | Enlaces de WhatsApp, SEO, `sitemap.xml` e imagen para compartir. Se fija **al compilar**: después de agregarla hay que volver a publicar (15 créditos). Sin ella se usa la dirección principal de Netlify. |
| `NEXT_PUBLIC_WHATSAPP` | No. | Cambia el número de WhatsApp. El número correcto ya está en `lib/site.ts`. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (o `KV_REST_API_URL`, `KV_REST_API_TOKEN`) | **No las agregues.** | Si existen, el sitio deja Netlify Blobs y usa Redis, y **el inventario que ya está en Blobs no se pasa solo**. |

Netlify pone solas `NETLIFY`, `CONTEXT`, `URL`, `DEPLOY_PRIME_URL` y `NETLIFY_BLOBS_CONTEXT`: no las toques.
`H3_DEV_HOSTS`, `H3_IP` y `PORT` son solo para desarrollo local.

### Paso 4. Publicar: fusionar #1
Cuando el dueño diga «publica»:

```bash
gh pr merge 1 --repo Diluvium-mx/h3-web --merge
```

(o el botón «Merge pull request» en GitHub). Gasta **15 créditos**. Netlify compila y publica `main` solo,
en 3 a 5 minutos. No fusiones #2.

### Paso 5. Verificar producción
1. Abre https://h3-seminuevos.netlify.app: el título debe decir «Autos seminuevos **seleccionados** en
   Villahermosa.» (si dice «Seminuevos premium», sigue la versión vieja: espera o revisa **Deploys** en Netlify).
2. Corre `node scripts/e2e-public.mjs https://h3-seminuevos.netlify.app`.
3. Revisa que producción **sí** se pueda indexar: `curl -sI https://h3-seminuevos.netlify.app/ | grep -i robots`
   no debe mostrar `noindex`, y `https://h3-seminuevos.netlify.app/robots.txt` debe permitir el rastreo.
4. Entra a `/admin` con la contraseña y comprueba que se ve el inventario (sin «modo demo»).

### Paso 6. Cambiar la contraseña del panel
La contraseña del panel está escrita en este repositorio público: **cualquiera puede leerla**. En cuanto
el sitio esté publicado, el dueño la cambia en **Panel → Ajustes**. Se guarda cifrada en Netlify Blobs y vale
para producción y vistas previas; al cambiarla se cierran las demás sesiones. **La nueva no se escribe en
ningún archivo ni se sube al repositorio.**

### Paso 7. Pasar las fotos de Shopify a Cloudinary (antes de cancelar Shopify)
> **5-nov-2026:** ya existe el botón **«Pasar fotos a Cloudinary»** en el panel (`moveCarPhotosAction`). Aparece mientras queden fotos en Shopify.

**Problema conocido (revisado en el código el 31-oct):** el importador del panel (Panel → Importar de
Shopify) **no sirve para los 13 autos actuales**. Los reconoce por su `shopifyHandle` y los marca
«Ya importado» (`importShopifyAction` en `lib/actions.ts` y `components/admin/shopify-import.tsx`). Solo
importa autos nuevos de la tienda.

Lo que falta hacer (con `CLOUDINARY_URL` ya puesta):
- **Recomendado:** agregar en el panel una acción «Pasar fotos a Cloudinary». Para cada auto, cada foto de
  `cdn.shopify.com` se manda a Cloudinary con `storeRemoteImage` (`lib/images.ts`, la misma función que
  usa el importador). Luego se reemplaza su enlace en `images` y en `photoSections`, sin cambiar nada más del
  auto (slug, precio, estado ni destacado). Hacerlo en `desarrollo`, con prueba, y publicarlo con el permiso
  del dueño.
- **Alternativa sin código:** borrar el auto en el panel y volver a importarlo desde Shopify. Recupera los
  datos de `data/seed.json`, pero **pierde los cambios hechos en el panel** (precio, estado, destacado,
  equipamiento). Solo conviene si el auto no se ha editado.

Comprueba en cada ficha que las fotos salgan de `res.cloudinary.com`. **Shopify se cancela solo después de
esto** (paso 9).

### Paso 8. Conectar el dominio oficial `h3seminuevos.com`
Necesita acceso a Netlify y al lugar donde está el DNS del dominio (**sin decidir: preguntar al dueño**).
1. En Netlify: **proyecto `h3-seminuevos` → Domain management → Add a domain** → `www.h3seminuevos.com`.
   Netlify agrega también `h3seminuevos.com`. Netlify recomienda usar `www` como dominio principal cuando el
   DNS es externo.
2. En el DNS del dominio, según la documentación de Netlify
   ([configurar DNS externo](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/)):
   - `www`: registro **CNAME** → `h3-seminuevos.netlify.app`. Usa el valor exacto que muestra Netlify al
     agregar el dominio.
   - Raíz (`@`): **ALIAS / ANAME / CNAME aplanado** → `apex-loadbalancer.netlify.com`. Si el proveedor no lo
     permite, registro **A** → `75.2.60.5`.
   - **Quita** los registros que hoy apuntan a Shopify: A `23.227.38.32` y CNAME `shops.myshopify.com`.
3. Si el dominio se compró **dentro de Shopify**, sus registros se cambian en Shopify (Configuración →
   Dominios) y **hay que transferirlo a otro registrador antes de cancelar Shopify**, o se pierde.
4. Espera a que Netlify verifique el DNS. Puede tardar hasta un día. Netlify emite el certificado HTTPS solo;
   confirma en **Domain management → HTTPS** que esté activo.
5. Agrega `NEXT_PUBLIC_SITE_URL=https://www.h3seminuevos.com` (paso 3) y vuelve a publicar: **Deploys →
   Trigger deploy → Deploy project** (15 créditos).
6. Verifica con `node scripts/e2e-public.mjs https://www.h3seminuevos.com` y revisa que los enlaces de
   WhatsApp y `https://www.h3seminuevos.com/sitemap.xml` usen el dominio.

**Mientras cambia el DNS, la tienda de Shopify deja de verse en el dominio.** Hazlo cuando el dueño lo autorice.

### Paso 9. Cancelar Shopify (decisión del dueño)
Solo cuando:
- las fotos ya estén en Cloudinary (paso 7);
- el dominio ya apunte a Netlify (paso 8);
- y, si el dominio está en Shopify, ya se haya transferido.

Cuándo cancelarlo: **sin decidir**, lo decide el dueño. Shopify cuesta 19 USD al mes.

### Paso 10. Limpieza
- Cerrar [Diluvium-mx/h3-web#2](https://github.com/Diluvium-mx/h3-web/pull/2) **sin fusionar**, con el visto
  bueno del dueño. La rama `version-scrollcraft` puede quedarse como archivo.
- Después de fusionar, #1 queda cerrada. **Los cambios siguientes se trabajan en `desarrollo`** y se publican
  con una **solicitud nueva** `desarrollo` → `main`. Su vista previa tendrá otro número
  (`deploy-preview-N--h3-seminuevos.netlify.app`).
- Agregar la entrada en `AVANCE.md` y actualizar `CONTEXTO.md` (secciones 5 y 7) con lo publicado: fecha,
  dominio y si Cloudinary quedó conectado. Súbelo a `desarrollo`; no hace falta publicarlo aparte, porque
  cada cambio a `main` gasta 15 créditos.

---

## 8. Cómo funciona por dentro (lo mínimo para no romper nada)

- **Almacenamiento** (`lib/storage.ts`): en Netlify usa Netlify Blobs (almacén `h3`, consistencia fuerte). Si el
  inventario de Blobs está vacío, muestra `data/seed.json`. En local guarda en `data/*.local.json` (ignorados
  por git). En otro hosting sin nada configurado corre en «modo demo» (solo lectura).
- **Páginas:** estáticas y en caché. Al guardar en el panel se regeneran solas (`updateTag("cars")`), sin
  volver a publicar.
- **Panel protegido** por `proxy.ts` (antes «middleware»). La sesión se firma con `AUTH_SECRET` o con la llave
  guardada en Blobs (`lib/session-secret.ts`).
- **Fotos:** el panel las comprime en el teléfono (≈ 300 KB) y las sube **directo a Cloudinary** con una firma
  que da el servidor (`app/api/upload`). El sitio pide a Cloudinary cada foto del tamaño justo, en AVIF/WebP.
  Ninguna foto de auto pasa por Netlify.
- **Datos del negocio:** `lib/site.ts`. **Equipamiento:** `lib/equipment.ts`. **Tipos y mensajes de WhatsApp:**
  `lib/cars.ts`.
- **Estructura:**
  ```
  app/(site)/          páginas públicas (inicio, inventario, ficha, vende tu auto)
  app/admin/           panel de administración
  app/api/upload/      firma para subir fotos a Cloudinary
  components/          interfaz (home/, catalog/, admin/, site/…)
  lib/                 datos, almacenamiento, acciones del panel, Cloudinary
  data/seed.json       inventario inicial (13 autos de Shopify, revisados)
  scripts/             pruebas de punta a punta y utilidades
  netlify.toml         configuración de Netlify
  proxy.ts             candado de /admin
  ```
- **Skill `/scroll-craft`** en `.claude/skills/scroll-craft/` (MIT). Solo se usa si alguien escribe
  `/scroll-craft`. No hace falta para publicar.

---

## 9. Lo que falta o está sin decidir

| Tema | Estado |
| --- | --- |
| Correo de las cuentas (Netlify, Cloudinary) | Sin decidir. Conviene que sea del negocio. |
| Cuenta de Cloudinary | Sin crear. |
| Pasar las 189 fotos a Cloudinary | Falta (paso 7; el importador actual no sirve para los 13 autos). |
| Dónde está registrado el dominio y quién maneja su DNS | Sin decidir. Preguntar al dueño. |
| Cuándo conectar el dominio y cancelar Shopify | Lo decide el dueño. |
| Contraseña del panel | Se queda la misma (decisión del dueño, 6-nov), guardada cifrada en Ajustes; no se escribe en el repositorio. |
| Reseñas reales | No hay. La sección aparece sola cuando el dueño las agrega en el panel, con permiso de los clientes. |
| Imagen del hero en computadora si se vende la G63 | La tarjeta de precio se oculta sola. Con qué auto rehacer la imagen: sin decidir. |
| Imagen para compartir (`app/opengraph-image.jpg`) | Sigue en el estilo oscuro anterior; cambiarla es opcional. |
| La descripción para Google (`lib/site.ts`, `description`) | Todavía dice «Autos seminuevos premium». El dueño quitó «premium» del hero; si también se quita aquí: sin decidir. |
| Financiamiento, autos a cuenta, garantía | No se mencionan hasta que el dueño responda. |
| Medición (Google Analytics 4 o Cloudflare Web Analytics) | Sin decidir. |
| Revisar en el panel equipamiento, documentos y fotos de cada auto | Pendiente del dueño. |

Más preguntas abiertas en `CONTEXTO.md`, sección 9.
