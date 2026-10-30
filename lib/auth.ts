import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { passwordVersion } from "./admin-password";
import { SESSION_COOKIE, sessionVersion, verifySessionToken } from "./session";
import { sessionSecret } from "./session-secret";

export async function isAdmin() {
  // La verificación usa la hora actual: siempre en tiempo de petición
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token, await sessionSecret()))) return false;
  // Si la contraseña cambió después de entrar, la sesión ya no vale
  return sessionVersion(token) === (await passwordVersion());
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
