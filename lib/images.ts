import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { cloudinaryEnabled, destroyByUrls, isOwnCloudinaryUrl, uploadFromUrl } from "./cloudinary";

// Fotos: en producción viven en Cloudinary. En desarrollo local, sin Cloudinary,
// se guardan en public/uploads.
export { cloudinaryEnabled };

const UPLOADS_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "uploads");

export function isAllowedImageUrl(url: string) {
  if (url.startsWith("/uploads/") && !url.includes("..")) return true;
  if (isOwnCloudinaryUrl(url)) return true;
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && hostname === "cdn.shopify.com";
  } catch {
    return false;
  }
}

function assertLocal() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Conecta Cloudinary para poder subir fotos (ver README).");
  }
}

// Respaldo local (desarrollo): guarda la foto en public/uploads
export async function saveImage(name: string, data: Blob | ArrayBuffer, contentType: string) {
  assertLocal();
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const ext = contentType.includes("webp") ? "webp" : contentType.includes("png") ? "png" : "jpg";
  const file = `${name.replace(/\.[a-z]+$/i, "")}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const buffer = data instanceof Blob ? Buffer.from(await data.arrayBuffer()) : Buffer.from(data);
  await fs.writeFile(/*turbopackIgnore: true*/ path.join(UPLOADS_DIR, file), buffer);
  return `/uploads/${file}`;
}

// Copia una foto que ya está en internet (importación de Shopify)
export async function storeRemoteImage(sourceUrl: string, name: string) {
  if (cloudinaryEnabled) return uploadFromUrl(sourceUrl);
  assertLocal();
  const r = await fetch(`${sourceUrl}${sourceUrl.includes("?") ? "&" : "?"}width=1600`, {
    headers: { Accept: "image/webp,image/jpeg" },
  });
  if (!r.ok) throw new Error(`No se pudo descargar ${sourceUrl}`);
  return saveImage(name, await r.arrayBuffer(), r.headers.get("content-type") ?? "image/jpeg");
}

export async function deleteImages(urls: string[]) {
  await destroyByUrls(urls).catch(() => {});
  for (const u of urls.filter((u) => u.startsWith("/uploads/") && !u.includes(".."))) {
    await fs.unlink(/*turbopackIgnore: true*/ path.join(UPLOADS_DIR, path.basename(u))).catch(() => {});
  }
}
