#!/bin/bash
# Baja la última versión del sitio (rama desarrollo) y la abre para la Mac y el celular.
# Uso, en cualquier ventana de la Terminal:
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/Diluvium-mx/h3-web/desarrollo/scripts/ver-en-mac.sh)"
# No necesita git. Deja el sitio en la carpeta ~/h3-web-vista y la reutiliza cada vez (solo baja lo nuevo).
set -euo pipefail

DIR="${H3_DIR:-$HOME/h3-web-vista}"
ZIP_URL="https://codeload.github.com/Diluvium-mx/h3-web/zip/refs/heads/desarrollo"

echo ""
echo "🚗 H3 Seminuevos: bajando la última versión…"

if ! command -v node >/dev/null 2>&1; then
  echo "❌ No encontré Node.js. Instálalo desde https://nodejs.org (versión LTS) y vuelve a correr el comando."
  exit 1
fi

# 1. Detiene el sitio viejo si sigue prendido (es lo que hacía que no se viera el cambio).
#    Solo toca procesos de Next.js: el que escucha en el puerto 3000 y el que corre desde ~/h3-web-vista.
MY_PGID=$(ps -o pgid= -p $$ | tr -d ' ')
stop_group() {
  local pid="$1" pgid
  ps -o command= -p "$pid" 2>/dev/null | grep -qE "next|node" || return 0
  pgid=$(ps -o pgid= -p "$pid" 2>/dev/null | tr -d ' ')
  if [ -n "$pgid" ] && [ "$pgid" != "$MY_PGID" ]; then kill -TERM -- "-$pgid" 2>/dev/null || true; fi
}
old_pids() {
  { command -v lsof >/dev/null 2>&1 && lsof -nP -ti tcp:3000 -sTCP:LISTEN; pgrep -f "$DIR/node_modules/.bin/next"; } 2>/dev/null | sort -u
}
OLD=$(old_pids || true)
if [ -n "$OLD" ]; then
  echo "   Deteniendo el sitio anterior que seguía prendido…"
  for pid in $OLD; do stop_group "$pid"; done
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    [ -z "$(old_pids || true)" ] && break
    sleep 1
  done
fi

# 2. Baja el código de GitHub (sin git) y lo pone en ~/h3-web-vista, conservando lo ya instalado
if [ -e "$DIR" ] && [ ! -e "$DIR/.h3-vista" ] && ! grep -qs '"name": "h3-seminuevos"' "$DIR/package.json"; then
  echo "❌ $DIR ya existe y no es del sitio. Muévela o bórrala y vuelve a correr el comando."
  exit 1
fi
rm -rf "$HOME"/.h3-descarga.* 2>/dev/null || true   # restos de veces anteriores
TMP=$(mktemp -d "$HOME/.h3-descarga.XXXXXX")
trap 'rm -rf "$TMP" 2>/dev/null || true' EXIT
curl -fsSL "$ZIP_URL" -o "$TMP/h3.zip"
unzip -q "$TMP/h3.zip" -d "$TMP"
SRC=$(find "$TMP" -mindepth 1 -maxdepth 1 -type d -name "h3-web-*" | head -n 1)
if [ -d "$DIR" ]; then
  # Lo instalado y los datos de prueba del panel pasan a la versión nueva
  for keep in node_modules .env.local public/uploads; do
    if [ -e "$DIR/$keep" ]; then
      rm -rf "${SRC:?}/$keep"
      mkdir -p "$(dirname "$SRC/$keep")"
      mv "$DIR/$keep" "$SRC/$keep"
    fi
  done
  for f in "$DIR"/data/*.local.json; do
    if [ -e "$f" ]; then mv "$f" "$SRC/data/"; fi
  done
  # La carpeta vieja se aparta de un jalón (nunca queda a medias) y se borra al final
  mv "$DIR" "$TMP/anterior"
fi
mv "$SRC" "$DIR"
touch "$DIR/.h3-vista"
cd "$DIR"

# 3. Instala lo necesario (la primera vez tarda 1 o 2 minutos; después, segundos)
echo "   Instalando dependencias…"
npm install --no-audit --no-fund --loglevel=error

echo "✅ Listo. Versión: $(grep -m1 '^## ' AVANCE.md 2>/dev/null | sed 's/^## //' || echo 'desarrollo')"
echo "   Carpeta: $DIR"
echo ""

# 4. Prende el sitio y muestra el QR para el celular (detenlo con Ctrl + C)
rm -rf "$TMP" 2>/dev/null || true
if [ "${H3_SIN_INICIAR:-}" = "1" ]; then exit 0; fi
exec npm run movil
