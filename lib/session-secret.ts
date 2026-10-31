import "server-only";
import { envSessionSecret } from "./session";
import { getSetting, getStorageMode, putSetting } from "./storage";

const KEY = "sessionSecret";
const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));

// Llave de la sesión en el servidor: la de las variables de entorno o, en Netlify sin ellas, una al azar que
// se crea la primera vez y se guarda en Netlify Blobs (nunca en el repositorio). `null` = el panel no puede
// iniciar sesión en este hosting.
export async function sessionSecret(): Promise<string | null> {
  const env = envSessionSecret();
  if (env) return env;
  if (getStorageMode() !== "blobs") return null;
  const stored = await getSetting<string>(KEY).catch(() => null);
  if (stored) return `h3-sesion:${stored}`;
  const fresh = b64(crypto.getRandomValues(new Uint8Array(32)));
  await putSetting(KEY, fresh);
  // Si dos inicios de sesión crearon llave al mismo tiempo, gana la que quedó guardada
  return `h3-sesion:${(await getSetting<string>(KEY)) ?? fresh}`;
}
