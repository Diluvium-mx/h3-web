import "server-only";
import { getSetting, putSetting } from "./storage";

// Contraseña del panel. Nunca se escribe en el repositorio (es público).
// 1. La que se guardó en Panel → Ajustes (cifrada con PBKDF2 en el almacén, nunca en texto).
// 2. Si no, la de la variable ADMIN_PASSWORD (solo para pruebas: también firma las sesiones).
// 3. En desarrollo local, sin ninguna de las dos: «h3-local». En producción no hay contraseña de respaldo.
const DEV_PASSWORD = process.env.NODE_ENV === "production" ? null : "h3-local";
const KEY = "adminPassword";
const ITERATIONS = 210_000;
const encoder = new TextEncoder();

const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function derive(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    256,
  );
  return new Uint8Array(bits);
}

function sameBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function storedHash() {
  // Si el almacén no responde, se marca el error: nunca se entra sin contraseña por una falla
  return getSetting<string>(KEY);
}

// Huella de la contraseña guardada (sin revelarla); va dentro de la sesión
export async function passwordVersion() {
  const stored = await storedHash();
  return stored ? stored.split("$")[3].replace(/[^A-Za-z0-9]/g, "").slice(0, 10) : "0";
}

export async function verifyAdminPassword(input: string) {
  const stored = await storedHash();
  if (stored) {
    const [, iterations, salt, hash] = stored.split("$");
    return sameBytes(await derive(input, fromB64(salt), Number(iterations)), fromB64(hash));
  }
  const expected = process.env.ADMIN_PASSWORD || DEV_PASSWORD;
  if (!expected) return false;
  // Se compara el derivado de ambas para que el tiempo no dependa del contenido
  const salt = encoder.encode("h3-comparacion");
  return sameBytes(await derive(input, salt, 1000), await derive(expected, salt, 1000));
}

export async function setAdminPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, ITERATIONS);
  await putSetting(KEY, `pbkdf2$${ITERATIONS}$${b64(salt)}$${b64(hash)}`);
}
