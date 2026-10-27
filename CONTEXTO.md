# Contexto del proyecto: página web de H3 Seminuevos

Última actualización: 27 de octubre de 2026 (con las decisiones del dueño de ese día).
Regla: aquí no se inventa nada. Lo que no está decidido dice **«sin decidir»**.

---

## 1. Qué es H3

- **Nombre:** H3 Seminuevos. Lema del logo: «Ready to drive».
- **Ciudad:** Villahermosa, Tabasco, México. Dirección: Av. Paseo Tabasco #315, Col. Municipal.
  - **En la página solo se menciona Villahermosa, Tabasco.** No se mencionan ciudades cercanas, ni en
    los textos ni en el SEO (decisión del 27-oct).
- **Contacto:** WhatsApp y teléfono (993) 246 7572.
- **Redes:** Instagram [@h3seminuevos](https://www.instagram.com/h3seminuevos),
  Facebook [H3Seminuevos](https://www.facebook.com/H3Seminuevos),
  TikTok [@homeronatal](https://www.tiktok.com/@homeronatal).
- **Horario:** lunes a sábado de 9:00 a 17:00. Domingo cerrado.
- **Qué vende:** autos seminuevos, la mayoría de gama alta. Al 27-oct-2026 hay 13 autos publicados,
  de $209,000 a $2,850,000 MXN. Algunos ejemplos son una Mercedes-AMG G63, un BMW M3, un Mustang GT,
  una Cheyenne High Country y dos camionetas blindadas.
- **Otros servicios:**
  - **Compran autos directamente**, pero la página **no debe decirlo**. Solo aparece la opción «Vende tu
    auto» y los detalles los ve el encargado por WhatsApp.
  - **Personalización y modificaciones** de autos de gama alta: sí lo ofrecen, pero **no va en la página
    por ahora**.
  - **Financiamiento y autos a cuenta:** **sin respuesta todavía. No se mencionan** en la página.
- **Lo que los distingue** (textos del sitio actual en Shopify): autos verificados, precios justos y
  atención personalizada.
- **Página actual:** https://www.h3seminuevos.com (Shopify, $19 USD al mes).

## 2. Qué debe lograr la página

1. Mostrar el catálogo de autos con una interfaz muy amigable y profesional, sobre todo en celular:
   fotos, características y precio.
2. Que el interesado **mande WhatsApp con el auto que le gustó ya escrito en el mensaje**.
3. Que quien quiera **vender su auto** mande sus datos por WhatsApp.
4. Que el dueño **suba y edite autos desde un panel**, sin depender de un programador.
5. **Dejar de pagar Shopify** y que el hosting sea **gratis**.
6. Verse moderna, juvenil, deportiva y **clara**, con colores llamativos y microanimaciones.

No se busca vender en línea: no hay carrito ni pagos.

## 3. Secciones de la página (en orden)

**Inicio (`/`)**
1. **Encabezado fijo:** logo, Catálogo, Vende tu auto, Contacto y botón de WhatsApp. En celular lleva un
   menú de pantalla completa.
2. **Hero:**
   - Fotos de los autos destacados que van rotando. En celular, la foto se desvanece a blanco donde va
     el texto.
   - Título «Tu próximo auto está aquí.».
   - Botones «Ver catálogo» (rojo) y «Vender mi auto» (amarillo).
   - Tres datos: autos disponibles, ubicación y «Atención 1 a 1».
3. **Franja animada** con las marcas del inventario.
4. **«Lo disponible 🔥»:** autos destacados. En celular se deslizan de lado.
5. **«Explora por tipo»** y botones por rango de precio.
6. **«¿Por qué H3?»:** autos verificados, precios justos y atención personalizada.
7. **Banner rojo «¿Quieres vender tu auto?»**, que lleva a la página de venta.
8. **«Recién vendidos»:** solo aparece si hay autos marcados como vendidos.
9. **Contacto:**
   - Dirección, horario y botones de Google Maps y Waze.
   - WhatsApp, llamada y redes.
10. **Pie de página** y **botón flotante de WhatsApp**.

**Catálogo (`/autos`)** — rediseñado el 27-oct, empezando por celular:
- **Encabezado:**
  - Franjas de carreras amarilla, roja y negra que entran animadas.
  - Título «Catálogo» subrayado en amarillo.
- **Buscador y filtros:**
  - Buscador y botón de filtros, que se pone rojo cuando hay filtros activos.
  - **Tipos de auto como «historias»:** fotos redondas con el número de autos. Al elegir uno, aparece un
    anillo giratorio rojo-amarillo.
  - Filtros por marca, precio, año y transmisión, y orden. En celular están en una hoja desde abajo.
- **Tarjeta de cada auto:**
  - Foto, año en etiqueta amarilla y precio en etiqueta roja.
  - Marca, modelo y versión.
  - **Características resumidas** con íconos: kilometraje, transmisión y combustible. Si falta el
    kilometraje dice «Km: pregúntanos».
- Si no hay resultados, se ofrece «Búscame uno» por WhatsApp.

**Detalle de cada auto (`/autos/<nombre-del-auto>`)**
- Galería deslizable con pantalla completa.
- Precio y **resumen de 4 datos con íconos de color:** año, kilometraje, transmisión y combustible.
- **Ficha técnica:** lo anterior más motor, tipo y los extras que existan.
- **Si falta un dato**, en su lugar aparece «Pregúntanos» con botón de WhatsApp. También se muestra el
  texto «Para más información, mándanos un mensaje; te respondemos de inmediato.» con botón
  «Preguntar» (decisión del 27-oct). Nunca se inventa el dato.
- «Lo que destaca», descripción y autos similares.
- Botones: «Me interesa este auto» (WhatsApp con el auto, precio y enlace), «Agendar visita», llamar y
  compartir.
- En celular aparece una barra fija de WhatsApp al bajar.

**Vende tu auto (`/vende-tu-auto`)**
- Pasos:
  1. Cuéntanos de tu auto.
  2. Envía fotos por WhatsApp.
  3. Te atendemos por WhatsApp.
- Formulario de 3 partes:
  1. Datos del auto.
  2. Detalles.
  3. Nombre y comentarios (ya no pide ciudad).
- Arma el mensaje de WhatsApp. **No dice que H3 compra autos ni habla de propuestas.**

**Panel (`/admin`, con contraseña)**
- Inventario con búsqueda y pestañas: Disponibles, Apartados y Vendidos.
- Alta y edición de autos con fotos (se comprimen en el teléfono).
- Importar de Shopify.

**Estados de un auto**
- **Disponible:** se ve en el catálogo.
- **Apartado:** se ve con una etiqueta amarilla.
- **Vendido:** sale del catálogo y aparece en «Recién vendidos».

## 4. Textos, logo, colores, tipografías y fotos

| Qué | Estado | Dónde |
| --- | --- | --- |
| Logo completo (blanco, con «READY TO DRIVE») | Existe; se tomó del Shopify | `public/brand/logo.png` |
| Logo completo en negro (para fondo claro) | Generado del logo original | `public/brand/logo-dark.png` |
| Marca «H3» (blanca y negra) | Recortada del logo | `public/brand/mark.png`, `public/brand/mark-dark.png` |
| Íconos (pestaña, celular) | Generados con el logo | `app/icon.png`, `app/apple-icon.png`, `public/brand/icon-*.png` |
| Imagen para compartir en redes | Generada con foto de la G63; aún en estilo oscuro | `app/opengraph-image.jpg` |
| Colores | Tema claro desde el 27-oct | `app/globals.css` (`@theme`) |
| Tipografía de títulos y etiquetas | Saira expandida (itálica 800 y normal 600), en archivos propios | `app/fonts/` |
| Tipografía de texto | Geist | `app/layout.tsx` |
| Datos del negocio | Teléfono, dirección, horario y redes | `lib/site.ts` |
| Inventario inicial | 13 autos de Shopify con datos revisados | `data/seed.json` |
| Fotos de los autos | 189 fotos en el CDN de Shopify | Enlaces dentro de `data/seed.json` |

Colores del tema claro:

| Uso | Color |
| --- | --- |
| Fondo | `#f4f4f0` |
| Tarjetas | `#ffffff` |
| Texto | `#141417` |
| Rojo de marca | `#e3141f` |
| Rojo para texto pequeño | `#c40f19` |
| Amarillo de marca | `#fad116` |
| Verde de WhatsApp | `#25d366` |

Notas:
- **Las fotos desaparecerán al cancelar Shopify.** Hay que copiarlas al almacenamiento definitivo
  **antes** de cancelar.
- Casi todas las fotos se tomaron con celular y son verticales.
- **Datos corregidos el 27-oct:**
  - Ford Expedition: **74,649 km**. Se quitó el 82,135, también de la descripción.
  - BMW M240i: **automático**.
  - Mustang GT y Mazda CX-5: **no se tiene el kilometraje** y la página invita a preguntar.

## 5. Con qué se hace, dónde se publica y con qué dominio

**Código**
- Next.js 16.4 (App Router con Cache Components), React 19.3, TypeScript y Tailwind CSS 4.
- **Inventario:** Upstash Redis, gratis. Sin Redis, el sitio corre en «modo demo» con `data/seed.json`.
- **Fotos:** hoy el código usa Vercel Blob, que **habrá que cambiar** (ver abajo).
- Las páginas públicas son estáticas. Se regeneran solas cuando el dueño guarda algo en el panel, sin
  volver a desplegar.

**Hosting: decisión del dueño (27-oct): SOLO gratis, nada de planes de pago. Primera opción: Netlify Free.**

Comparación con números, medida el 27-oct sobre la versión actual. La medición se hizo en un celular de
pantalla muy densa, primera visita y sin caché, que es el caso más pesado.

| Qué se midió | Resultado |
| --- | --- |
| Visita completa (inicio → catálogo → 2 autos) | **≈ 3.0 MB** y 118 peticiones: ≈ 2.5 MB de fotos + ≈ 0.5 MB del resto |
| Visita corta (enlace directo a 1 auto) | **≈ 1.4 MB** y 37 peticiones: ≈ 1.1 MB de fotos + ≈ 0.3 MB del resto |
| Memoria RAM del servidor de Next.js | 136 MB en reposo y 170–316 MB después de optimizar fotos |

**Railway Free** ($1 de uso al mes; los $5 de prueba son una sola vez)
([precios](https://railway.com/pricing)):
- La RAM cuesta $0.00000386 por GB-segundo, unos $10 por GB al mes.
- Con 0.14–0.32 GB encendido todo el mes, solo la RAM cuesta **$1.40–$3.20 al mes**, sin contar CPU ni
  tráfico. **El $1 se acaba en 9 a 21 días.**
- Al acabarse, Railway **apaga los servicios hasta el mes siguiente** y hay que volver a desplegarlos a
  mano ([foro de Railway](https://station.railway.com/billing/free-plan-confusion-62db1780)).
- Su modo «Serverless» duerme el servicio tras 5–10 minutos sin tráfico. La primera visita después
  espera a que despierte y puede recibir un error 502
  ([docs](https://docs.railway.com/reference/app-sleeping)).
- **Conclusión: no aguanta la página prendida todo el mes sin pagar. Descartado.**

**Netlify Free** (300 créditos al mes, límite duro)
([precios](https://www.netlify.com/pricing/),
[créditos](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)):
- **Cuánto cuesta cada cosa:**

  | Uso | Créditos |
  | --- | --- |
  | Despliegue a producción | 15 |
  | Vistas previas | 0 |
  | 1 GB de tráfico | 20 |
  | 10,000 peticiones | 2 |

- Si se acaban los créditos, **todos los sitios de la cuenta se pausan** hasta el mes siguiente.
- Permite uso comercial ([blog oficial](https://www.netlify.com/blog/introducing-netlify-free-plan)) y
  soporta Cache Components de Next.js ([docs](https://docs.netlify.com/frameworks/next-js/overview/)).
- **Cuántas visitas aguanta**, suponiendo 4 despliegues al mes (60 créditos) y un margen del 10%. Quedan
  unos 216 créditos para visitas:

  | Dónde están las fotos | Créditos por 1,000 visitas completas | Visitas completas al mes | Visitas cortas al mes |
  | --- | --- | --- | --- |
  | En Netlify | ≈ 84 | **≈ 2,500** | ≈ 6,100 |
  | En Cloudinary Free | ≈ 25 | **≈ 8,600** | ≈ 19,600 |

  Con fotos en Cloudinary Free, el límite lo pone el propio Cloudinary: 25 créditos son unos 22 GB de
  fotos, que dan para **≈ 8,800 visitas completas**.
- **Conclusión:** Netlify Free sí puede aguantar el mes completo si el tráfico queda por debajo de esas
  cifras. El tráfico real de H3 es **desconocido**.
- **No se ha hecho un despliegue de prueba en Netlify.**

**Propuesta para gastar pocos créditos en Netlify** (propuesta, **sin decidir**):
1. **Fotos optimizadas (ya aplicado el 27-oct):**
   - En celular se piden fotos de 640–828 px en lugar de 1080–1440.
   - Una visita completa bajó de ≈ 6.6 MB a ≈ 3.0 MB.
   - En el teléfono del dueño las fotos se comprimen a unos 300 KB antes de subir.
2. **Pocos despliegues:**
   - Editar autos en el panel no gasta despliegues.
   - Juntar los cambios de código y publicar a producción como máximo unas 4 veces al mes.
   - Probar en vistas previas, que cuestan 0 créditos.
3. **Fotos fuera de Netlify:** guardarlas y servirlas desde **Cloudinary Free** para que su tráfico no
   gaste créditos de Netlify.
   - **Cloudinary Free:** 25 créditos al mes; 1 crédito equivale a 1 GB de almacenamiento, 1 GB de
     tráfico o 1,000 transformaciones ([precios](https://cloudinary.com/pricing)).
   - Sin tarjeta.
   - Su página de precios no menciona restricción de uso comercial; **falta confirmarlo en sus términos**.
   - El inventario actual (~200 fotos de ~300 KB) ocupa menos de 0.1 GB.
   - Requiere cambiar el código de subida de fotos (hoy usa Vercel Blob).
4. Tener **solo esta página** en la cuenta de Netlify, porque si se acaban los créditos se pausa todo.
5. Revisar el consumo de créditos en el panel de Netlify cada semana.

**Dónde guardar las fotos: sin decidir.** Propuesta: Cloudinary Free.

**Dominio:** h3seminuevos.com (ya existe). Va aparte y se verá después: **sin decidir**.

**Repositorio:** `Diluvium-mx/h3-web`. Es público y temporal; se borrará después.

## 6. Lo que ya está hecho

- **Sitio completo:** inicio, catálogo, detalle de auto, vende tu auto, 404, panel e importador de Shopify.
- **Datos:** los 13 autos reales del Shopify, con datos corregidos.
- **WhatsApp:** mensajes prellenados con el auto, el precio y el enlace. También para preguntar un dato
  que falta.
- **SEO local** solo para Villahermosa, Tabasco: datos estructurados con horario, `sitemap.xml` y
  `robots.txt`.
- **Seguridad del panel:** contraseña desde variable de entorno, sesión firmada y límite de intentos de
  login.
- **Pruebas:** 24 pruebas automáticas pasan; los scripts están en `scripts/`.
- **27-oct:**
  - **Tema claro** en todo el sitio.
  - **Catálogo rediseñado** para celular, con colores de marca, historias de tipos y tarjetas con
    características resumidas.
  - Detalle con resumen de datos y aviso para datos faltantes.
  - Correcciones de datos y textos de «Vende tu auto».
  - Ciudades cercanas eliminadas y fotos optimizadas.

## 7. Lo que falta (en orden)

1. **Mejorar el resto del diseño** al estilo del catálogo nuevo, sobre todo inicio y detalle en
   celular. Detalles concretos: **sin decidir**.
2. **Decidir dónde guardar las fotos** (propuesta: Cloudinary Free) y cambiar el código de subida.
3. **Adaptar y probar el despliegue en Netlify Free:**
   - Variables de entorno.
   - Upstash Redis.
   - Prueba de que el panel actualiza el sitio sin volver a desplegar.
4. Importar el inventario desde Shopify **antes** de cancelarlo.
5. Actualizar la imagen para compartir en redes al estilo claro (opcional).
6. Conectar el dominio: **sin decidir** cuándo.
7. Cancelar Shopify.

## 8. Decisiones tomadas y cosas descartadas

**Tomadas**
- Página informativa con catálogo; **sin carrito ni pagos**. El contacto es por WhatsApp con el mensaje
  prellenado.
- Panel propio para que el dueño suba y edite autos desde el celular.
- **Diseño claro**, nada tan oscuro como la primera versión. Colores llamativos sin perder el logo ni el
  rojo y amarillo de la marca. Se empieza por el catálogo en celular (27-oct).
- **Características de cada auto resumidas** y fáciles de entender (27-oct).
- **Si falta un dato no se inventa.** Se pone «Para más información, mándanos un mensaje; te respondemos
  de inmediato.» con botón de WhatsApp (27-oct).
- **Hosting solo gratis**, nada de planes de pago. Primera opción: **Netlify Free** (27-oct).
- «Vende tu auto»: **sí compran directo, pero la página no lo dice**. Los detalles los ve el encargado por
  WhatsApp (27-oct).
- **Solo Villahermosa, Tabasco**, sin ciudades cercanas en textos ni SEO (27-oct).
- **Financiamiento y autos a cuenta: no se mencionan** hasta tener respuesta (27-oct).
- La sección de personalización (H3 Custom) **no se incluye por ahora**, aunque sí ofrecen el servicio.
- Horario: lunes a sábado de 9:00 a 17:00; domingo cerrado.
- El dominio se verá después.
- Seguimiento en un repo público temporal, con `CONTEXTO.md` y `AVANCE.md`.

**Descartadas**
- Seguir en Shopify: cuesta $19 USD al mes y su carrito no sirve para vender autos.
- Cualquier plan de pago, incluidos Vercel Pro ($20/mes) y Netlify Personal ($9/mes).
- Vercel Hobby: sus reglas no permiten uso comercial.
- Railway Free: el $1 al mes no alcanza para tener la página prendida todo el mes (ver punto 5).
- Sección «H3 Custom» en la página (por ahora).
- Lista de ciudades cercanas.

## 9. Preguntas abiertas

1. ¿Aceptas **Cloudinary Free** para guardar las fotos? Si sí, hay que crear una cuenta gratuita.
2. ¿Cuántas visitas al mes recibe hoy la página? Sirve para confirmar que alcanzan los créditos gratis
   de Netlify.
3. Financiamiento y autos a cuenta: ¿los ofrecen? Mientras no haya respuesta, no se mencionan.
4. ¿Qué quieres mejorar después del catálogo: inicio, detalle del auto u otra cosa?
5. Dominio: ¿dónde está registrado y cuándo se conecta?
6. ¿Quién va a administrar el panel? La contraseña **no** se sube a este repositorio.
