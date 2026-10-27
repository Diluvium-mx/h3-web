"use client";

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

type SignedUpload = {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  transformation: string;
  signature: string;
};

// Sube directo del navegador a Cloudinary con una firma que da el servidor (solo a administradores)
async function uploadToCloudinary(blob: Blob, onProgress?: (pct: number) => void) {
  const res = await fetch("/api/upload", { method: "POST" });
  const signed = (await res.json()) as SignedUpload & { error?: string };
  if (!res.ok) throw new Error(signed.error ?? "No se pudo preparar la subida");
  const fd = new FormData();
  fd.append("file", blob);
  fd.append("api_key", signed.apiKey);
  fd.append("folder", signed.folder);
  fd.append("timestamp", String(signed.timestamp));
  fd.append("transformation", signed.transformation);
  fd.append("signature", signed.signature);
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.((e.loaded / e.total) * 100);
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText) as { secure_url?: string; error?: { message: string } };
        if (xhr.status < 300 && json.secure_url) resolve(json.secure_url);
        else reject(new Error(json.error?.message ?? "Cloudinary no aceptó la foto"));
      } catch {
        reject(new Error("Respuesta inválida de Cloudinary"));
      }
    };
    xhr.onerror = () => reject(new Error("Sin conexión al subir la foto"));
    xhr.send(fd);
  });
}

export async function uploadPhoto(
  file: File,
  baseName: string,
  mode: "cloudinary" | "local",
  onProgress?: (pct: number) => void,
) {
  const blob = await compressImage(file);
  if (mode === "cloudinary") return uploadToCloudinary(blob, onProgress);
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const fd = new FormData();
  fd.append("file", new File([blob], `${baseName || "auto"}.${ext}`, { type: blob.type }));
  onProgress?.(50);
  const res = await uploadImageAction(fd);
  if (!res.ok) throw new Error(res.error);
  onProgress?.(100);
  return res.url;
}
