# Origen de este skill

Copia de **scroll-craft** de Nate Herk: <https://github.com/nateherkai/scroll-craft> (versión `75d81f7`),
licencia MIT (ver `LICENSE`).

Cambio hecho en H3: en `SKILL.md` se agregó `disable-model-invocation: true`. Así el skill **solo se usa
cuando alguien escribe `/scroll-craft`** en Claude Code; Claude no lo carga por su cuenta.

Notas:
- `scripts/kie.mjs` genera imágenes y videos con kie.ai (de pago). Solo funciona si se configura
  `KIE_AI_API_KEY`, y sube las imágenes de referencia a un servicio de kie.ai. Nunca subas esa llave al
  repositorio.
- El motor (`engine/`) es para páginas HTML sueltas. En este sitio (Next.js) se usan sus principios, no el
  motor.
