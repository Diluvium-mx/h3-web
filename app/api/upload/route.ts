import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { cloudinaryEnabled, signedUploadParams } from "@/lib/cloudinary";

// Firma la subida para que el navegador del administrador mande la foto directo a Cloudinary
// (la foto no pasa por el hosting, así no gasta tráfico ni tiene límite de tamaño de la función).
export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!cloudinaryEnabled) {
    return NextResponse.json({ error: "Cloudinary no está configurado" }, { status: 400 });
  }
  return NextResponse.json(signedUploadParams());
}
