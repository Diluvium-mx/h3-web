// Sesión del administrador: cookie firmada con HMAC (Web Crypto),
// funciona tanto en el proxy como en Server Actions.

export const SESSION_COOKIE = "h3_admin";
export const SESSION_DAYS = 30;

const encoder = new TextEncoder();

// Llave para firmar la sesión, desde variables de entorno. Si no se configuró AUTH_SECRET, se usa la llave
// de Upstash (que ya es secreta). En Netlify sin ninguna de ellas, el servidor usa una llave al azar guardada
// en Netlify Blobs (ver lib/session-secret.ts); este archivo también corre en el proxy, que no la lee.
export function envSessionSecret() {
  const s =
    process.env.AUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;
  if (s) return `h3-sesion:${s}`;
  if (process.env.NODE_ENV !== "production") return "dev-secret-h3";
  return null;
}

async function hmac(value: string, key: string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(value)));
  // base64url sin Buffer: funciona igual en Node y en Edge (el proxy de Netlify corre en Edge)
  return btoa(String.fromCharCode(...sig))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// `version` cambia cuando el dueño cambia la contraseña: así se cierran las sesiones abiertas con la anterior
export async function createSessionToken(version: string, key: string) {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `admin.${expires}.${version}`;
  return `${payload}.${await hmac(payload, key)}`;
}

export function sessionVersion(token: string | undefined) {
  return token?.split(".")[2] ?? "";
}

// Sin firma: solo revisa que la sesión tenga la forma correcta y no haya vencido (para el proxy cuando la
// llave vive en Netlify Blobs; cada página y acción del panel verifica la firma completa en el servidor)
export function sessionLooksValid(token: string | undefined) {
  const expires = Number(token?.split(".")[1]);
  return Boolean(token?.startsWith("admin.")) && Number.isFinite(expires) && expires > Date.now();
}

export async function verifySessionToken(token: string | undefined, key: string | null) {
  if (!token || !key || !sessionLooksValid(token)) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  return safeEqual(token.slice(i + 1), await hmac(token.slice(0, i), key));
}
