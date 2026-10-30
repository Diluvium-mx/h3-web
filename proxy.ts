import { NextResponse, type NextRequest } from "next/server";
import { envSessionSecret, SESSION_COOKIE, sessionLooksValid, verifySessionToken } from "@/lib/session";

// Revisión rápida: si no hay sesión válida, manda al login.
// Cada página y acción del panel vuelve a verificar la sesión (con su firma) en el servidor.
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const key = envSessionSecret();
  // Con la llave en Netlify Blobs (sin variables de entorno), aquí solo se revisa la forma y la fecha
  const ok = key ? await verifySessionToken(token, key) : sessionLooksValid(token);
  if (!ok) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
