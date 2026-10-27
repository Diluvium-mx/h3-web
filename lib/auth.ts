import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./session";

export async function isAdmin() {
  // La verificación usa la hora actual: siempre en tiempo de petición
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
