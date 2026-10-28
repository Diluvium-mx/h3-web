// Sesión del administrador: cookie firmada con HMAC (Web Crypto),
// funciona tanto en el proxy como en Server Actions.

export const SESSION_COOKIE = "h3_admin";
export const SESSION_DAYS = 30;

const encoder = new TextEncoder();

// Llave para firmar la sesión. Si no se configuró AUTH_SECRET, se usa la llave de Upstash (que ya es
// secreta y existe cuando el panel puede guardar), así el dueño no tiene que configurar nada más.
function secret() {
  const s =
    process.env.AUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;
  if (s) return `h3-sesion:${s}`;
  if (process.env.NODE_ENV !== "production") return "dev-secret-h3";
  return null;
}

export function sessionConfigured() {
  return secret() !== null;
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
export async function createSessionToken(version: string) {
  const key = secret();
  if (!key) throw new Error("Para usar el panel publicado hay que conectar Upstash (ver README)");
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `admin.${expires}.${version}`;
  return `${payload}.${await hmac(payload, key)}`;
}

export function sessionVersion(token: string | undefined) {
  return token?.split(".")[2] ?? "";
}

export async function verifySessionToken(token: string | undefined) {
  const key = secret();
  if (!token || !key) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expires = Number(payload.split(".")[1]);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  return safeEqual(sig, await hmac(payload, key));
}
