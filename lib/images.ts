import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { del, put } from "@vercel/blob";

export const blobEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const UPLOADS_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "uploads");

export function isAllowedImageUrl(url: string) {
  if (url.startsWith("/uploads/") && !url.includes("..")) return true;
  try {
    const { protocol, hostname } = new URL(url);
    return (
      protocol === "https:" &&
      (hostname.endsWith(".public.blob.vercel-storage.com") || hostname === "cdn.shopify.com")
    );
  } catch {
    return false;
  }
}

export async function saveImage(name: string, data: Blob | ArrayBuffer, contentType: string) {
  if (blobEnabled) {
    const blob = await put(`autos/${name}`, data, {
      access: "public",
      addRandomSuffix: true,
      contentType,
    });
    return blob.url;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("Conecta Vercel Blob para poder subir fotos.");
  }
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const ext = contentType.includes("webp") ? "webp" : contentType.includes("png") ? "png" : "jpg";
  const file = `${name.replace(/\.[a-z]+$/i, "")}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const buffer = data instanceof Blob ? Buffer.from(await data.arrayBuffer()) : Buffer.from(data);
  await fs.writeFile(/*turbopackIgnore: true*/ path.join(UPLOADS_DIR, file), buffer);
  return `/uploads/${file}`;
}

export async function deleteImages(urls: string[]) {
  const blobUrls = urls.filter((u) => u.includes(".blob.vercel-storage.com"));
  if (blobEnabled && blobUrls.length) await del(blobUrls).catch(() => {});
  for (const u of urls.filter((u) => u.startsWith("/uploads/") && !u.includes(".."))) {
    await fs.unlink(/*turbopackIgnore: true*/ path.join(UPLOADS_DIR, path.basename(u))).catch(() => {});
  }
}
