# Investigación: repos de GitHub de sitios de autos y qué tomamos para H3

Fecha: 28 de octubre de 2026. Se revisaron 11 repositorios públicos: se leyó el código de la página de
cada auto. También se consultaron guías de AutoTrader y Google. El sitio de Kavak bloqueó el acceso
automático, así que no se pudo revisar.

**Conclusión:** este tipo de sitio tiene poca tracción en GitHub. Fuera de un proyecto de tutorial con
alrededor de 1,900 estrellas, el repositorio de agencias de autos más popular tiene menos de 100. Varios
inventan datos de confianza, como años de experiencia, número de clientes o garantías. La ficha de H3 ya
cubría lo básico; de los repos se tomaron las ideas que no necesitan datos que no tenemos.

## Repos revisados

| Repo | Estrellas (aprox.) | Tecnología | Qué vale la pena |
| --- | --- | --- | --- |
| [adrianhajdin/project_next13_car_showcase](https://github.com/adrianhajdin/project_next13_car_showcase) | ~1.9k | Next 13 | Filtros en la URL. Más útil como ejemplo de qué evitar: ficha en ventana emergente sin URL propia y fotos de catálogo |
| [piyush-eon/ai-car-marketplace](https://github.com/piyush-eon/ai-car-marketplace) | 54 | Next 15, Prisma | Ficha completa: galería con miniaturas, guardar, compartir y aviso de vendido |
| [TechWithEmmaYT/…Appwrite-Nuqs](https://github.com/TechWithEmmaYT/Build-Full-Stack-Car-Marketplace-Nextjs-Appwrite-Nuqs) | 58 | Next, Appwrite | Equipamiento con una lista cerrada de opciones |
| [fridaysystems/inventory-presser](https://github.com/fridaysystems/inventory-presser) | plugin real de WordPress | PHP | Lo más «de producción»: autos borrados que no dan error, reglas de precio, ficha para imprimir |
| [mbeps/car-dealership](https://github.com/mbeps/car-dealership) | — | Next, Supabase | El administrador edita y cambia el estado desde la misma ficha |
| [aalzriqat/Auto](https://github.com/aalzriqat/Auto) | — | Next | Compartir por WhatsApp con título, precio y enlace |
| [AliAskariGithub/merchants-luxury-motors](https://github.com/AliAskariGithub/merchants-luxury-motors) | — | Next 16 | Fotos por pestañas (exterior, interior y video). Ojo: inventa cifras y testimonios |
| [samirajaj/autonest-next.js](https://github.com/samirajaj/autonest-next.js) | 10 | Next, Cloudinary | Galería en mosaico |
| [tramyardg/autoexpress](https://github.com/tramyardg/autoexpress) | 30 | PHP | Botón de imprimir la ficha |

## Ideas y su estado

| Idea | De dónde salió | Estado |
| --- | --- | --- |
| Botón principal visible en la primera pantalla del celular, con quita-miedos | Videos de landing pages | **Hecho** (28-oct) |
| Todas las fotos en cuadrícula, sin depender del carrusel | Videos de landing pages y galerías en mosaico | **Hecho** |
| «¿Lo decides con alguien más? Mándaselo por WhatsApp» | aalzriqat/Auto | **Hecho** |
| Enlace viejo o auto borrado: «Este auto ya no está» con autos de la misma marca, en vez de un error | inventory-presser | **Hecho** |
| Video del auto (YouTube se ve dentro de la ficha; TikTok, Instagram y Facebook abren la red) | luxury-motors, inventory-presser y AutoTrader | **Hecho**: campo opcional en el panel. Falta que el dueño grabe videos |
| Migas de pan para Google | Buenas prácticas de SEO | **Hecho** |
| Botón según el estado: disponible «Me interesa», apartado «Avísame si se libera» y vendido «Búscame uno similar» | Varios repos | **Hecho** |
| Fotos por secciones (exterior, interior) | luxury-motors | Pendiente: requiere etiquetar cada foto en el panel |
| Equipamiento con lista cerrada e íconos (CarPlay, quemacocos…) | TechWithEmma | Pendiente: el dueño marca solo lo que tiene cada auto |
| «Antes / ahora» cuando baja el precio | inventory-presser | **Sin decidir**: si quieren mostrar rebajas |
| Botón «Editar / Apartar» en la ficha cuando entra el dueño | mbeps | Pendiente |
| Ficha para imprimir o guardar en PDF | autoexpress | Pendiente, prioridad baja |
| «Actualizado el …» | inventory-presser | No se hizo: si el dueño no edita en meses, da mala impresión |

## Lo que NO se hace (necesita datos que no tenemos)

- **Calculadora de mensualidades:** los repos usan tasas inventadas (5 % o 13.5 %). El financiamiento está
  **sin decidir**.
- **Prueba de manejo con calendario:** **sin decidir**. Se usa «Agendar visita» por WhatsApp.
- **Sellos de garantía, inspección o historial:** **sin decidir**.
- **Calificación por auto o testimonios fijos en el código:** las reseñas solo salen del panel y son reales.
- **Pedir cuenta para guardar o agendar:** agrega fricción.
- **Placas visibles en el texto.**

**Nota de SEO:** Google dejó de mostrar resultados especiales para anuncios de vehículos en 2025
([anuncio](https://developers.google.com/search/blog/2025/06/simplifying-search-results)). Los datos
estructurados del auto se quedan porque no estorban, pero no dan una vista especial en Google.
