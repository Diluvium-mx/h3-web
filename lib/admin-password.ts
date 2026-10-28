import "server-only";
import { getSetting, putSetting } from "./storage";

// Contraseña del panel.
// 1. Si el dueño la cambió en el panel, vale la guardada (cifrada con PBKDF2, nunca en texto).
// 2. Si no, la de la variable ADMIN_PASSWORD.
// 3. Si no hay ninguna, la inicial: 12345 (decisión del dueño, 28-oct). El panel pide cambiarla.
export const DEFAULT_ADMIN_PASSWORD = "12345";
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
  try {
    return await getSetting<string>(KEY);
  } catch {
    return null;
  }
}

// Huella de la contraseña guardada (sin revelarla); va dentro de la sesión
export async function passwordVersion() {
  const stored = await storedHash();
  return stored ? stored.split("$")[3].replace(/[^A-Za-z0-9]/g, "").slice(0, 10) : "0";
}

export async function usingDefaultPassword() {
  return !(await storedHash()) && !process.env.ADMIN_PASSWORD;
}

export async function verifyAdminPassword(input: string) {
  const stored = await storedHash();
  if (stored) {
    const [, iterations, salt, hash] = stored.split("$");
    return sameBytes(await derive(input, fromB64(salt), Number(iterations)), fromB64(hash));
  }
  const expected = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  // Se compara el derivado de ambas para que el tiempo no dependa del contenido
  const salt = encoder.encode("h3-comparacion");
  return sameBytes(await derive(input, salt, 1000), await derive(expected, salt, 1000));
}

export async function setAdminPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, ITERATIONS);
  await putSetting(KEY, `pbkdf2$${ITERATIONS}$${b64(salt)}$${b64(hash)}`);
}
