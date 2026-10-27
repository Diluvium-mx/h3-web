"use client";

import { upload } from "@vercel/blob/client";
import { uploadImageAction } from "./actions";

// Reduce las fotos del celular (5–10 MB) a ~300 KB antes de subirlas.
export async function compressImage(file: File, maxSide = 1800, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => null);
  if (!bitmap) throw new Error(`No se pudo leer "${file.name}". Usa fotos JPG o PNG.`);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Tu navegador no permite procesar imágenes");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
  // Safari no codifica WebP: en ese caso usa JPEG
  const webp = await toBlob("image/webp");
  if (webp && webp.type === "image/webp") return webp;
  const jpeg = await toBlob("image/jpeg");
  if (!jpeg) throw new Error("No se pudo comprimir la foto");
  return jpeg;
}

export async function uploadPhoto(
  file: File,
  baseName: string,
  mode: "blob" | "local",
  onProgress?: (pct: number) => void,
) {
  const blob = await compressImage(file);
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const name = `${baseName || "auto"}.${ext}`;
  if (mode === "blob") {
    const result = await upload(`autos/${name}`, blob, {
      access: "public",
      handleUploadUrl: "/api/upload",
      contentType: blob.type,
      onUploadProgress: ({ percentage }) => onProgress?.(percentage),
    });
    return result.url;
  }
  const fd = new FormData();
  fd.append("file", new File([blob], name, { type: blob.type }));
  onProgress?.(50);
  const res = await uploadImageAction(fd);
  if (!res.ok) throw new Error(res.error);
  onProgress?.(100);
  return res.url;
}
