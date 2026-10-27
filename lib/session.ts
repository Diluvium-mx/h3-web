// Sesión del administrador: cookie firmada con HMAC (Web Crypto),
// funciona tanto en el proxy como en Server Actions.

export const SESSION_COOKIE = "h3_admin";
export const SESSION_DAYS = 30;

const encoder = new TextEncoder();

function secret() {
  const s = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD;
  if (s) return s;
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

export async function createSessionToken() {
  const key = secret();
  if (!key) throw new Error("Falta configurar ADMIN_PASSWORD");
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `admin.${expires}`;
  return `${payload}.${await hmac(payload, key)}`;
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

export async function checkPassword(input: string) {
  const expected =
    process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "h3admin" : "");
  if (!expected) return false;
  // Compara hashes para que el tiempo no dependa del contenido
  const [a, b] = await Promise.all([hmac(input, "pw"), hmac(expected, "pw")]);
  return safeEqual(a, b);
}
