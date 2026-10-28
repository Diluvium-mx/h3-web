# Cómo probar el sitio desde un celular, de punta a punta

Fecha: 28 de octubre de 2026. Hay 4 formas, de la más rápida a la más real. **Recomendación:** usar la 2
mientras se desarrolla y la 4 antes de publicar cada cambio grande.

| Forma | Qué tan real | Qué necesita | Costo |
| --- | --- | --- | --- |
| 1. Pruebas automáticas en tamaño de celular (desde la nube o la Mac) | Media: Chrome que imita un celular | Nada | $0 |
| 2. **Tu celular en el mismo Wi-Fi que la Mac** (`npm run movil`) | Alta: tu teléfono real | La Mac y el celular en la misma red | $0 |
| 3. Simulador de iPhone (Xcode) o de Android en la Mac | Alta: motor real de Safari o Android | Instalar Xcode (~15 GB) o Android Studio | $0 |
| 4. **Vista previa de Netlify** (https, desde cualquier red) | La más alta: es el sitio publicado | Cuenta de Netlify | $0: las vistas previas no gastan créditos |

## 1. Pruebas automáticas en tamaño de celular

Ya existen y corren con cada cambio (ver `CLAUDE.md`):

```bash
npm run dev
node scripts/e2e-public.mjs http://localhost:3000   # 26 pruebas del sitio
node scripts/e2e-admin.mjs http://localhost:3000    # 23 pruebas del panel
```

Para **ver** el recorrido completo en video, en tamaño iPhone y Android:

```bash
node scripts/recorrido-movil.mjs http://localhost:3000
```

Graba el inicio, el catálogo con filtros, una ficha (fotos por sección y equipamiento), «Vende tu auto» y
el panel con login. Los videos quedan en `recorridos/`, que git ignora.

**Límite:** el navegador es Chrome imitando un celular. No prueba Safari de iPhone, no abre la app de
WhatsApp y no usa la cámara real.

## 2. Tu celular en el mismo Wi-Fi (la forma diaria)

En la Mac, dentro de la carpeta del proyecto:

```bash
npm run actualizar   # baja la última versión de la rama desarrollo
npm run movil
```

**Importante:** el celular y el navegador muestran **lo que hay en la carpeta de tu Mac**. Cuando se suben
cambios a GitHub, tu Mac no los tiene hasta que corres `npm run actualizar`. Si `npm run movil` ya estaba
corriendo, deténlo con `Ctrl + C`, actualiza, vuelve a correrlo y recarga la página.

Muestra un enlace como `http://192.168.1.50:3000` y un **código QR**. Apunta la cámara del celular al QR
y se abre el sitio.

- El panel está en `/admin`. La contraseña inicial es `12345` (se cambia en Panel → Ajustes), o la de `ADMIN_PASSWORD` si creaste
  `.env.local`.
- Todo lo que cambies en el código se ve en el celular al instante.
- Si la Mac tiene varias redes y el enlace no abre: `H3_IP=192.168.1.50 npm run movil`, con la IP de tu
  Wi-Fi (Ajustes del Sistema → Wi-Fi → Detalles).
- Si no abre nada, revisa que el firewall de la Mac permita conexiones entrantes a Node.

**Para usar datos del celular en vez del Wi-Fi:** `npm run movil -- --tunel`. Da un enlace https temporal.
Requiere instalar una vez `brew install cloudflared`, que es gratis y no pide cuenta.

**Ojo con http:** por `http://192.168…` el navegador del celular no permite algunas funciones que sí
funcionan en el sitio publicado (https):
- «Compartir» con el menú del teléfono. Ahí abre WhatsApp para compartir.
- Copiar al portapapeles.

Para probar esas dos, usa el túnel (`--tunel`) o la forma 4.

> Se probó el 28-oct entrando por la IP de red en vez de `localhost`: pasan las 23 pruebas del sitio y
> las 17 del panel. Esa prueba encontró un error que ya se corrigió: agregar fotos en el panel fallaba
> fuera de https.

## 3. Simulador en la Mac

- **iPhone (Safari real):** instala Xcode desde la App Store y abre Xcode → Open Developer Tool →
  Simulator. Con `npm run dev` corriendo, en el Safari del simulador abre `http://localhost:3000`.
- **Android:** Android Studio → Device Manager → crea un Pixel. En el emulador, la Mac es `10.0.2.2`:
  abre `http://10.0.2.2:3000`.
- **Rápido, pero menos real:** en Chrome de la Mac, Ver → Desarrollador → Herramientas para
  desarrolladores → ícono de celular.

> Si conectas la Mac a esta sesión con Remote Control (app de Claude → Ajustes → Claude Code → Remote
> Control), Claude puede encender el servidor y el simulador de iPhone en tu Mac y tomar capturas desde
> aquí.

## 4. Vista previa de Netlify (antes de publicar)

Cuando la cuenta de Netlify esté conectada al repositorio, cada rama o pull request genera un enlace https
de vista previa, por ejemplo `https://deploy-preview-12--h3.netlify.app`.

- Se abre en cualquier celular, desde cualquier red.
- Usa Upstash y Cloudinary de verdad.
- **No gasta créditos.**
- La contraseña del panel es la de `ADMIN_PASSWORD` en Netlify.

## Lista para revisar en el celular real

Marca cada punto en un iPhone y en un Android:

**Sitio**
- [ ] Inicio: título, botón y fotos se ven sin bajar; el texto no se corta.
- [ ] Catálogo: buscar, historias de tipos, hoja de filtros, «Limpiar».
- [ ] Ficha:
  - [ ] Deslizar fotos y verlas en pantalla completa.
  - [ ] Pestañas Exterior / Interior.
  - [ ] Equipamiento.
  - [ ] Barra fija al bajar, que no tape nada (también en iPhone con «isla»).
- [ ] **«Me interesa este auto» abre la app de WhatsApp con el mensaje y el enlace del auto.**
- [ ] «Kilometraje: pregúntanos», «Llamar», «Visita» y «Mándaselo por WhatsApp».
- [ ] «Compartir» abre el menú del teléfono (solo con https: túnel o forma 4).
- [ ] «Vende tu auto»: los 3 pasos, el teclado numérico en kilometraje y año, y el mensaje de WhatsApp.
- [ ] Girar el teléfono: no hay scroll de lado.

**Panel**
- [ ] Entrar con la contraseña.
- [ ] Agregar fotos **desde la cámara** y desde la galería.
- [ ] Elegir la sección de cada foto y el equipamiento.
- [ ] Publicar y ver el auto en el sitio al momento.
- [ ] Cambiar a «Apartado» o «Vendido» y ver la etiqueta en el sitio.
- [ ] Reseñas: agregar una de prueba y borrarla.
