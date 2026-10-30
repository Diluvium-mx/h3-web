# Instrucciones para trabajar en este proyecto

@AGENTS.md

1. Antes de empezar, lee `CONTEXTO.md` (qué es H3, qué está decidido y qué no) y `AVANCE.md`.
2. No inventes datos del negocio. Si algo no está decidido, escríbelo como «sin decidir» y pregúntalo.
3. **El repositorio es público:** nunca subas llaves, contraseñas, tokens, `.env` ni datos de clientes.
4. Cada vez que avances, agrega una entrada **arriba** en `AVANCE.md` con:
   - la fecha;
   - de 2 a 4 líneas sencillas de lo que se hizo;
   - una línea «Falta: …».

   Haz commit y push seguido (a la rama `desarrollo`, ver punto 9).
5. Si cambia una decisión o se responde una pregunta abierta, actualiza `CONTEXTO.md`.
6. Todo el texto visible del sitio va en español de México.
7. Antes de subir cambios, verifica:

   ```bash
   npx next typegen   # genera los tipos de rutas (PageProps, LayoutProps)
   npx tsc --noEmit
   npx eslint .
   npx next build
   ```

   Pruebas de punta a punta, con el sitio corriendo:

   ```bash
   npm run dev
   node scripts/e2e-public.mjs http://localhost:3000
   node scripts/e2e-admin.mjs http://localhost:3000
   ```

   La prueba del panel usa la contraseña inicial `12345` (o `ADMIN_PASSWORD`) y modifica
   `data/cars.local.json`, `data/reviews.local.json` y `data/settings.local.json` (este último lo respalda y
   lo restaura al terminar); los tres están ignorados por git.

   En celular (ver `PRUEBAS-EN-CELULAR.md`): `npm run movil` para un teléfono real en el mismo Wi-Fi y
   `node scripts/recorrido-movil.mjs http://localhost:3000` para grabar el recorrido en video.

   Fotos en Cloudinary (con datos de prueba, nunca los reales):

   ```bash
   node --experimental-strip-types --conditions=react-server scripts/check-cloudinary.mjs
   CLOUDINARY_URL=cloudinary://111:secreto-de-prueba@h3prueba npm run dev
   node scripts/e2e-cloudinary.mjs http://localhost:3000
   ```

8. Hosting: Netlify Free (solo planes gratuitos). Cuida los créditos: pocos despliegues a producción,
   fotos siempre desde Cloudinary (nunca por el hosting).
9. **Ramas:** trabaja y sube en la rama `desarrollo`. Netlify publica `main`, y cada vez gasta 15 de 300
   créditos al mes. Pasa los cambios a `main` solo cuando el dueño pida publicar.
   La vista previa (0 créditos) sale de la solicitud de cambios #1 (`desarrollo` → `main`):
   https://deploy-preview-1--h3-seminuevos.netlify.app. No la fusiones sin que el dueño diga «publica».
